import { EnumValues } from './enum-type';

export const CHAT_MESSAGE_STATUS = {
  NOT_SEEN: 'NOT_SEEN',
  READ: 'READ',
} as const;
export type ChatMessageStatus = EnumValues<typeof CHAT_MESSAGE_STATUS>;

export const CHAT_MESSAGE_TYPE = {
  TEXT: 'TEXT',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  FILE: 'FILE',
  IMAGE: 'IMAGE',
};
export type ChatMessageType = EnumValues<typeof CHAT_MESSAGE_TYPE>;
