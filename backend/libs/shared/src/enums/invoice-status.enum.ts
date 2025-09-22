import { EnumValues } from './enum-type';

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  VOID: 'VOID',
} as const;
export type InvoiceStatus = EnumValues<typeof INVOICE_STATUS>;
