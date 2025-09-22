import { EnumValues } from './enum-type';

export const GENDER_TYPE = {
  Male: 'Male',
  Female: 'Female',
  NA: 'NA',
} as const;
export type GenderType = EnumValues<typeof GENDER_TYPE>;
