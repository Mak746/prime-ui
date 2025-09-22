import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { BasePageOptionsDto } from '@app/shared';

export class ActivityLogPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  logTitle?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  parentUserId?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  logText?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userFullname?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  createdAtRange?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ipAddress?: string;
}

export class CreateActivityLogDto {
  @IsString()
  logText: string;

  @IsString()
  logTitle: string;

  @IsString()
  ipAddress: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  channel?: string;

  // RELATIONS

  @IsNumber()
  @Type(() => Number)
  userId: number;
}
