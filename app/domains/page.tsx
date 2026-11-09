"use client";
import { useState } from "react";

type Domain = {domain:string;available:boolean;price?:number|string;renewalPrice?:number|string;years?:number;premium?:boolean};
export default function DomainPage() {
  const [name,setName] = useState("");
  const [results,setResults] = useState<Domain[]>([]);
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  async function search(e:React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(""); setResults([]);
    try {
      const res=await fetch("/api/domains/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});
      const json=await res.json();
      if(!res.ok) throw new Error(json.error||"Search failed");
      setResults(json.results);
    } catch(e) {setError(e instanceof Error?e.message:"Search failed");}
    finally {setBusy(false);}
  }
  return <main style={{maxWidth:730,margin:"8vh auto",padding:24,color:"#eee",background:"#101014",borderRadius:18}}>
    <h1>Claim Your Athlete Domain</h1>
    <p>Secure your personal recruiting website address with The Prospect Vault.</p>
    <form onSubmit={search} style={{display:"flex",gap:10}}>
      <input aria-label="Athlete domain name" value={name} onChange={e=>setName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""))}
       placeholder="jordanwilliams" required style={{flex:1,padding:14}}/>
      <span style={{alignSelf:"center"}}>.com</span>
      <button disabled={busy} type="submit">{busy?"Searching...":"Search"}</button>
    </form>
    {error&&<p role="alert">{error}</p>}
    {results.map(r=><section key={r.domain} style={{marginTop:20,border:"1px solid #c5a662",padding:18,borderRadius:10}}>
      <h2>{r.domain}</h2>
      <p>{r.available?"Available":"Unavailable or not confirmed"}</p>
      {r.available&&<><p>Registration: {r.price==null?"Quote unavailable":`$${r.price}`} | Renewal: {r.renewalPrice==null?"Quote unavailable":`$${r.renewalPrice}`} {r.years?`(${r.years} year term)`:""}</p>
      {r.premium&&<p>Premium-priced domain</p>}
      <a style={{color:"#f9d67a"}} href={`/domains/checkout?domain=${encodeURIComponent(r.domain)}`}>Purchase this domain</a>
      </>}
      <small style={{display:"block",marginTop:10}}>Prices and availability are estimates until the checkout quote is confirmed.</small>
    </section>)}
  </main>;
}
