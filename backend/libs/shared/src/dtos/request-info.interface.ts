import { Channel, Realm } from '../enums';
import { AccessUserAgent } from './user-agent.dto';

export interface IRequestInfo {
  realm: Realm;
  channel: Channel;
  ip: string;
  createdBy?: number;
  device?: AccessUserAgent;
}
