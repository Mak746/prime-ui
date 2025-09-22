import { AccessDeviceEntity, UserAccessEntity, UserEntity } from '@app/db';
import { IRequestInfo, IsEqualTo, IsPasswordValid, isEmailValid, parsePhone } from '@app/shared';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { IChangeOwnCredential, IPreviousAndNewCredential } from './change-own-credential.dto';

export class SetPinCodeDto implements IChangeOwnCredential {
  getPreviousAndNewCredential(): IPreviousAndNewCredential {
    return {
      previousCredential: `${this.previousPin}`,
      newCredential: `${this.pinCode}`,
    };
  }
  @IsString()
  phone: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  previousPin: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  pinCode: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1000)
  @Max(9999)
  @IsEqualTo('pinCode')
  confirmPinCode: number;
}

export class SetPasswordDto implements IChangeOwnCredential {
  getPreviousAndNewCredential(): IPreviousAndNewCredential {
    return {
      previousCredential: this.previousPassword,
      newCredential: this.password,
    };
  }
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  previousPassword: string;

  @IsPasswordValid()
  @MinLength(6)
  @MaxLength(127)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEqualTo('password')
  confirmPassword: string;
}

export class SetCredentialPayload {
  private _phone: string;
  private _email: string;

  private _previousAndNewCredential: IPreviousAndNewCredential;

  // Request user details...
  private _requestInfo: IRequestInfo;
  // target user
  private _userAccess: UserAccessEntity;
  private _user: UserEntity;

  constructor(dto: SetPinCodeDto | SetPasswordDto, requestInfo: IRequestInfo) {
    this._requestInfo = requestInfo;
    this._previousAndNewCredential = dto.getPreviousAndNewCredential();

    if ('pinCode' in dto) {
      const { phone } = dto;
      const parsedPhone = parsePhone(phone.trim());
      if (!parsedPhone.valid) {
        throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
      }

      this._phone = parsedPhone.number.e164.replace('+', '');
    } else {
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
    }
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
  private async doesTempCredentialMatch() {
    const { tempSecretHash } = this._userAccess;
    const { previousCredential } = this._previousAndNewCredential;
    const prevPasswordMatch = tempSecretHash && (await bcrypt.compare(previousCredential, tempSecretHash));
    if (!prevPasswordMatch) {
      throw new UnauthorizedException(`Invalid Account Access Detail(s) provided`);
    }
  }
  private async isCredentialSimilarToPrevious() {
    const { tempSecretHash } = this._userAccess;
    const { newCredential } = this._previousAndNewCredential;
    const newPasswordMatch = tempSecretHash && (await bcrypt.compare(newCredential, tempSecretHash));
    if (newPasswordMatch) {
      throw new UnauthorizedException(
        `Failed to set your new password. Please provide a diffrent password from your previous one.`,
      );
    }
  }

  public async isValidSetCredential(user: UserEntity): Promise<boolean | undefined> {
    this._user = user;
    this._userAccess = user?.userAccesses.find((o) => o.accessChannel === this._requestInfo.channel);

    this.userExists();
    this.userAccessExists();
    this.isValidUserStatus();
    await this.doesTempCredentialMatch();
    await this.isCredentialSimilarToPrevious();
    this._userAccess.secretHash = await bcrypt.hash(this._previousAndNewCredential.newCredential, 12);
    return true;
  }

  public getUpdatedUserDetail(): UserEntity {
    const deviceWithHash = this._requestInfo.device.getFormatedUserAgent(this._userAccess.id);
    const verifiedAccessDevice: AccessDeviceEntity = new AccessDeviceEntity({
      ...deviceWithHash,
    });

    const existingDevice = this._userAccess.accessDevices?.find(
      (o) => o.deviceHash === verifiedAccessDevice.deviceHash,
    );
    if (!existingDevice) {
      this._userAccess.accessDevices = [...this._userAccess.accessDevices, verifiedAccessDevice];
    }
    this._userAccess.status = 'ACTIVE';
    this._userAccess.tempSecretHash = '';
    this._user.status = 'ACTIVE';

    this._user.userAccesses = [...this._user.userAccesses, this._userAccess];
    return this._user;
  }

  public getRequestDto() {
    return { phone: this._phone, email: this._email, realm: this._requestInfo.realm };
  }
}
