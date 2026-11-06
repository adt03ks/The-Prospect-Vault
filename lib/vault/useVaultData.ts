'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { vaultClient } from './browser';
import type { Account, AthleteProfile, Contacts, MediaItem, Stats } from './types';

export function useVaultData() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contacts | null>(null);

  const refresh = useCallback(async () => {
    setError('');
    const supabase = vaultClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) { router.replace('/portal/login'); setLoading(false); return; }
    const id = auth.user.id;
    setUserId(id);
    const [accountResult, profileResult, mediaResult, statsResult, contactsResult] = await Promise.all([
      supabase.from('vault_accounts').select('*').eq('id', id).maybeSingle(),
      supabase.from('vault_athlete_profiles').select('*').eq('account_id', id).maybeSingle(),
      supabase.from('vault_media').select('*').eq('account_id', id).order('created_at', { ascending: true }),
      supabase.from('vault_stats').select('*').eq('account_id', id).maybeSingle(),
      supabase.from('vault_recruiting_contacts').select('*').eq('account_id', id).maybeSingle()
    ]);
    const firstError = [accountResult, profileResult, mediaResult, statsResult, contactsResult].find(x => x.error)?.error;
    if (firstError) setError(firstError.message);
    if (!accountResult.data && !firstError) setError('Your membership record is missing. Verify the Supabase migration and account trigger.');
    setAccount(accountResult.data as Account | null);
    setProfile(profileResult.data as AthleteProfile | null);
    setMedia((mediaResult.data || []) as MediaItem[]);
    setStats(statsResult.data as Stats | null);
    setContacts(contactsResult.data as Contacts | null);
    setLoading(false);
  }, [router]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { loading, error, userId, account, profile, media, stats, contacts, refresh };
}
