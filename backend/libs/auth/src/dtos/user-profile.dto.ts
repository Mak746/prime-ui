import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
//import { GenderEnum } from '../../enums/gender.enum';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { GENDER_TYPE, GenderType, KeysOf } from '@app/shared';

export class CreateUserProfileDto {
  //@IsNumber()
  //@Type(() => Number)
  //user_id: number;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  profilePic?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsIn(KeysOf(GENDER_TYPE))
  @IsOptional()
  gender?: GenderType;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  countryId?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cityId?: number;

  @IsNumber()
  @IsOptional()
  stateId?: number;

  //@IsOptional()
  //@IsString()
  //address: string;
}
export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
