import { EnumValues } from './enum-type';

export const DR_CR = {
  DR: 'DR',
  CR: 'CR',
} as const;
export type DrCr = EnumValues<typeof DR_CR>;
