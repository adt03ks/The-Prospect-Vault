import type { AccountType, Plan } from './catalog';

export type Account = {
  id: string;
  email: string;
  plan: Plan;
  account_type: AccountType;
  subscription_status: 'unpaid' | 'active' | 'past_due' | 'canceled';
};
export type AthleteProfile = {
  account_id: string;
  athlete_name: string;
  sport: string;
  position: string;
  graduation_year: number | null;
  school: string;
  city_state: string;
  bio: string;
};
export type MediaItem = {
  id: string;
  account_id: string;
  kind: 'photo' | 'video';
  title: string;
  storage_path: string | null;
  video_url: string | null;
  created_at: string;
};
export type Metric = { label: string; value: string };
export type Stats = {
  account_id: string;
  basic_metrics: Metric[];
  advanced_metrics: Metric[];
};
export type Contacts = {
  account_id: string;
  recruiting_email: string;
  coach_name: string;
  coach_email: string;
  guardian_email: string;
  contact_notes: string;
};
