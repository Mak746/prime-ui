import { EnumValues } from './enum-type';

export const RATING_SCALE = {
  POOR: 'POOR',
  MEDIUM: 'MEDIUM',
  AVERAGE: 'AVERAGE',
  GOOD: 'GOOD',
  EXCELLENT: 'EXCELLENT',
} as const;
export type RatingScale = EnumValues<typeof RATING_SCALE>;
