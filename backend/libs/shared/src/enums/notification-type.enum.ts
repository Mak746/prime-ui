import { EnumValues } from './enum-type';

export const NOTIFICATION_TYPE = {
  PUSH: 'PUSH',
  NORMAL: 'NORMAL',
} as const;
export type NotificationType = EnumValues<typeof NOTIFICATION_TYPE>;

export const NOTIFICATION_CHANNEL = {
  SMS: 'SMS',
  EMAIL: 'EMAIL',
  API: 'API',
} as const;
export type NotificationChannel = EnumValues<typeof NOTIFICATION_CHANNEL>;
