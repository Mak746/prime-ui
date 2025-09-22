import { UserEntity } from '@app/db';
import { CHANNEL, IRequestInfo } from '@app/shared';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterAdminStaffDto } from './request-dtos';

export class AdministrativeUserBuilder implements IUserBuilder {
  private dto: RegisterAdminStaffDto;
  private builder: UserBuilder;
  constructor(dto: RegisterAdminStaffDto, requestInfo: IRequestInfo) {
    this.dto = dto;
    this.builder = new UserBuilder(requestInfo);
  }

  async getUser(): Promise<UserEntity> {
    // this.m = m;
    const { username, phone, email, role, ...profile } = this.dto;
    this.builder = this.builder
      .setUsername(username)
      .setPhone(phone)
      .setEmail(email)
      .setRole(role)
      .setAccessChannels([CHANNEL.WEB])
      .setCustomerProfile({ ...profile });
    this.builder = await this.builder.addUserAccesses(['WEB']);
    return this.builder.build();
  }
  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
