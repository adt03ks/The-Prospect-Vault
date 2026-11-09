import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

// Safety gate while registrar purchasing and Stripe fulfillment are incomplete.
// Search remains available; no payment is accepted by this endpoint.
function notReady() {
  return NextResponse.json(
    { error: 'Domain checkout is not yet enabled. No payment was taken.' },
    { status: 503 }
  );
}
export async function GET() { return notReady(); }
export async function POST() { return notReady(); }
