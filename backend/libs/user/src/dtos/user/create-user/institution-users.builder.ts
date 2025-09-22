import { UserEntity } from '@app/db';
import { CHANNEL, IRequestInfo } from '@app/shared';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterInstitutionUserDto } from './request-dtos/institution-user.dto';

export class InstitutionUserBuilder implements IUserBuilder {
  private dto: RegisterInstitutionUserDto;
  private builder: UserBuilder;
  constructor(dto: RegisterInstitutionUserDto, requestInfo: IRequestInfo) {
    this.dto = dto;
    this.builder = new UserBuilder(requestInfo);
  }

  async getUser(): Promise<UserEntity> {
    // this.m = m;
    const { username, phone, email, ...profile } = this.dto;
    this.builder = this.builder
      .setEmail(email)
      .setUsername(username)
      .setPhone(phone)
      .setRole('INSTITUTION_USER')
      .setAccessChannels([CHANNEL.WEB])
      .setCustomerProfile({ ...profile });
    this.builder = await this.builder.addUserAccesses(['WEB', 'APP']);
    return this.builder.build();
  }
  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
