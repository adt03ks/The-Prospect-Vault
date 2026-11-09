import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb, requireUser } from "../../../../lib/tpv/supabase";
import { encryptContact, lookup, normalizeDomain, supported, usdCents } from "../../../../lib/tpv/domain";

export const runtime = "nodejs";
function error(message:string,status=400){return NextResponse.json({error:message},{status});}
const contactFields=["firstName","lastName","email","phone","address1","city","state","zip","country"] as const;

export async function GET() {
  try {
    const user=await requireUser();
    const {data,error:dbError}=await adminDb().from("tpv_domain_athletes")
      .select("id,athlete_slug").eq("owner_user_id",user.id).order("athlete_slug");
    if(dbError) throw dbError;
    return NextResponse.json({athletes:data});
  } catch(e){return error(e instanceof Error?e.message:"Sign-in required",401);}
}
export async function POST(req:NextRequest) {
  try {
    // FAIL CLOSED: do not take a payment until the real Registrar API purchase
    // adapter has been implemented, tested, and switched on.
    if(process.env.REGISTRAR_PURCHASE_ENABLED!=="true")
      return error("Purchases are not enabled yet. Domain search is available.",503);
    const user=await requireUser();
    const body=await req.json();
    const domain=normalizeDomain(String(body.domain??""));
    if(!supported(domain)) return error("Only standard .com names supported in this release");
    const athleteId=String(body.athleteId??"");
    const {data:athlete,error:ownerError}=await adminDb().from("tpv_domain_athletes")
      .select("id").eq("id",athleteId).eq("owner_user_id",user.id).maybeSingle();
    if(ownerError||!athlete) return error("Athlete profile not found or access denied",403);
    if(body.acceptedTerms!==true || body.isAdultRegistrant!==true)
      return error("Adult registrant and terms confirmation are required");
    const contact:Record<string,string>={};
    for(const f of contactFields) {
      const val=String(body.contact?.[f]??"").trim();
      if(!val || val.length>150) return error(`Invalid registrant field: ${f}`);
      contact[f]=val;
    }
    if(!/^\+\d{10,15}$/.test(contact.phone)) return error("Phone must use international format, e.g. +15551234567");
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) return error("Invalid registrant email");
    if(!/^[A-Z]{2}$/.test(contact.country)) return error("Country must be 2 uppercase letters");
    const result=(await lookup([domain]))[0];
    if(!result||result.domain!==domain||!result.available||result.price==null||result.premium)
      return error("This domain is unavailable, premium-priced, or cannot be quoted",409);
    if(result.years && result.years!==1) return error("Only one-year registrations supported",409);
    const registrar_cost_cents=usdCents(result.price);
    const platform_fee_cents=Number(process.env.DOMAIN_PLATFORM_FEE_CENTS??"1500");
    if(!Number.isSafeInteger(platform_fee_cents)||platform_fee_cents<0)
      throw new Error("Invalid platform fee configuration");
    const db=adminDb();
    const {data:active}=await db.from("tpv_domain_orders").select("id")
      .eq("domain",domain).in("status",["awaiting_payment","paid","registering","registration_pending","connecting","active","needs_review"]).limit(1);
    if(active?.length) return error("This domain is already being processed",409);
    const {data:order,error:insertError}=await db.from("tpv_domain_orders").insert({
      owner_user_id:user.id, athlete_id:athlete.id, domain, registration_years:1,
      registrar_cost_cents,platform_fee_cents,encrypted_contact:encryptContact(contact),
      status:"awaiting_payment",
    }).select("id").single();
    if(insertError?.code==="23505") return error("A checkout is already underway for this domain. Try again after the checkout expires.",409);
    if(insertError||!order) throw insertError??new Error("Could not prepare domain order");
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);
    const site=process.env.NEXT_PUBLIC_SITE_URL!;
    const session=await stripe.checkout.sessions.create({
      mode:"payment",
      ui_mode:"embedded",
      return_url:`${site}/domains/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email:user.email??undefined,
      payment_method_types:["card"],
      billing_address_collection:"required",
      line_items:[{quantity:1,price_data:{
        currency:"usd",unit_amount:registrar_cost_cents+platform_fee_cents,
        product_data:{name:`${domain} — 1-year registration and Prospect Vault setup`},
      }}],
      metadata:{tpv_domain_order_id:order.id},
      client_reference_id:order.id,
      expires_at:Math.floor(Date.now()/1000)+1800,
    });
    const {error:updateError}=await db.from("tpv_domain_orders")
      .update({stripe_checkout_session_id:session.id,updated_at:new Date().toISOString()}).eq("id",order.id);
    if(updateError) throw updateError;
    if(!session.client_secret) throw new Error("Stripe did not return an embedded checkout secret");
    return NextResponse.json({clientSecret:session.client_secret,
      totalCents:registrar_cost_cents+platform_fee_cents});
  } catch(e) {
    const message=e instanceof Error?e.message:"Could not begin checkout";
    return error(message==="SIGN_IN_REQUIRED"?"Please sign in first":message,
      message==="SIGN_IN_REQUIRED"?401:500);
  }
}
