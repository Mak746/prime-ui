import { UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { EntityManager } from 'typeorm';

export interface IUserBuilder {
  getUser(m?: EntityManager): Promise<UserEntity>;
  getNotificationDetail(userId: number): IAccountSMS;
}
