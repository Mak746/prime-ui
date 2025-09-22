import { EnumValues } from './enum-type';

export const RELATIONSHIP_TYPE = {
  Father: 'Father',
  Mother: 'Mother',
  Spouse: 'Spouse',
  Son: 'Son',
  Daughter: 'Daughter',
  Brother: 'Brother',
  Sister: 'Sister',
  Grandfather: 'Grandfather',
  Grandmother: 'Grandmother',
  Grandson: 'Grandson',
  Granddaughter: 'Granddaughter',
  Uncle: 'Uncle',
  Aunt: 'Aunt',
  Nephew: 'Nephew',
  Niece: 'Niece',
  Cousin: 'Cousin',
  Friend: 'Friend',
  Other: 'Other',
} as const;
export type RelationshipType = EnumValues<typeof RELATIONSHIP_TYPE>;
