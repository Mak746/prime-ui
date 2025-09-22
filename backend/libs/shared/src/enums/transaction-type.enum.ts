import { EnumValues } from './enum-type';

export const TRANSACTION_TYPE = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;
export type TransactionType = EnumValues<typeof TRANSACTION_TYPE>;
