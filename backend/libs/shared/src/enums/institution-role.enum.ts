import { EnumValues } from './enum-type';

//export const ADMIN_ROLE = {
//// administrative
//ADMIN: 'ADMIN',
//ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
//FINANCE: 'FINANCE',
//} as const;
//export const CUSTOMER_ROLE = {
//// customer
//PROMOTER: 'PROMOTER',
//AGENT: 'AGENT',
//MERCHANT: 'MERCHANT',
//SALES: 'SALES',
//SUB_AGENT: 'SUB_AGENT',
//RETAILER: 'RETAILER',
//EUSER: 'EUSER',
//} as const;
export const INSTITUTION_ROLE = {
  //...ADMIN_ROLE,
  //...CUSTOMER_ROLE,
  ADMIN: 'ADMIN',
  USER: 'USER',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  PROFESSIONAL_USER: 'PROFESSIONAL_USER',
} as const;
export type InstitutionRole = EnumValues<typeof INSTITUTION_ROLE>;
