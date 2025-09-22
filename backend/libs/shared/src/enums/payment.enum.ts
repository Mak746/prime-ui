import { EnumValues } from './enum-type';

export const WIRE_PAYMENT_STATUS = {
  CREATED: 'CREATED',
  ON_PROCESS: 'ON_PROCESS',
  CANCELED: 'CANCELED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const;
export type WirePaymentStatus = EnumValues<typeof WIRE_PAYMENT_STATUS>;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  /*CREATED: 'CREATED' CANCELED: 'CANCELED', PAID: 'PAID', RECONCILED: 'RECONCILED', VOID: 'VOID'*/
} as const;
export type PaymentStatus = EnumValues<typeof PAYMENT_STATUS>;

export const PAYMENT_TYPE = {
  WALLET: 'WALLET',
  ONLINE: 'ONLINE',
} as const;
export type PaymentType = EnumValues<typeof PAYMENT_TYPE>;

export const SETTLEMENT_STATUS = {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  VOID: 'VOID',
} as const;
export type SettlementStatus = EnumValues<typeof SETTLEMENT_STATUS>;

export const SETTLEMENT_FLAG = {
  SETTLED: 'SETTLED',
  NOT_SETTLED: 'NOT_SETTLED',
} as const;
export type SettlementFlag = EnumValues<typeof SETTLEMENT_FLAG>;

export const SETTLEMENT_TXN_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  SETTLED: 'SETTLED',
  FAILED: 'FAILED',
} as const;
export type SettlementTxnStatus = EnumValues<typeof SETTLEMENT_TXN_STATUS>;
