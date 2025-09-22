import { ConfigModule } from '@app/config';
import { NotificationCategoryEntity, NotificationEntity } from '@app/db/entities';
import { GlobalConfigModule } from '@app/global-config';
import { TypeOrmModule } from '@app/typeorm';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PatientNotificationController,
  ManageNotificationController,
  AppPatientNotificationController,
  AppProfessionalNotificationController,
} from './contorllers';
import {
  CommonNotificationService,
  NotificationService,
  UserNotificationService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity, NotificationCategoryEntity]),
    GlobalConfigModule,
    // forwardRef(() => GlobalConfigModule),
    BullModule.registerQueueAsync(
      {
        name: 'SMSProcessor',
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => config.get('bull'),
        inject: [ConfigService],
      },
      {
        name: 'MailProcessor',
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => config.get('bull'),
        inject: [ConfigService],
      },
    ),
  ],
  controllers: [
    PatientNotificationController,
    ManageNotificationController,
    AppPatientNotificationController,
    AppProfessionalNotificationController,
  ],
  providers: [NotificationService, UserNotificationService, CommonNotificationService],
  exports: [NotificationService, UserNotificationService, CommonNotificationService],
})
export class NotificationModule {}
