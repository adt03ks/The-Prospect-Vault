import { NextRequest,NextResponse } from "next/server";
import { requireUser,adminDb } from "../../../../lib/tpv/supabase";
export async function GET(req:NextRequest){
  try{
    const user=await requireUser();
    const sessionId=req.nextUrl.searchParams.get("session_id")??"";
    if(!sessionId.startsWith("cs_")) return NextResponse.json({error:"Invalid session"},{status:400});
    const {data,error}=await adminDb().from("tpv_domain_orders")
      .select("domain,status,registrar_order_id").eq("owner_user_id",user.id)
      .eq("stripe_checkout_session_id",sessionId).maybeSingle();
    if(error||!data) return NextResponse.json({error:"Not found"},{status:404});
    return NextResponse.json({order:data});
  }catch{return NextResponse.json({error:"Sign in required"},{status:401});}
}
