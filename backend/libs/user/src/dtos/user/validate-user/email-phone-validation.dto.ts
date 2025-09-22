import { KeysOf, REALM, Realm, isEmailValid, parsePhone } from '@app/shared';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class PhoneEmailValidationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  userId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  // @IsEmail()
  email?: string;

  @IsString()
  @IsIn(KeysOf(REALM))
  realm: Realm;
}
export class PhoneEmailValidationRespDto {
  email: boolean;
  phone: boolean;
}
export class PhoneEmailValidationPayload {
  private _userId?: number;
  private _phone?: string;
  private _email?: string;
  private _realm: string;

  constructor(dto: PhoneEmailValidationDto) {
    const { userId, phone, email, realm } = dto;
    const parsedPhone = parsePhone(phone.trim());
    if (parsedPhone.valid) {
      this._phone = parsedPhone.number.e164.replace('+', '');
    }
    const validEmail = isEmailValid(email.trim());
    if (validEmail) {
      this._email = email.trim();
    }
    this._realm = realm;
    this._userId = userId;
  }
  public getParameters() {
    return {
      id: this._userId,
      email: this._email,
      phone: this._phone,
      realm: this._realm,
    };
  }
}
