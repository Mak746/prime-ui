import { BasePageOptionsDto, KeysOf, REALM, ROLE, Realm, Role, USER_STATUS, UserStatus } from '@app/shared';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  idpId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  parentUserName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phoneOrName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  createdAtRange?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  parentCustomerId?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(REALM))
  realm?: Realm;

  @IsIn(KeysOf(USER_STATUS))
  @IsNotEmpty()
  @IsOptional()
  status?: UserStatus;

  @IsIn(KeysOf(ROLE))
  @IsNotEmpty()
  @IsOptional()
  role?: Role;

  @IsIn(KeysOf(ROLE), { each: true })
  @IsNotEmpty()
  @IsOptional()
  roles?: Role[];
}
