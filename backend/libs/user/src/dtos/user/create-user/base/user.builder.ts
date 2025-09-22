import { UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { Channel, IRequestInfo, RegistrationProvider, Role, UserStatus, parsePhone } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ICredentials } from '../interfaces';
import { UserAccessBuilder } from './user-access.builder';
import { IUserProfileOpts, UserProfileBuilder } from './user-profile.builder';

export class UserBuilder {
  private user: UserEntity;
  private requestInfo: IRequestInfo;
  private credentials: ICredentials[];

  constructor(requestInfo: IRequestInfo) {
    this.credentials = [];
    this.requestInfo = requestInfo;
    this.user = new UserEntity({
      idpId: uuidv4(),
      realm: this.requestInfo.realm,
      createdBy: this.requestInfo.createdBy,
      status: 'PENDING',
      registrationProvider: 'LOCAL',
      userAccesses: [],
    });
  }

  setUsername(value: string): this {
    this.user.username = value.trim();
    return this;
  }
  setPhone(phone: string): this {
    const parsedPhone = parsePhone(phone.trim());
    if (!parsedPhone.valid) {
      throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
    }
    this.user.phone = parsedPhone.number.e164.replace('+', '');
    return this;
  }
  setPhoneX(phone: string): this {
    this.user.phone = phone;
    return this;
  }
  setEmail(value: string): this {
    if (value) this.user.email = value ? value : null;
    return this;
  }
  setRole(value: Role): this {
    this.user.role = value;
    return this;
  }
  setParent(value: UserEntity): this {
    if (!value) {
      throw new BadRequestException('Registration Requires valid parent');
    }
    this.user.parentUserId = value.id;
    return this;
  }
  setAccessChannels(value: Channel[]): this {
    this.user.accessChannels = value;
    return this;
  }
  setCustomerProfile(opts: IUserProfileOpts): this {
    this.user.userProfile = new UserProfileBuilder(opts).build();
    return this;
  }
  setStatus(value: UserStatus): this {
    this.user.status = value;
    return this;
  }
  setSocialProfileId(value: string): this {
    this.user.socialProfileId = value;
    return this;
  }
  setRegistrationProvider(value: RegistrationProvider): this {
    this.user.registrationProvider = value;
    return this;
  }

  // setProductPriceList(opts: IProductList[]): this {
  //   this.user.productPrices = [];
  //   for (let i = 0; i < opts.length; i++) {
  //     const opt = opts[i];
  //     const {
  //       product,
  //       purchaseTransactionFee,
  //       purchaseUnitPrice,
  //       salesTransactionFee,
  //       salesProfitMarginRate,
  //       parentPrice,
  //     } = opt;
  //     // eslint-disable-next-line prettier/prettier
  //     this.user.productPrices.push(
  //       new CustomerProductPriceBuilder(product, parentPrice)
  //         .setIsActive(true)
  //         .setPriceType('CUSTOMER_PRICE')
  //         .setPurchaseUnitPrice(purchaseUnitPrice)
  //         .setPurchaseTransactionFee(purchaseTransactionFee)
  //         .setSalesProfitMarginRate(salesProfitMarginRate)
  //         .setSalesTransactionFeeRate(salesTransactionFee)
  //         .build(),
  //     );
  //   }
  //   return this;
  // }
  // setupWallet(currencyId: number): this {
  //   this.user.wallet = new WalletEntity({ walletType: 'MAIN', currencyId });
  //   this.user.commissionWallet = new WalletEntity({ walletType: 'COMMISSION', currencyId });
  //   return this;
  // }
  async addUserAccesses(channels: ('WEB' | 'APP')[]): Promise<this> {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i] as 'WEB' | 'APP';
      const uaBuilder = new UserAccessBuilder(channel);
      const userAccess = await uaBuilder.build();
      this.user.userAccesses.push(userAccess);
      this.credentials.push(uaBuilder.getCredentials());
    }
    return this;
  }

  async addUserAccessesWithToken(channels: { channel: 'WEB' | 'APP'; firebaseToken?: string }[]): Promise<this> {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i]['channel'];
      const uaBuilder = new UserAccessBuilder(channel);
      uaBuilder.setFirebaseToken(channels[i]['firebaseToken']);
      const userAccess = await uaBuilder.build();
      this.user.userAccesses.push(userAccess);
      this.credentials.push(uaBuilder.getCredentials());
    }

    return this;
  }
  build(): UserEntity {
    const { registrationProvider, socialProfileId, phone, email } = this.user;
    if (registrationProvider !== 'LOCAL' && !socialProfileId) {
      throw new BadRequestException(`Registrtion requires a valid ${registrationProvider} profileId`);
    }
    console.log('Provided phone or email ', phone, email);
    if (!phone && !email) {
      throw new BadRequestException('Registrtion requires a valid phone or email');
    }

    return this.user;
  }
  getNotificationDetail(userId: number): IAccountSMS {
    const _credential = this.credentials.find((o) => o.channel === this.requestInfo.channel);
    return {
      name: this.user.username,
      destination: this.user.phone,
      msg: `your account registration is successful!`,
      subject: `OTP_VERIFICATION`,
      otpCode: _credential.otpCode,
      pinCode: this.requestInfo.channel === 'APP' ? _credential.pinCode : null,
      password: this.requestInfo.channel === 'WEB' ? _credential.password : null,
      userId,
    };
  }
}
