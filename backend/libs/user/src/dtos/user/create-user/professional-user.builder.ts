import { UserEntity } from '@app/db';
import { CHANNEL, IRequestInfo } from '@app/shared';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterProfessionalUserDto } from './request-dtos/professional-user.dto';

export class ProfessionalUserBuilder implements IUserBuilder {
  private dto: RegisterProfessionalUserDto;
  private builder: UserBuilder;
  constructor(dto: RegisterProfessionalUserDto, requestInfo: IRequestInfo) {
    this.dto = dto;
    this.builder = new UserBuilder(requestInfo);
  }

  async getUser(): Promise<UserEntity> {
    // this.m = m;
    const { username, phone, email, ...profile } = this.dto;
    this.builder = this.builder
      .setEmail(email)
      .setPhone(phone)
      .setUsername(username)
      .setRole('PROFESSIONAL_USER')
      .setAccessChannels([CHANNEL.WEB])
      .setCustomerProfile({ ...profile });
    this.builder = await this.builder.addUserAccesses(['WEB']);
    return this.builder.build();
  }
  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
