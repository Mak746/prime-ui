import { UserAccessEntity, UserEntity } from '@app/db';
import { IAccountSMS } from '@app/notification';
import { IRequestInfo, generateSecret, isEmailValid, parsePhone } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';

export class ForgotCredentialDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

export class ForgotCredentialPayload {
  private _phone: string;
  private _email: string;

  private _password: string;

  private _requestInfo: IRequestInfo;

  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: ForgotCredentialDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    const { identifier } = dto;

    const validEmail = isEmailValid(identifier.trim());
    const parsedPhone = parsePhone(identifier.trim());

    if (!parsedPhone.valid && !validEmail) {
      throw new UnauthorizedException(`Value '${identifier}' is not valid email or phone number`);
    }
    if (validEmail) {
      this._email = identifier.trim();
    }
    if (parsedPhone.valid) {
      this._phone = parsedPhone.number.e164.replace('+', '');
    }
    this._requestInfo = requestInfo;
  }

  private userExists() {
    if (!this._user) {
      throw new UnauthorizedException(`Account not registered for the service`);
    }
  }
  private userAccessExists() {
    if (!this._userAccess) {
      throw new UnauthorizedException(`Account not registered for the service or channel`);
    }
  }
  private isValidUserStatus() {
    if (
      ['BLOCKED', 'SUSPENDED'].includes(this._user.status) ||
      ['BLOCKED', 'SUSPENDED'].includes(this._userAccess.status)
    ) {
      throw new UnauthorizedException(`Account is disabled or suspended`);
    }
  }

  public async getUpdatedUserDetail(user: UserEntity): Promise<UserEntity> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();

    this._password = generateSecret(6);
    this._userAccess.tempSecretHash = await bcrypt.hash(this._password, 12);

    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];

    return this._user;
  }

  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this._requestInfo.realm, ua: this._requestInfo.device };
  }

  public getSMSDetail(): IAccountSMS {
    if (!this._user) {
      throw new BadRequestException(`Could not locate user detail`);
    }

    return {
      name: this._user.username,
      destination: this._user.phone,
      subject: `FORGOT_PASSWORD`,
      realm: this._requestInfo.realm,
      password: this._password,
      userId: this._user.id,
    };
  }
}
