"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";

const stripePromise=loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY??"");
type Athlete={id:string;athlete_slug:string};
const requiredFields=["firstName","lastName","email","phone","address1","city","state","zip","country"] as const;
const fieldLabel:Record<string,string>={firstName:"First name (adult registrant)",lastName:"Last name",email:"Registrant email",
  phone:"Phone (+1...)",address1:"Street address",city:"City",state:"State or province",zip:"Postal code",country:"Two-letter country (e.g. US)"};

function CheckoutInner(){
  const params=useSearchParams();
  const domain=params.get("domain")??"";
  const [athletes,setAthletes]=useState<Athlete[]>([]);
  const [athleteId,setAthleteId]=useState("");
  const [contact,setContact]=useState<Record<string,string>>({country:"US"});
  const [acceptedTerms,setAcceptedTerms]=useState(false);
  const [isAdultRegistrant,setIsAdultRegistrant]=useState(false);
  const [fetchSecret,setFetchSecret]=useState<null|(()=>Promise<string>)>(null);
  const [total,setTotal]=useState<number|null>(null);
  const [error,setError]=useState("");
  const [working,setWorking]=useState(false);
  useEffect(()=>{
    fetch("/api/domains/checkout").then(async res=>{
      const data=await res.json();if(!res.ok) throw Error(data.error??"Please sign in");
      setAthletes(data.athletes??[]);
    }).catch(e=>setError(String(e.message)));
  },[]);
  async function start(e:React.FormEvent){
    e.preventDefault();setError("");setWorking(true);
    try{
      const res=await fetch("/api/domains/checkout",{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({domain,athleteId,contact,acceptedTerms,isAdultRegistrant})});
      const data=await res.json();if(!res.ok) throw Error(data.error??"Checkout unavailable");
      setTotal(data.totalCents);
      setFetchSecret(()=>async()=>data.clientSecret);
    }catch(e){setError(e instanceof Error?e.message:"Unable to begin checkout");}
    finally{setWorking(false);}
  }
  return <main style={{maxWidth:650,margin:"5vh auto",padding:28}}>
    <h1>Secure {domain}</h1>
    {error&&<p role="alert" style={{color:"crimson"}}>{error}</p>}
    {fetchSecret?<><p>Checkout total: ${(total!/100).toFixed(2)} USD (tax treatment must be configured).</p>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{fetchClientSecret:fetchSecret}}>
        <EmbeddedCheckout/>
      </EmbeddedCheckoutProvider>
    </>:<form onSubmit={start} style={{display:"grid",gap:12}}>
      <label>Athlete profile
        <select value={athleteId} onChange={e=>setAthleteId(e.target.value)} required>
          <option value="">Select an athlete</option>
          {athletes.map(a=><option key={a.id} value={a.id}>{a.athlete_slug}</option>)}
        </select>
      </label>
      {!athletes.length&&<p>Your signed-in account needs an athlete profile linked before checkout.</p>}
      <h2>Adult registrant details</h2>
      <p>Provide accurate legal details. An adult parent or guardian should register domains for minors.</p>
      {requiredFields.map(key=><label key={key}>{fieldLabel[key]}
        <input required type={key==="email"?"email":"text"} value={contact[key]??""}
          onChange={e=>setContact({...contact,[key]:e.target.value})}/>
      </label>)}
      <label><input type="checkbox" checked={isAdultRegistrant} onChange={e=>setIsAdultRegistrant(e.target.checked)}/>
        I am at least 18 and authorized to register this domain.</label>
      <label><input type="checkbox" checked={acceptedTerms} onChange={e=>setAcceptedTerms(e.target.checked)}/>
        I agree to the domain registration terms, refund policy, privacy policy, and renewal terms. I will review the final price before submitting payment.</label>
      <p>The final total includes the domain registration quote plus a platform setup fee (configured on the server). The one-year domain registration becomes non-refundable after registrar completion. Auto-renew is not enabled in this starter.</p>
      <button disabled={working||!athleteId||!acceptedTerms||!isAdultRegistrant}>
        {working?"Preparing...":"Review secure payment"}
      </button>
    </form>}
  </main>;
}
export default function CheckoutPage() {
  return <Suspense fallback={<p>Loading checkout...</p>}><CheckoutInner/></Suspense>;
}
