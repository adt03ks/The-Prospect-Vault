import "server-only";

// IMPORTANT: this MUST be implemented against the CURRENT official Vercel
// Registrar API OpenAPI contract before enabling live purchases.
// We intentionally do not guess a payment-triggering HTTP endpoint or payload.
// Review https://vercel.com/docs/domains/registrar-api
// and https://openapi.vercel.sh, then replace this function.
// Use numeric expectedPrice from a fresh 1-year quote; include required
// registrant contact and TLD-specific additional fields; set auto-renew OFF.
// Preserve the provider's order ID; never retry an ambiguous registration.
export async function purchaseDomainAtRegistrar(_args:{
  domain:string; years:1; expectedPriceUSD:number;
  registrant:Record<string,string>;
}):Promise<{orderId:string}>{
  throw new Error("Registrar purchase adapter not configured: DO NOT enable checkout.");
}

export async function getRegistrarOrder(orderId:string):Promise<{status:string}> {
  const res=await fetch(`https://api.vercel.com/v1/registrar/orders/${encodeURIComponent(orderId)}?teamId=${encodeURIComponent(process.env.VERCEL_TEAM_ID!)}`,{
    headers:{Authorization:`Bearer ${process.env.VERCEL_API_TOKEN}`},cache:"no-store"
  });
  if(!res.ok) throw new Error(`Registrar order lookup failed (${res.status})`);
  const payload=await res.json();
  // The actual provider status field/values must be verified against live schema.
  return {status:String(payload.status??"unknown")};
}
