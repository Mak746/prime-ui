import { Channel } from '@app/shared';

export interface ICredentials {
  channel?: Channel;
  otpCode?: number;
  pinCode?: number;
  password?: string;
}
