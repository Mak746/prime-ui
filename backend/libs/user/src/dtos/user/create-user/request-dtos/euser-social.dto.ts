import { RegistrationProvider } from '@app/shared';
import { IsString, MinLength, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class RegisterEUserSocialDto {
  @IsString()
  @MinLength(5, {
    message: 'fullName is too short. Atleast, it should be $constraint1 characters, but actual is $value',
  })
  fullName: string;

  @IsString()
  socialProfileId: string;

  @IsString()
  registrationProvider: RegistrationProvider;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePic?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
