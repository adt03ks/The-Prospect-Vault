import type { AthleteProfile, Contacts, MediaItem, Stats } from './types';

export type StepStatus = { title: string; ready: boolean; description: string };
export function getProgress(profile: AthleteProfile | null, media: MediaItem[], stats: Stats | null, contacts: Contacts | null): StepStatus[] {
  return [
    { title: 'Athlete profile', ready: !!(profile?.athlete_name?.trim() && profile?.sport?.trim()), description: 'Name, sport and recruiting details' },
    { title: 'Photo gallery', ready: media.some(item => item.kind === 'photo'), description: 'Add your first athlete photo' },
    { title: 'Highlight videos', ready: media.some(item => item.kind === 'video'), description: 'Link to at least one highlight' },
    { title: 'Statistics', ready: !!(stats?.basic_metrics?.some(item => item.label?.trim() && item.value?.trim())), description: 'Showcase your performance' },
    { title: 'Recruiting contacts', ready: !!contacts?.recruiting_email?.trim(), description: 'Provide a contact for recruiters' }
  ];
}
