import { EnumValues } from './enum-type';

export const VOTE_TYPE = {
  UP: 'UP',
  DOWN: 'DOWN',
} as const;
export type VoteType = EnumValues<typeof VOTE_TYPE>;

export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  APPROVED: 'APPROVED',
  DELETED: 'DELETED',
} as const;
export type PostStatus = EnumValues<typeof POST_STATUS>;

export const POST_VARIABILITY = {
  LATEST: 'LATEST',
  POPULAR: 'POPULAR',
  TRENDING: 'TRENDING',
};

export type PostVariability = EnumValues<typeof POST_VARIABILITY>;
