import {
  BasePageOptionsDto,
  KeysOf,
  NOTIFICATION_CHANNEL,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@app/shared';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateNotificationDto {
  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsString()
  destination: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_TYPE))
  type?: NotificationType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_CHANNEL))
  channel?: NotificationChannel;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_STATUS))
  status?: NotificationStatus;

  @IsNumber()
  @Type(() => Number)
  userId?: number;
}

export class NotificationPageOptionsDto extends BasePageOptionsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(KeysOf(NOTIFICATION_TYPE))
  type?: NotificationType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subject?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  status?: string;
}
