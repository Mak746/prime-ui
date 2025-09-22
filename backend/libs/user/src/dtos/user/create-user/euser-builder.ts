import { UserEntity } from '@app/db';
import { IRequestInfo } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterPatientUserDto } from './request-dtos';

export class PatientUserBuilder implements IUserBuilder {
  private builder: UserBuilder;
  constructor(
    private dto: RegisterPatientUserDto,
    private requestInfo: IRequestInfo,
  ) {
    this.builder = new UserBuilder(requestInfo);
  }

  // ------------------
  // PUBLIC
  // ------------------

  async getUser(m: EntityManager): Promise<UserEntity> {
    if (!m) {
      throw new BadRequestException('Entity Manager Required');
    }
    const { username, phone, email, profilePic, firebaseToken } = this.dto;

    this.builder = this.builder
      .setUsername(username)
      .setPhone(phone)
      .setEmail(email)
      .setRole('PATIENT_USER')
      .setAccessChannels(['WEB', 'APP'])
      .setCustomerProfile({ profilePic });
    console.log('CHANNEL ', this.requestInfo.channel);
    console.log('TOKEN ', firebaseToken);
    this.builder = await this.builder.addUserAccessesWithToken([
      {
        channel: 'WEB',
        firebaseToken: this.requestInfo.channel == 'WEB' ? firebaseToken : null,
      },
      {
        channel: 'APP',
        firebaseToken: this.requestInfo.channel == 'APP' ? firebaseToken : null,
      },
    ]);
    const user = this.builder.build();
    return user;
  }

  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
