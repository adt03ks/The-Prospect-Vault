export type Plan = 'starter' | 'pro' | 'elite';
export type AccountType = 'adult_athlete' | 'guardian';

export type PlanDetails = {
  title: string;
  monthlyPrice: number;
  photoLimit: number;
  videoLimit: number;
  advancedStats: boolean;
  features: string[];
  planned: string[];
};

export const PLANS: Record<Plan, PlanDetails> = {
  starter: {
    title: 'Starter', monthlyPrice: 15, photoLimit: 10, videoLimit: 3,
    advancedStats: false,
    features: ['Athlete profile', 'Up to 10 photos', 'Up to 3 video links', 'Basic statistics', 'Recruiting contact information'],
    planned: []
  },
  pro: {
    title: 'Pro', monthlyPrice: 29, photoLimit: 30, videoLimit: 10,
    advancedStats: true,
    features: ['Everything in Starter', 'Up to 30 photos', 'Up to 10 video links', 'Advanced statistics'],
    planned: ['Recruiting sheet', 'Basic analytics']
  },
  elite: {
    title: 'Elite', monthlyPrice: 49, photoLimit: 100, videoLimit: 30,
    advancedStats: true,
    features: ['Everything in Pro', 'Up to 100 photos', 'Up to 30 video links'],
    planned: ['NIL media kit', 'Custom domain', 'Advanced analytics']
  }
};

export const SPORTS = [
  'Football', 'Basketball', 'Baseball / Softball', 'Soccer', 'Track & Field',
  'Wrestling', 'Volleyball', 'Cross Country', 'Golf', 'Bowling',
  'Swimming / Diving', 'Tennis', 'Lacrosse', 'Ice / Field Hockey'
];

export function isPlan(value: string | null | undefined): value is Plan {
  return value === 'starter' || value === 'pro' || value === 'elite';
}

export function displayPlan(plan: Plan) { return PLANS[plan].title; }

// Elite inherits Pro roadmap items, even though its pricing card lists only new Elite items.
export function includedPlannedFeatures(plan: Plan): string[] {
  return plan === 'elite' ? [...PLANS.pro.planned, ...PLANS.elite.planned] : PLANS[plan].planned;
}
