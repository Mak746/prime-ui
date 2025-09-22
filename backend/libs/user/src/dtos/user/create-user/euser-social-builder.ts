import { UserEntity } from '@app/db';
import { IRequestInfo, RegistrationProvider } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterEUserSocialDto } from './request-dtos';

export class EUserSocialBuilder implements IUserBuilder {
  private builder: UserBuilder;
  private _existingUser: UserEntity;
  constructor(
    private dto: RegisterEUserSocialDto,
    requestInfo: IRequestInfo,
  ) {
    this.builder = new UserBuilder(requestInfo);
  }
  protected async _getSocialUser(
    m: EntityManager,
    registrationProvider: RegistrationProvider,
    socialProfileId: string,
  ): Promise<UserEntity> {
    return m.findOne(UserEntity, {
      where: { registrationProvider, socialProfileId },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userAccesses: 'user.userAccesses',
          userProfile: 'user.userProfile',
          accessDevices: 'userAccesses.accessDevices',
        },
      },
    });
  }
  // ------------------
  // PUBLIC
  // ------------------
  get existingUser() {
    return this._existingUser;
  }
  async getUser(m: EntityManager): Promise<UserEntity> {
    if (!m) {
      throw new BadRequestException('Entity Manager Required');
    }
    const { fullName, phone, email, profilePic, registrationProvider, socialProfileId } = this.dto;
    // check if existing
    this._existingUser = await this._getSocialUser(m, registrationProvider, socialProfileId);
    if (this._existingUser) {
      return this._existingUser;
    }
    // const priceList = await this._getPriceList(m, productPrices);

    this.builder = this.builder
      .setUsername(fullName)
      .setPhoneX(phone || socialProfileId)
      .setEmail(email)
      .setRole('EUSER')
      .setAccessChannels(['WEB', 'APP'])
      .setCustomerProfile({ profilePic })
      .setRegistrationProvider(registrationProvider)
      .setSocialProfileId(socialProfileId)
      .setStatus('ACTIVE');
    //   .setupWallet(currencyId)
    //   .setCustomerProfile({ canCreateSubAccounts, maximumDailyWalletThreshold, shareParentWallet, walletAlertThreshold })
    //   .setProductPriceList(priceList);
    // this.builder = await this.builder.addUserAccesses(['WEB', 'APP']);
    const user = this.builder.build();
    return user;
  }

  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
