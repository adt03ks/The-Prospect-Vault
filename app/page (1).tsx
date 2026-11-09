"use client";
import { Suspense,useEffect,useState } from "react";
import { useSearchParams } from "next/navigation";
function Status(){
  const p=useSearchParams(); const [message,setMessage]=useState("Checking payment...");
  useEffect(()=>{
    const session_id=p.get("session_id")??"";
    fetch(`/api/domains/status?session_id=${encodeURIComponent(session_id)}`).then(r=>r.json())
      .then(d=>setMessage(d.order?`${d.order.domain}: ${d.order.status}`:(d.error??"Order not found")))
      .catch(()=>setMessage("Could not check order. Please contact support."));
  },[p]);
  return <main style={{maxWidth:660,margin:"10vh auto"}}>
    <h1>Domain purchase status</h1><p>{message}</p>
    <p>Payment confirmation is not proof of registration. Your site becomes live after the registry order, DNS, and HTTPS verification complete.</p>
  </main>;
}
export default function Success(){return <Suspense fallback={<p>Loading...</p>}><Status/></Suspense>;}
