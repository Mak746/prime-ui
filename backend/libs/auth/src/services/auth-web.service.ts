import { UserNotificationService } from '@app/notification';
import { IRequestInfo } from '@app/shared';
import { AdministrativeUserBuilder, RegisterAdminStaffDto } from '@app/user/dtos';
import { CreateUserService } from '@app/user/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthWebService {
  constructor(
    private readonly notify: UserNotificationService,
    private readonly createUserService: CreateUserService,
  ) {}
  public async initializeRootUser() {
    const dto: RegisterAdminStaffDto = {
      firstName: 'Wecare',
      middleName: '-',
      lastName: 'Admin',
      username: 'admin',
      phone: '251911756708',
      nationalId: '0000000000',
      role: 'ADMIN',
      email: 'info@wecare.com',
    };

    const requestInfo: IRequestInfo = { channel: 'WEB', ip: '127.0.0.1', realm: 'ADMIN' };
    const builder = new AdministrativeUserBuilder(dto, requestInfo);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);

    console.log('ADMIN CREATED: ', smsPayload);
    return user;
  }
}
