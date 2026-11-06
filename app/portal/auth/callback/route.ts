import { NextRequest, NextResponse } from 'next/server';
import { vaultServerClient } from '@/lib/vault/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const requestedNext = request.nextUrl.searchParams.get('next');
  const next = requestedNext === '/portal/reset-password' ? requestedNext : '/portal/onboarding';
  if (code) {
    const supabase = await vaultServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL('/portal/login?error=confirmation', request.url));
}
