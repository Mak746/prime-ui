import { Module, forwardRef } from '@nestjs/common';

import {
  AccessDeviceEntity,
  ActivityLogEntity,
  ClientEntity,
  LoginHistoryEntity,
  UserAccessEntity,
  UserEntity,
  UserProfileEntity,
} from '@app/db';
import { GlobalConfigModule, GlobalConfigService } from '@app/global-config';
import { NotificationModule, UserNotificationService } from '@app/notification';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ActivityLogController,
  ClientController,
  ManageAgentController,
  ManageClientAccessController,
  ManageCompanyUserController,
  ManageCustomerController,
  WebActivityLogController,
  WebUserCommonController,
 
} from './controllers';
import {
  ActivityLogService,
  ClientAccessService,
  CommonUserService,
  CreateUserService,

  GetUserService,
  ListUsersService,
  PhoneAndEmailValidationService,
  UpdateUserService,

  UserProfileService,
} from './services';


const providers = [
  ActivityLogService,
  CommonUserService,
  CreateUserService,
  
  GetUserService,
  ListUsersService,
  PhoneAndEmailValidationService,
  UpdateUserService,
  ClientAccessService,

  UserProfileService,
];
const controllers = [
  ActivityLogController,
  ManageCompanyUserController,
  ManageCustomerController,
  ManageAgentController,
  WebActivityLogController,
  WebUserCommonController,
  ClientController,
  ManageClientAccessController,

];

@Module({
  imports: [
    forwardRef(() => GlobalConfigModule),
    forwardRef(() => NotificationModule),
    TypeOrmModule.forFeature([
      AccessDeviceEntity,
      UserAccessEntity,
      UserEntity,
      ActivityLogEntity,
      ClientEntity,
      LoginHistoryEntity,
      UserProfileEntity,
    ]),
  ],
  controllers,
  providers,
  exports: [...providers],
})
export class UserModule {}
