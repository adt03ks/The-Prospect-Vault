import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { adminDb } from "../../../lib/tpv/supabase";

// Replace this branded shell with the real athlete-profile component already
// used by The Prospect Vault. Never render profiles based solely on a query
// parameter; the domain-to-athlete mapping is checked in the database.
export default async function AthleteDomainPage(){
  const host=(await headers()).get("host")?.split(":")[0]?.toLowerCase();
  if(!host) notFound();
  const db=adminDb();
  const {data:order}=await db.from("tpv_domain_orders").select("athlete_id")
    .eq("domain",host).eq("status","active").maybeSingle();
  if(!order) notFound();
  const {data:athlete}=await db.from("tpv_domain_athletes")
    .select("athlete_slug").eq("id",order.athlete_id).maybeSingle();
  if(!athlete) notFound();
  return <main style={{background:"#101014",color:"#fff",padding:"8vh 8vw",minHeight:"100vh"}}>
    <p style={{letterSpacing:3,color:"#d5b36f"}}>THE PROSPECT VAULT</p>
    <h1 style={{fontSize:"clamp(2rem,6vw,5rem)"}}>{athlete.athlete_slug.replace(/-/g," ")}</h1>
    <p>This athlete's personal domain is connected. The existing full profile component should be mounted here.</p>
    <a style={{color:"#eacb80"}} href={`https://theprospectvault.com/athletes/${encodeURIComponent(athlete.athlete_slug)}`}>
      View athlete on The Prospect Vault
    </a>
  </main>;
}
