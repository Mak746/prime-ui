export const MAX_PAGE_SIZE = 100;
export const MIN_PAGE_SIZE = 5;
export const DEFAULT_PAGE_SIZE = 50;

export const PUBLIC_ENDPOINT = 'PUBLIC_ENDPOINT';
export const AUDIT_LOG_DATA = 'AUDIT_LOG_DATA';

export const ERR_VERIFY_OTP = 412;
export const ERR_RESET_CREDENTIAL = 419;

// TXN TYPE IDS
export const PAID_CR = 1;
export const LOAN_CR = 2;
export const SETTLED_CR = 3;
export const RECONCILED_CR = 4;
export const VOID_PAYMENT_DR = 5;
export const TRANSFER_CR = 6;
export const TRANSFER_DR = 7;
export const PURCHASE_AIRTIME_DR = 8;
export const VOID_PURCHASE_AIRTIME_CR = 9;
export const VOID_TRANSFER_CR = 10;
export const VOID_TRANSFER_DR = 11;
export const SALES_PROFIT_CR = 12;

export * from './endpoint-prefixes';
