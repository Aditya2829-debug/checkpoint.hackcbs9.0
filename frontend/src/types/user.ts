export interface DietaryRestriction {
  id: string;
  label: string;
  enabled: boolean;
  severity: 'strict' | 'preference';
}

export interface UserPreferences {
  allergies: string[];
  dietaryRestrictions: DietaryRestriction[];
  avoidAdditives: string[]; // e.g. "INS 621", "Palm Oil", "Chlorine bleach"
  preferredHygieneStandards: string[]; // e.g. "Dioxin-Free", "IS 5405:2019"
  enableAiExplanations: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  memberSince: string;
  totalScans: number;
  preferences: UserPreferences;
}
