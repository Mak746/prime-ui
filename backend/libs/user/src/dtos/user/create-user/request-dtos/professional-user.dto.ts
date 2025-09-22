import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class RegisterProfessionalUserDto {
  @IsString()
  @MinLength(5, {
    message: 'username is too short. Atleast, it should be $constraint1 characters, but actual is $value',
  })
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nationalId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  cityId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  stateId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  countryId?: number;

  @IsNumber()
  @Type(() => Number)
  professionTypeId: number;
}
