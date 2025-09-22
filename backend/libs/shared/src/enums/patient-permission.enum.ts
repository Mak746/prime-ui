import { EnumValues } from './enum-type';

export const PERMISSION_TYPE = {
  READ: 'READ',
  WRITE: 'WRITE',
} as const;
export type PermissionType = EnumValues<typeof PERMISSION_TYPE>;

export const PERMISSION_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;
export type PermissionRequestStatus = EnumValues<typeof PERMISSION_REQUEST_STATUS>;
