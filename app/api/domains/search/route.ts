import { NextRequest, NextResponse } from "next/server";
import { lookup, supported, normalizeDomain } from "../../../../lib/tpv/domain";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = normalizeDomain(String(body.name ?? ""));
    if (!/^[a-z0-9-]{2,63}$/.test(name) || name.startsWith("-") || name.endsWith("-"))
      return NextResponse.json({error:"Enter a valid domain name"}, {status:400});
    const domain = `${name}.com`;
    if (!supported(domain)) return NextResponse.json({error:"Unsupported domain"}, {status:400});
    const results = await lookup([domain]);
    return NextResponse.json({results});
  } catch (err) {
    return NextResponse.json({error: err instanceof Error ? err.message : "Search failed"}, {status:503});
  }
}
