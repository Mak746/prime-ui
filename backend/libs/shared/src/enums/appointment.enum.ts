import { EnumValues } from './enum-type';

export const APPOINTMENT_BOOKING_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
export type AppointmentBookingStatus = EnumValues<typeof APPOINTMENT_BOOKING_STATUS>;

export const APPOINTMENT_BOOKING_TYPE = {
  ONLINE: 'ONLINE',
  INSTANT: 'INSTANT',
  IN_PERSON: 'IN_PERSON',
} as const;
export type AppointmentBookingType = EnumValues<typeof APPOINTMENT_BOOKING_TYPE>;

export const BOOKING_SLOT_STATUS = {
  //AVAILABLE: 'AVAILABLE',
  //BOOKED: 'BOOKED',
  //BLOCKED: 'BLOCKED',
  //EXPIRED: 'EXPIRED',
  AVAILABLE: 'AVAILABLE',
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
export type BookingSlotStatus = EnumValues<typeof BOOKING_SLOT_STATUS>;

// card

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
export type AppointmentStatus = EnumValues<typeof APPOINTMENT_STATUS>;
