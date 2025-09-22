import { UserAccessEntity, UserEntity } from '@app/db';
import {
  DetailResponse,
  ERR_RESET_CREDENTIAL,
  ERR_VERIFY_OTP,
  IRequestInfo,
  compareApiKeys,
  isEmailValid,
  parsePhone,
} from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PinLoginDto {
  @IsString()
  @Type(() => String)
  phone: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(9999)
  pinCode: number;
}

export class ApiKeyLoginDto {
  @IsString()
  key: string;
}

export class PasswordLoginDto {
  @IsString()
  @Type(() => String)
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => String)
  password?: string;
}

export interface IApiKeyParts {
  userId: number;
  apiClientId: string;
  key: string;
}
export class LoginPayload {
  private _identifier?: string;
  private _credential?: string;

  private _userId?: number;
  private _phone?: string;
  private _email?: string;
  private _username?: string;

  // Request user details...
  private _requestInfo: IRequestInfo;

  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: PinLoginDto | PasswordLoginDto | ApiKeyLoginDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    if ('pinCode' in dto) {
      const { phone, pinCode } = dto;
      const parsedPhone = parsePhone(phone.trim());
      if (!parsedPhone.valid) {
        throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
      }
      this._phone = parsedPhone.number.e164.replace('+', '');
      // this._pinCode = pinCode;
      this._identifier = `${this._phone}`;
      this._credential = `${pinCode}`;
    } else if ('key' in dto) {
      const { key } = dto;
      const { userId } = this.getParsedApiKey(key);
      this._credential = `${key}`;
      this._userId = userId;
      ////
    } else {
      const { identifier, password } = dto;
      const validEmail = isEmailValid(identifier.trim());
      const parsedPhone = parsePhone(identifier.trim());
      if (!parsedPhone.valid && !validEmail) {
        this._username = identifier.trim();
        this._identifier = this._username;
        //throw new UnauthorizedException(`Value '${identifier}' is not valid email or phone number`);
      }
      if (validEmail) {
        this._email = identifier.trim();
        this._identifier = this._email;
      } else if (parsedPhone.valid) {
        this._phone = parsedPhone.number.e164.replace('+', '');
        this._identifier = this._phone;
      }
      // this._password = password;
      this._credential = `${password}`;
    }
  }

  /////
  // API Access
  private getParsedApiKey(apiKey: string): IApiKeyParts {
    if (!apiKey) throw new BadRequestException(`Invalid API Key`);
    const parts = Buffer.from(apiKey, 'base64').toString('utf8').split(':');
    if (!parts || parts.length !== 3) {
      throw new UnauthorizedException(`1-Invalid API Key`);
    }
    const userId = parts[0]; // userid
    const apiClientId = parts[1]; // apiClientId
    const key = parts[2]; // secret

    const regexExpV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    // console.log('--------------------------------------------', parts);
    if (isNaN(Number(userId)) || !regexExpV4.test(apiClientId) || key.length !== 32) {
      throw new UnauthorizedException(`2-Invalid API Key`);
    }
    return { apiClientId, userId: +userId, key };
  }
  private doesApiCredentialMatch() {
    const { secretHash } = this._userAccess;
    const isMatchingApiKey = compareApiKeys(secretHash, this._credential);

    if (!isMatchingApiKey) {
      throw new UnauthorizedException(`5-Invalid Account Access Detail(s) provided`);
    }
    return this.isApiUrlValid();
  }
  private isApiUrlValid() {
    const { allowedUrls } = this._userAccess;
    const { ip } = this._requestInfo;

    // check source url
    const isRegisteredIp = allowedUrls.split(',').includes(ip);
    // console.log('isRegisteredIp', isRegisteredIp);
    const isRegisteredOrigin = allowedUrls.split(',').includes(origin);
    // console.log('isRegisteredOrigin', isRegisteredOrigin);
    const isRegisteredUrl = isRegisteredIp || isRegisteredOrigin;
    // console.log('isRegisteredUrl', isRegisteredUrl);
    // console.log('ipAddress', ipAddress);

    const isDevelopmentEnv = process.env.NODE_ENV === 'development';
    // console.log('isDevelopmentEnv', isDevelopmentEnv);
    //  const isDevOrigin = isDevelopmentEnv && ['::ffff:172.18.0.1'].includes(ip);
    // console.log(`['::ffff:172.18.0.1'].includes(ipAddress)`, ['::ffff:172.18.0.1'].includes(ipAddress));

    if (!isRegisteredUrl && !isDevelopmentEnv) {
      throw new UnauthorizedException(`Invalid Credential Provided / Not Registered Client`);
    }

    // if (!isMatchingApiKey) {
    //   throw new UnauthorizedException(`2-Invalid Account Access Detail(s) provided`);
    // }
    return new DetailResponse(null);
  }

  /////

  private userExists() {
    if (!this._user) {
      throw new UnauthorizedException('1-Invalid Account Access Detail(s) provided');
    }
  }
  private userAccessExists() {
    if (!this._userAccess) {
      throw new UnauthorizedException('Account not registered for the service or channel');
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
  public isAccountVerified() {
    if (['PENDING'].includes(this._user.status) || ['PENDING'].includes(this._userAccess.status)) {
      return new DetailResponse(
        { identifier: this._identifier },
        `Account not verified. Please verify and activate your account access`,
        false,
        ERR_VERIFY_OTP,
      );
    }
    return new DetailResponse(null);
  }
  public isValidCredentialSet() {
    const { secretHash, tempSecretHash, accessChannel } = this._userAccess;
    if (!['WEB', 'APP', 'API'].includes(accessChannel)) {
      throw new UnauthorizedException(`Account Access not permitted for the channel`);
    }
    if (!secretHash && tempSecretHash) {
      return new DetailResponse(
        { identifier: this._identifier },
        `Account_ access credential reset required`,
        false,
        ERR_RESET_CREDENTIAL,
      );
    }
    return new DetailResponse(null);
  }

  private async doesCredentialMatch() {
    const { secretHash, tempSecretHash, accessChannel } = this._userAccess;
    if (accessChannel === 'API') {
      return this.doesApiCredentialMatch();
    }
    const isMatchingPassword = secretHash && (await bcrypt.compare(this._credential, secretHash));
    // user is logging in with new resetted pass
    const isMatchingTempPassword = tempSecretHash && (await bcrypt.compare(this._credential, tempSecretHash));
    if (!isMatchingPassword && !isMatchingTempPassword) {
      // throw new UnauthorizedException('2-Invalid Account Access Detail(s) provided');
      return new DetailResponse(
        { identifier: this._identifier },
        `2-Invalid Account Access Detail(s) provided`,
        false,
        401,
      );
    }
    if (!isMatchingPassword && isMatchingTempPassword) {
      if (['PENDING'].includes(this._user.status) || ['PENDING'].includes(this._userAccess.status)) {
        return new DetailResponse(
          { identifier: this._identifier },
          `Account not verified. Please verify and activate your account access`,
          false,
          ERR_VERIFY_OTP,
        );
      }
      return new DetailResponse(
        { identifier: this._identifier },
        '-Account access credential reset required',
        false,
        ERR_RESET_CREDENTIAL,
      );
    }
    return new DetailResponse(null);
  }
  public async processUserLogin(user: UserEntity): Promise<DetailResponse<string>> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();

    const isVerified = this.isAccountVerified();
    const isCredValid = this.isValidCredentialSet();
    const doesCredMatch = await this.doesCredentialMatch();

    if (!isVerified.success && doesCredMatch.success) {
      return isVerified;
    }
    if (!isCredValid.success && doesCredMatch.success) {
      return isCredValid;
    }
    // const doesCredMatch = await this.doesCredentialMatch();
    if (!doesCredMatch.success) {
      return doesCredMatch;
    }

    return new DetailResponse('valid');
  }
  public getRequestDto() {
    return {
      phone: this._phone,
      email: this._email,
      username: this._username,
      requestInfo: this._requestInfo,
      userId: this._userId,
    };
  }
}
export class AuthResponseDto {
  success: boolean;
  statusCode: number;
  message: string;
  user?: UserEntity;
}
