import "server-only";
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

export const normalizeDomain = (value: string) => value.trim().toLowerCase();
export const supported = (value: string) => /^(?!-)[a-z0-9-]{2,63}(?<!-)\.com$/.test(value);

export function usdCents(value: unknown): number {
  if (typeof value !== "number" && !(typeof value === "string" && /^\d+(\.\d{1,2})?$/.test(value))) {
    throw new Error("Unexpected registrar price representation");
  }
  const cents = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(cents) || cents < 1) throw new Error("Invalid price");
  return cents;
}
export type DomainResult = { domain: string; available: boolean; price?: number | string; renewalPrice?: number | string; years?: number; premium?: boolean };

export async function lookup(domains: string[]): Promise<DomainResult[]> {
  const response = await fetch("https://api.vercel.com/v1/registrar/domains/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domains }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Domain search provider temporarily unavailable");
  const json = await response.json();
  // Confirm your live response shape before enabling checkout.
  const rows = Array.isArray(json) ? json : json.results ?? json.domains;
  if (!Array.isArray(rows)) throw new Error("Unexpected registrar search response");
  return rows;
}

function key() {
  const raw = Buffer.from(process.env.DOMAIN_CONTACT_ENCRYPTION_KEY_BASE64 ?? "", "base64");
  if (raw.length !== 32) throw new Error("DOMAIN_CONTACT_ENCRYPTION_KEY_BASE64 must decode to 32 bytes");
  return raw;
}
export function encryptContact(contact: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const payload = Buffer.concat([cipher.update(JSON.stringify(contact), "utf8"), cipher.final()]);
  return `${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${payload.toString("base64")}`;
}
export function decryptContact(payload: string): unknown {
  const [iv, tag, data] = payload.split(".");
  if (!iv || !tag || !data) throw new Error("Invalid contact payload");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv,"base64"));
  decipher.setAuthTag(Buffer.from(tag,"base64"));
  return JSON.parse(Buffer.concat([
    decipher.update(Buffer.from(data,"base64")), decipher.final()
  ]).toString("utf8"));
}
export async function attachDomain(domain: string) {
  const team = process.env.VERCEL_TEAM_ID!;
  const project = process.env.VERCEL_PROJECT_ID!;
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${encodeURIComponent(project)}/domains?teamId=${encodeURIComponent(team)}`,
    { method: "POST", headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
    }, body: JSON.stringify({name: domain}), cache:"no-store" }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(`Project domain attachment failed (${res.status}): ${JSON.stringify(json).slice(0,300)}`);
  return { verified: json.verified === true };
}

export async function inspectAttachedDomain(domain:string):Promise<{verified:boolean}>{
  const team=process.env.VERCEL_TEAM_ID!;
  const project=process.env.VERCEL_PROJECT_ID!;
  const response=await fetch(
    `https://api.vercel.com/v9/projects/${encodeURIComponent(project)}/domains/${encodeURIComponent(domain)}?teamId=${encodeURIComponent(team)}`,
    {headers:{Authorization:`Bearer ${process.env.VERCEL_API_TOKEN}`},cache:"no-store"}
  );
  if(!response.ok) throw new Error(`Could not inspect project domain (${response.status})`);
  const info=await response.json();
  return {verified:info.verified===true};
}
