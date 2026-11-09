import { NextRequest,NextResponse } from "next/server";
import { adminDb } from "../../../../lib/tpv/supabase";
import Stripe from "stripe";
import { attachDomain, inspectAttachedDomain, decryptContact } from "../../../../lib/tpv/domain";
import { getRegistrarOrder, purchaseDomainAtRegistrar } from "../../../../lib/tpv/registrar";
export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(req:NextRequest) {
  if(!process.env.CRON_SECRET || req.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)
    return new NextResponse("Unauthorized",{status:401});
  if(process.env.REGISTRAR_PURCHASE_ENABLED!=="true")
    return NextResponse.json({status:"disabled",message:"Payment and registrar purchasing disabled until adapter is configured"});
  const db=adminDb();
  const report:string[]=[];
  // Release only Stripe-confirmed expired, unpaid checkouts to prevent
  // duplicate customers from paying for the same domain.
  const cutoff=new Date(Date.now()-35*60_000).toISOString();
  const {data:stale}=await db.from("tpv_domain_orders").select("id,stripe_checkout_session_id")
    .eq("status","awaiting_payment").lt("created_at",cutoff).limit(20);
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);
  for(const order of stale??[]){
    try {
      if(!order.stripe_checkout_session_id) continue; // manual review
      const session=await stripe.checkout.sessions.retrieve(order.stripe_checkout_session_id);
      if(session.status==="expired"&&session.payment_status!=="paid"){
        await db.from("tpv_domain_orders").update({status:"cancelled",
          updated_at:new Date().toISOString()}).eq("id",order.id).eq("status","awaiting_payment");
      }
    }catch{/* retry next time */}
  }
  // First reconcile existing registrar orders; do not buy a second time.
  const {data:pending}=await db.from("tpv_domain_orders").select("*").eq("status","registration_pending").limit(10);
  for(const order of pending??[]){
    try {
      const state=await getRegistrarOrder(order.registrar_order_id);
      if(state.status!=="completed") {report.push(`${order.id}:registrar:${state.status}`);continue;}
      const attachment=await attachDomain(order.domain);
      await db.from("tpv_domain_orders").update({status:attachment.verified?"active":"connecting",
        updated_at:new Date().toISOString()}).eq("id",order.id).eq("status","registration_pending");
      report.push(`${order.id}:attached`);
    } catch {report.push(`${order.id}:needs_reconciliation`);}
  }
  const {data:paid}=await db.from("tpv_domain_orders").select("*").eq("status","paid").limit(5);
  for(const order of paid??[]){
    const {data:claim}=await db.from("tpv_domain_orders")
      .update({status:"registering",updated_at:new Date().toISOString()})
      .eq("id",order.id).eq("status","paid").select("id").maybeSingle();
    if(!claim) continue;
    try {
      const registrant=decryptContact(order.encrypted_contact) as Record<string,string>;
      const result=await purchaseDomainAtRegistrar({
        domain:order.domain,years:1,expectedPriceUSD:order.registrar_cost_cents/100,registrant
      });
      await db.from("tpv_domain_orders").update({
        status:"registration_pending",registrar_order_id:result.orderId,
        updated_at:new Date().toISOString()
      }).eq("id",order.id).eq("status","registering");
      report.push(`${order.id}:submitted`);
    } catch {
      // Never automatically retry an ambiguous purchasing failure:
      // a provider may have charged but response could have timed out.
      await db.from("tpv_domain_orders").update({
        status:"needs_review",failure_reason:"Registrar purchase result requires manual reconciliation",
        updated_at:new Date().toISOString()
      }).eq("id",order.id).eq("status","registering");
      report.push(`${order.id}:needs_review`);
    }
  }

  const {data:connecting}=await db.from("tpv_domain_orders").select("id,domain")
    .eq("status","connecting").limit(10);
  for(const order of connecting??[]){
    try{
      const state=await inspectAttachedDomain(order.domain);
      if(state.verified){
        // Vercel still may need time to provision HTTPS. Monitor this
        // separately before communicating that the website is fully live.
        await db.from("tpv_domain_orders").update({status:"active",
          updated_at:new Date().toISOString()}).eq("id",order.id).eq("status","connecting");
        report.push(`${order.id}:verified`);
      }
    } catch {report.push(`${order.id}:dns_check_pending`);}
  }
  return NextResponse.json({results:report});
}
