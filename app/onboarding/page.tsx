'use client';
import { Suspense, useEffect, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PLANS, SPORTS, includedPlannedFeatures, type Plan } from '@/lib/vault/catalog';
import { vaultClient } from '@/lib/vault/browser';
import { useVaultData } from '@/lib/vault/useVaultData';
import type { Metric, MediaItem } from '@/lib/vault/types';

const STEP_TITLES = ['Athlete', 'Photos', 'Videos', 'Statistics', 'Contacts', 'Package extras'];
type ProfileDraft = { athlete_name: string; sport: string; position: string; graduation_year: string; school: string; city_state: string; bio: string };
type ContactsDraft = { recruiting_email: string; coach_name: string; coach_email: string; guardian_email: string; contact_notes: string };
const EMPTY_PROFILE: ProfileDraft = { athlete_name: '', sport: '', position: '', graduation_year: '', school: '', city_state: '', bio: '' };
const EMPTY_CONTACTS: ContactsDraft = { recruiting_email: '', coach_name: '', coach_email: '', guardian_email: '', contact_notes: '' };

function MetricEditor({ name, rows, onChange }: { name: string; rows: Metric[]; onChange: (rows: Metric[]) => void }) {
  function edit(index: number, field: keyof Metric, value: string) {
    onChange(rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
  }
  return <div>
    {rows.map((metric, index) => <div className="vault-metric-row" key={`${name}-${index}`}>
      <input className="vault-input" aria-label={`${name} metric name ${index + 1}`} placeholder="Stat (e.g. 40-yard dash)" value={metric.label} maxLength={80} onChange={e => edit(index, 'label', e.target.value)} />
      <input className="vault-input" aria-label={`${name} metric value ${index + 1}`} placeholder="Value (e.g. 4.62 sec)" value={metric.value} maxLength={80} onChange={e => edit(index, 'value', e.target.value)} />
      <button type="button" aria-label={`Remove ${name} metric ${index + 1}`} onClick={() => onChange(rows.filter((_, i) => i !== index))}>✕</button>
    </div>)}
    <button type="button" className="vault-button vault-button-outline" style={{ marginTop: 12 }} disabled={rows.length >= 20} onClick={() => onChange([...rows, { label: '', value: '' }])}>+ Add statistic</button>
  </div>;
}

function Wizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { loading, error: loadError, account, userId, profile, media, stats, contacts, refresh } = useVaultData();
  const initialStep = Math.min(6, Math.max(1, Number(params.get('step')) || 1));
  const [step, setStep] = useState(initialStep);
  const [profileForm, setProfileForm] = useState<ProfileDraft>(EMPTY_PROFILE);
  const [contactsForm, setContactsForm] = useState<ContactsDraft>(EMPTY_CONTACTS);
  const [basicMetrics, setBasicMetrics] = useState<Metric[]>([{ label: '', value: '' }]);
  const [advancedMetrics, setAdvancedMetrics] = useState<Metric[]>([{ label: '', value: '' }]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => { setStep(Math.min(6, Math.max(1, Number(params.get('step')) || 1))); }, [params]);
  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      athlete_name: profile.athlete_name ?? '', sport: profile.sport ?? '',
      position: profile.position ?? '', graduation_year: profile.graduation_year?.toString() ?? '',
      school: profile.school ?? '', city_state: profile.city_state ?? '', bio: profile.bio ?? ''
    });
  }, [profile]);
  useEffect(() => { if (contacts) setContactsForm({
    recruiting_email: contacts.recruiting_email ?? '', coach_name: contacts.coach_name ?? '',
    coach_email: contacts.coach_email ?? '', guardian_email: contacts.guardian_email ?? '',
    contact_notes: contacts.contact_notes ?? ''
  }); }, [contacts]);
  useEffect(() => {
    if (!stats) return;
    setBasicMetrics(stats.basic_metrics?.length ? stats.basic_metrics : [{ label: '', value: '' }]);
    setAdvancedMetrics(stats.advanced_metrics?.length ? stats.advanced_metrics : [{ label: '', value: '' }]);
  }, [stats]);
  useEffect(() => {
    let cancelled = false;
    const supabase = vaultClient();
    const photos = media.filter(x => x.kind === 'photo' && x.storage_path);
    void Promise.all(photos.map(async photo => {
      const { data } = await supabase.storage.from('vault-athlete-media').createSignedUrl(photo.storage_path!, 3600);
      return [photo.id, data?.signedUrl ?? ''] as const;
    })).then(entries => { if (!cancelled) setPhotoUrls(Object.fromEntries(entries)); });
    return () => { cancelled = true; };
  }, [media]);

  if (loading) return <main className="vault-main">Loading setup wizard…</main>;
  if (loadError) return <main className="vault-main"><p className="vault-error">{loadError}</p></main>;
  if (!account || !userId) return null;
  const plan: Plan = account.plan;
  const details = PLANS[plan];
  const roadmapItems = includedPlannedFeatures(plan);
  const photos = media.filter(item => item.kind === 'photo');
  const videos = media.filter(item => item.kind === 'video');

  function navigate(next: number) {
    const target = Math.min(6, Math.max(1, next));
    setStep(target); setError(''); setNotice('');
    router.replace(`/portal/onboarding?step=${target}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function updateProfile(key: keyof ProfileDraft, value: string) { setProfileForm(prev => ({ ...prev, [key]: value })); }
  function updateContacts(key: keyof ContactsDraft, value: string) { setContactsForm(prev => ({ ...prev, [key]: value })); }

  async function saveCurrent(): Promise<boolean> {
    if (step === 2 || step === 3 || step === 6) return true;
    setBusy(true); setError(''); setNotice('');
    try {
      const db = vaultClient();
      if (step === 1) {
        if (!profileForm.athlete_name.trim() || !profileForm.sport.trim()) throw new Error('Athlete name and sport are required.');
        const grad = profileForm.graduation_year.trim() ? Number(profileForm.graduation_year) : null;
        if (grad !== null && (!Number.isInteger(grad) || grad < 1990 || grad > 2050)) throw new Error('Enter a valid graduation year.');
        const { error } = await db.from('vault_athlete_profiles').upsert({
          account_id: userId,
          athlete_name: profileForm.athlete_name.trim(), sport: profileForm.sport,
          position: profileForm.position.trim(), graduation_year: grad,
          school: profileForm.school.trim(), city_state: profileForm.city_state.trim(), bio: profileForm.bio.trim()
        }, { onConflict: 'account_id' });
        if (error) throw error;
      }
      if (step === 4) {
        const basic = basicMetrics.filter(m => m.label.trim() && m.value.trim());
        const advanced = details.advancedStats ? advancedMetrics.filter(m => m.label.trim() && m.value.trim()) : [];
        const { error } = await db.from('vault_stats').upsert({ account_id: userId, basic_metrics: basic, advanced_metrics: advanced }, { onConflict: 'account_id' });
        if (error) throw error;
      }
      if (step === 5) {
        const { error } = await db.from('vault_recruiting_contacts').upsert({
          account_id: userId,
          ...Object.fromEntries(Object.entries(contactsForm).map(([key, value]) => [key, value.trim()]))
        }, { onConflict: 'account_id' });
        if (error) throw error;
      }
      await refresh();
      setNotice('Changes saved securely.');
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.');
      return false;
    } finally { setBusy(false); }
  }

  async function next() {
    const okay = await saveCurrent();
    if (!okay) return;
    if (step === 6) router.push('/portal/dashboard');
    else navigate(step + 1);
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    input.value = '';
    const space = details.photoLimit - photos.length;
    if (files.length > space) { setError(`You have ${space} photo slots remaining in ${details.title}.`); return; }
    setBusy(true); setError(''); setNotice('');
    const db = vaultClient();
    let uploaded = 0;
    try {
      for (const file of files) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Photos must be JPG, PNG, or WebP.');
        if (file.size > 5 * 1024 * 1024) throw new Error('Each photo must be 5 MB or less.');
        const extension = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
        const path = `${userId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await db.storage.from('vault-athlete-media').upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        const { error: insertError } = await db.from('vault_media').insert({ account_id: userId, kind: 'photo', title: file.name.slice(0, 120), storage_path: path });
        if (insertError) {
          await db.storage.from('vault-athlete-media').remove([path]);
          throw insertError;
        }
        uploaded++;
      }
      setNotice(`${uploaded} photo${uploaded === 1 ? '' : 's'} uploaded.`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Photo upload failed.'); }
    finally { await refresh(); setBusy(false); }
  }

  async function removeMedia(item: MediaItem) {
    if (!window.confirm(`Remove this ${item.kind}?`)) return;
    setBusy(true); setError('');
    const db = vaultClient();
    const { error: deleteError } = await db.from('vault_media').delete().eq('id', item.id).eq('account_id', userId);
    if (deleteError) setError(deleteError.message);
    else {
      if (item.storage_path) await db.storage.from('vault-athlete-media').remove([item.storage_path]);
      setNotice('Media item removed.');
    }
    await refresh(); setBusy(false);
  }

  async function addVideo() {
    setError(''); setNotice('');
    if (videos.length >= details.videoLimit) { setError('Video limit reached.'); return; }
    let url: URL;
    try { url = new URL(videoUrl.trim()); } catch { setError('Enter a valid full video link, starting with https://'); return; }
    if (url.protocol !== 'https:') { setError('Video links must begin with https://'); return; }
    setBusy(true);
    const { error } = await vaultClient().from('vault_media').insert({ account_id: userId, kind: 'video', title: videoTitle.trim() || 'Highlight video', video_url: url.toString() });
    if (error) setError(error.message);
    else { setVideoTitle(''); setVideoUrl(''); setNotice('Highlight link saved.'); }
    await refresh(); setBusy(false);
  }

  return <main className="vault-main vault-onboarding">
    <div className="vault-inline" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
      <div><div className="vault-eyebrow">GUIDED PROFILE SETUP</div><h1 className="vault-section-title">Build your profile</h1><p className="vault-subtle">Step {step} of 6 • <strong>{details.title}</strong> membership</p></div>
      <Link href="/portal/dashboard" className="vault-link vault-small">Exit to dashboard</Link>
    </div>
    <nav className="vault-steps" aria-label="Onboarding steps">
      {STEP_TITLES.map((title, index) => <button key={title} type="button" onClick={() => navigate(index + 1)} aria-current={step === index + 1 ? 'step' : undefined} className={'vault-step' + (step === index + 1 ? ' vault-step-active' : '')}><small>STEP {index + 1}</small><h3>{title}</h3></button>)}
    </nav>
    <section className="vault-card">
      {step === 1 && <>
        <div className="vault-eyebrow">01 / FOUNDATION</div><h2>Athlete information</h2>
        <p className="vault-subtle">Create the private foundation of your recruiting presence. You can edit this later.</p>
        <div className="vault-field-grid">
          <div><label className="vault-label" htmlFor="athlete-name">Athlete full name *</label><input id="athlete-name" className="vault-input" value={profileForm.athlete_name} onChange={e => updateProfile('athlete_name', e.target.value)} maxLength={120} placeholder="Jordan Smith" /></div>
          <div><label className="vault-label" htmlFor="athlete-sport">Primary sport *</label><select id="athlete-sport" className="vault-input" value={profileForm.sport} onChange={e => updateProfile('sport', e.target.value)}><option value="">Choose sport</option>{SPORTS.map(sport => <option key={sport} value={sport}>{sport}</option>)}</select></div>
          <div><label className="vault-label" htmlFor="athlete-position">Position / events</label><input id="athlete-position" className="vault-input" value={profileForm.position} onChange={e => updateProfile('position', e.target.value)} maxLength={120} placeholder="QB / 100m / Point Guard" /></div>
          <div><label className="vault-label" htmlFor="grad-year">Graduation year</label><input id="grad-year" className="vault-input" type="number" min="1990" max="2050" value={profileForm.graduation_year} onChange={e => updateProfile('graduation_year', e.target.value)} placeholder="2027" /></div>
          <div><label className="vault-label" htmlFor="school">School / team</label><input id="school" className="vault-input" value={profileForm.school} onChange={e => updateProfile('school', e.target.value)} maxLength={160} /></div>
          <div><label className="vault-label" htmlFor="city">City / state</label><input id="city" className="vault-input" value={profileForm.city_state} onChange={e => updateProfile('city_state', e.target.value)} maxLength={120} placeholder="Houston, TX" /></div>
          <div className="vault-span-all"><label className="vault-label" htmlFor="bio">Athlete introduction</label><textarea id="bio" className="vault-input" maxLength={1200} value={profileForm.bio} onChange={e => updateProfile('bio', e.target.value)} placeholder="Describe your playing style, leadership, achievements and goals…" /></div>
        </div>
        <p className="vault-note">Minor athletes must have a parent or legal guardian manage the account. This starter does not publish profiles or contact information to the public.</p>
      </>}
      {step === 2 && <>
        <div className="vault-eyebrow">02 / VISUAL STORY</div><h2>Photo gallery</h2>
        <p className="vault-subtle">Upload athlete portraits, in-game action and team photos. Files are stored privately until a separate publishing system is built.</p>
        <p className="vault-count">{photos.length} / {details.photoLimit} photos used</p>
        <label className="vault-button vault-button-gold" style={{ cursor: busy || photos.length >= details.photoLimit ? 'not-allowed' : 'pointer', opacity: busy || photos.length >= details.photoLimit ? .6 : 1 }}>
          + Upload photos
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={addPhotos} disabled={busy || photos.length >= details.photoLimit} style={{ display: 'none' }} />
        </label>
        <p className="vault-subtle vault-small">JPG, PNG, or WebP • 5 MB maximum per photo. Click to choose one or several files.</p>
        {photos.length > 0 && <div className="vault-media-grid">{photos.map(photo => <article className="vault-media-item" key={photo.id}>
          {photoUrls[photo.id] ? <img src={photoUrls[photo.id]} alt={photo.title || 'Athlete photo'} /> : <div style={{ aspectRatio: '4/3', padding: 15 }}>Loading preview…</div>}
          <div className="vault-media-details"><div className="vault-subtle vault-small">{photo.title}</div><button type="button" disabled={busy} onClick={() => removeMedia(photo)}>Remove photo</button></div>
        </article>)}</div>}
      </>}
      {step === 3 && <>
        <div className="vault-eyebrow">03 / SHOW YOUR GAME</div><h2>Highlight videos</h2>
        <p className="vault-subtle">Add links to your already-hosted videos on YouTube, Hudl, Vimeo or another HTTPS video page. This shell stores links, not video files.</p>
        <p className="vault-count">{videos.length} / {details.videoLimit} video links used</p>
        <div className="vault-field-grid">
          <div><label className="vault-label" htmlFor="video-title">Highlight title</label><input id="video-title" className="vault-input" value={videoTitle} maxLength={120} onChange={e => setVideoTitle(e.target.value)} placeholder="2026 Season Highlights" /></div>
          <div><label className="vault-label" htmlFor="video-url">Video URL (https://…)</label><input id="video-url" className="vault-input" type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" /></div>
        </div>
        <button type="button" className="vault-button vault-button-gold" style={{ marginTop: 17 }} onClick={addVideo} disabled={busy || videos.length >= details.videoLimit}>+ Save video link</button>
        {videos.length > 0 && <div className="vault-media-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' }}>
          {videos.map(video => <article className="vault-media-item" key={video.id}><div className="vault-media-details">
            <div style={{ fontSize: 27, margin: '5px 0 12px' }}>▶</div><strong>{video.title}</strong><p style={{ overflowWrap: 'anywhere' }}><a href={video.video_url || '#'} target="_blank" rel="noopener noreferrer" className="vault-link">Open video ↗</a></p>
            <button type="button" disabled={busy} onClick={() => removeMedia(video)}>Remove link</button>
          </div></article>)}
        </div>}
      </>}
      {step === 4 && <>
        <div className="vault-eyebrow">04 / THE NUMBERS</div><h2>Performance statistics</h2>
        <p className="vault-subtle">Add statistics that fit your sport. Each stat is a label and value, so athletes from all supported sports can tell their story.</p>
        <h3>Basic statistics</h3>
        <p className="vault-subtle vault-small">Examples: height, weight, goals, points per game, 40-yard dash, personal best, batting average.</p>
        <MetricEditor name="Basic" rows={basicMetrics} onChange={setBasicMetrics} />
        <hr className="vault-divider" />
        <h3>Advanced statistics</h3>
        {details.advancedStats ? <><p className="vault-subtle vault-small">Available in Pro and Elite. Add detailed performance measurements, seasonal breakdowns, rankings or verified metrics.</p>
          <MetricEditor name="Advanced" rows={advancedMetrics} onChange={setAdvancedMetrics} /></> :
          <div className="vault-note">Advanced statistics are included in Pro ($29/month) and Elite ($49/month). Your Starter account includes basic statistics.</div>}
      </>}
      {step === 5 && <>
        <div className="vault-eyebrow">05 / GET RECRUITED</div><h2>Recruiting contacts</h2>
        <p className="vault-subtle">Provide a designated recruiting contact. This information remains private in the portal. A future public profile can expose only approved contact fields.</p>
        <div className="vault-field-grid">
          <div><label className="vault-label" htmlFor="recruiting-email">Recruiting contact email</label><input id="recruiting-email" className="vault-input" type="email" value={contactsForm.recruiting_email} onChange={e => updateContacts('recruiting_email', e.target.value)} placeholder="recruiting@example.com" /></div>
          <div><label className="vault-label" htmlFor="guardian-email">Parent / guardian email (if applicable)</label><input id="guardian-email" className="vault-input" type="email" value={contactsForm.guardian_email} onChange={e => updateContacts('guardian_email', e.target.value)} /></div>
          <div><label className="vault-label" htmlFor="coach-name">Coach name</label><input id="coach-name" className="vault-input" value={contactsForm.coach_name} onChange={e => updateContacts('coach_name', e.target.value)} /></div>
          <div><label className="vault-label" htmlFor="coach-email">Coach email</label><input id="coach-email" className="vault-input" type="email" value={contactsForm.coach_email} onChange={e => updateContacts('coach_email', e.target.value)} /></div>
          <div className="vault-span-all"><label className="vault-label" htmlFor="contact-notes">Preferred recruiting process / notes</label><textarea id="contact-notes" className="vault-input" maxLength={1000} value={contactsForm.contact_notes} onChange={e => updateContacts('contact_notes', e.target.value)} placeholder="Coach referral, preferred email contact, recruiting timeline…" /></div>
        </div>
        <p className="vault-note">Use an adult-managed contact address for minors. No school or personal contact information is exposed publicly by this starter.</p>
      </>}
      {step === 6 && <>
        <div className="vault-eyebrow">06 / YOUR NEXT LEVEL</div><h2>{details.title} package extras</h2>
        <p className="vault-subtle">Your five core setup areas are ready for ongoing edits in the member dashboard. Some plan features are on the roadmap.</p>
        {roadmapItems.length ? <div className="vault-dashboard-grid">
          {roadmapItems.map(feature => <div key={feature} className="vault-feature-card vault-locked"><div className="vault-feature-copy"><h3>{feature}</h3><p>Coming in a future release. No additional action is required right now.</p><span className="vault-pill">Planned</span></div></div>)}
        </div> : <div className="vault-note">Starter includes your athlete profile, 10 photos, 3 highlight links, basic statistics, and recruiting contacts.</div>}
        <p className="vault-footnote">This is a setup prototype; no payment, public publishing, coach search, analytics reporting or custom-domain provisioning occurs here.</p>
      </>}
      {error && <p className="vault-error" role="alert">{error}</p>}
      {notice && <p className="vault-success" role="status">{notice}</p>}
      <div className="vault-action-row">
        <button type="button" className="vault-button vault-button-outline" onClick={() => navigate(step - 1)} disabled={busy || step === 1}>← Back</button>
        <div className="vault-inline">
          {(step === 2 || step === 3) && <span className="vault-subtle vault-small">Media saves immediately</span>}
          <button type="button" className="vault-button vault-button-gold" disabled={busy} onClick={next}>{busy ? 'Saving…' : step === 6 ? 'Go to dashboard →' : step === 2 || step === 3 ? 'Continue →' : 'Save & continue →'}</button>
        </div>
      </div>
    </section>
  </main>;
}

export default function OnboardingPage() {
  return <Suspense fallback={<main className="vault-main">Loading setup…</main>}><Wizard /></Suspense>;
}
