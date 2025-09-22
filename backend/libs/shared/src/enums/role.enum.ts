import { EnumValues } from './enum-type';

export const ADMIN_ROLE = {
  // administrative
  ADMIN: 'ADMIN',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  FINANCE: 'FINANCE',
} as const;
export const CUSTOMER_ROLE = {
  // customer
  PROMOTER: 'PROMOTER',
  AGENT: 'AGENT',
  MERCHANT: 'MERCHANT',
  SALES: 'SALES',
  SUB_AGENT: 'SUB_AGENT',
  RETAILER: 'RETAILER',
  EUSER: 'EUSER',
} as const;
export const ROLE = {
  ...ADMIN_ROLE,
  ...CUSTOMER_ROLE,
  INSTITUTION_USER: 'INSTITUTION_USER',
  PROFESSIONAL_USER: 'PROFESSIONAL_USER',
  PATIENT_USER: 'PATIENT_USER',
} as const;
export type Role = EnumValues<typeof ROLE>;
export type AdminRole = EnumValues<typeof ADMIN_ROLE>;
export type CustomerRole = EnumValues<typeof CUSTOMER_ROLE>;
