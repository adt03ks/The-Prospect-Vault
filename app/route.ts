import { NextRequest,NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "../../../../lib/tpv/supabase";
export const runtime="nodejs";

export async function POST(req:NextRequest){
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!);
  const signature=req.headers.get("stripe-signature");
  if(!signature) return new NextResponse("Missing signature",{status:400});
  let event:Stripe.Event;
  try {
    event=stripe.webhooks.constructEvent(await req.text(),signature,
      process.env.STRIPE_DOMAIN_WEBHOOK_SECRET!);
  }catch {return new NextResponse("Invalid Stripe signature",{status:400});}
  if(event.type==="checkout.session.completed"||event.type==="checkout.session.async_payment_succeeded"){
    const session=event.data.object as Stripe.Checkout.Session;
    if(session.payment_status==="paid"){
      const orderId=session.metadata?.tpv_domain_order_id;
      if(!orderId) return new NextResponse("Missing order ID",{status:400});
      const db=adminDb();
      const {data:order,error:readError}=await db.from("tpv_domain_orders").select("*").eq("id",orderId).maybeSingle();
      if(readError||!order) return new NextResponse("Order not found",{status:500});
      if(order.stripe_checkout_session_id && order.stripe_checkout_session_id!==session.id)
        return new NextResponse("Session mismatch",{status:400});
      if(session.amount_total!==order.registrar_cost_cents+order.platform_fee_cents)
        return new NextResponse("Amount mismatch",{status:400});
      const {error}=await db.from("tpv_domain_orders").update({status:"paid",updated_at:new Date().toISOString()})
        .eq("id",orderId).eq("status","awaiting_payment");
      if(error) return new NextResponse("Database failure",{status:500});
    }
  }
  return NextResponse.json({received:true});
}
