import { EnumValues } from './enum-type';

export const REALM = { ADMIN: 'ADMIN', CUSTOMER: 'CUSTOMER' } as const;
export type Realm = EnumValues<typeof REALM>;
