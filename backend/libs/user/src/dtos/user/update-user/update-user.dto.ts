import { UserEntity } from '@app/db';
import {
  ADMIN_ROLE,
  AccessUserAgent,
  CHANNEL,
  CUSTOMER_ROLE,
  Channel,
  GENDER_TYPE,
  GenderType,
  KeysOf,
  RELATIONSHIP_TYPE,
  ROLE,
  RelationshipType,
  Role,
  StringUtil,
  UserStatus,
  parsePhone,
} from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { existsSync, unlinkSync } from 'fs';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(5, {
    message: 'username is too short. Atleast, it should be $constraint1 characters, but actual is $value',
  })
  username?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;

  @IsIn(KeysOf(ROLE))
  @IsNotEmpty()
  @IsOptional()
  role?: Role;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @Type(() => String)
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['ACTIVE', 'BLOCKED'])
  status?: UserStatus;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dob?: Date;

  @IsEnum(GENDER_TYPE)
  @IsOptional()
  gender?: GenderType;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  cityId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  stateId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  countryId?: number;
}
// export class UpdateCustomerDto {
//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   @MinLength(5, {
//     message: 'fullName is too short. Atleast, it should be $constraint1 characters, but actual is $value',
//   })
//   fullName?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   phone?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   profilePic?: string;

//   @IsIn(KeysOf(CUSTOMER_ROLE))
//   @IsNotEmpty()
//   @IsOptional()
//   role?: CustomerRole;

//   @IsString()
//   @IsEmail()
//   @IsNotEmpty()
//   @IsOptional()
//   email?: string;

//   @IsString()
//   @Type(() => String)
//   @IsNotEmpty()
//   @IsOptional()
//   @IsIn(['ACTIVE', 'BLOCKED'])
//   status?: UserStatus;
// }

export class UpdateUserPayload {
  private _userId: number;
  // Request body...
  private _fullName: string;
  private _phone: string;
  private _profilePic: string;
  private _oldProfilePic: string;
  private _role: Role;
  private _email: string;
  private _status: UserStatus;

  // Request user details...
  private _channel: Channel;
  private _ip: string;
  private _updatedBy: number;
  private _device: AccessUserAgent;

  private _user: UserEntity;

  constructor(
    dto: UpdateUserDto,
    userId: number,
    channel: Channel,
    ip: string,
    updatedBy: number,
    device?: AccessUserAgent,
  ) {
    const { username: fullName, phone, role, email, status, profilePic } = dto;
    this._userId = userId;
    if (fullName) {
      this._fullName = StringUtil.toTitleCase(fullName);
    }
    if (phone) {
      const parsedPhone = parsePhone(phone.trim());
      if (!parsedPhone.valid) {
        throw new BadRequestException(`The value '${phone}' is not valid for the field 'phone'`);
      }
      this._phone = parsedPhone.number.e164.replace('+', '');
    }
    if (role) {
      this._role = role;
    }
    if (email) {
      this._email = email.trim();
    }
    if (status) {
      this._status = status;
    }

    this._channel = channel;
    this._profilePic = profilePic;
    this._ip = ip;
    this._updatedBy = updatedBy;
    this._device = device;
  }

  private isValidUserStatus() {
    if (['SUSPENDED'].includes(this._user.status)) {
      throw new BadRequestException(`Account is disabled or suspended`);
    }
  }
  private isProfilePicUpdate() {
    // if (this._user.profilePic && this._profilePic && existsSync(this._user.profilePic)) {
    //   this._oldProfilePic = this._user.profilePic;
    // }
  }
  private isValidRole() {
    if (this._role && this._user.realm === 'ADMIN') {
      if (!KeysOf(ADMIN_ROLE).includes(ADMIN_ROLE[`${this._role}`])) {
        throw new BadRequestException(`Updated role '${this._role}' is not valid for the user`);
      }
    } else {
      if (this._role && !KeysOf(CUSTOMER_ROLE).includes(CUSTOMER_ROLE[`${this._role}`])) {
        throw new BadRequestException(`Updated role '${this._role}' is not valid for the user`);
      }
    }
  }
  public getUpdatePayload() {
    return {
      id: this._userId,
      fullName: this._fullName,
      phone: this._phone,
      role: this._role,
      email: this._email,
      profilePic: this._profilePic,
      status: this._status,
    };
  }
  public validateUpdate(user: UserEntity, isPhoneUsed: boolean, isEmailUsed: boolean) {
    this._user = user;
    this.isValidUserStatus();
    this.isValidRole();
    this.isProfilePicUpdate();
    if (isPhoneUsed) {
      throw new BadRequestException(`Phone Number ${this._phone} is already used`);
    }
    if (isEmailUsed) {
      throw new BadRequestException(`Email Address ${this._email} is already used`);
    }
  }
  public deleteOldProfilePic() {
    if (this._oldProfilePic && existsSync(this._oldProfilePic)) {
      unlinkSync(this._oldProfilePic);
    }
  }
}

export class UpdateFirebaseTokenDto {
  @IsEnum(CHANNEL)
  accessChannel: Channel;

  @IsString()
  newToken: string;
}
