import { create } from 'zustand';
import type { UserProfile } from '../types';

interface UserStoreState {
  profile: UserProfile;
  toggleAllergy: (allergy: string) => void;
  toggleAdditiveToAvoid: (additive: string) => void;
  toggleHygieneStandard: (standard: string) => void;
  updateName: (name: string) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  profile: {
    id: 'user-001',
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    memberSince: 'October 2026',
    totalScans: 48,
    preferences: {
      allergies: ['Peanuts / Groundnuts', 'Gluten'],
      dietaryRestrictions: [
        { id: 'veg', label: 'Vegetarian Only', enabled: true, severity: 'strict' },
        { id: 'low-sodium', label: 'Low Sodium (<1500mg/day)', enabled: true, severity: 'strict' },
        { id: 'no-trans-fat', label: 'Zero Trans Fat Guarantee', enabled: true, severity: 'strict' },
      ],
      avoidAdditives: ['INS 621 (MSG)', 'INS 635 (Ribonucleotides)', 'Palm Oil', 'Artificial Food Dyes'],
      preferredHygieneStandards: ['Total Chlorine Free (TCF)', 'Dioxin-Free (<0.01ppt)', 'IS 5405:2019 Certified', 'Unscented Only'],
      enableAiExplanations: true,
      theme: 'light',
    },
  },

  toggleAllergy: (allergy) =>
    set((state) => {
      const current = state.profile.preferences.allergies;
      const updated = current.includes(allergy)
        ? current.filter((a) => a !== allergy)
        : [...current, allergy];
      return {
        profile: {
          ...state.profile,
          preferences: {
            ...state.profile.preferences,
            allergies: updated,
          },
        },
      };
    }),

  toggleAdditiveToAvoid: (additive) =>
    set((state) => {
      const current = state.profile.preferences.avoidAdditives;
      const updated = current.includes(additive)
        ? current.filter((a) => a !== additive)
        : [...current, additive];
      return {
        profile: {
          ...state.profile,
          preferences: {
            ...state.profile.preferences,
            avoidAdditives: updated,
          },
        },
      };
    }),

  toggleHygieneStandard: (standard) =>
    set((state) => {
      const current = state.profile.preferences.preferredHygieneStandards;
      const updated = current.includes(standard)
        ? current.filter((s) => s !== standard)
        : [...current, standard];
      return {
        profile: {
          ...state.profile,
          preferences: {
            ...state.profile.preferences,
            preferredHygieneStandards: updated,
          },
        },
      };
    }),

  updateName: (name) =>
    set((state) => ({
      profile: {
        ...state.profile,
        name,
      },
    })),
}));
