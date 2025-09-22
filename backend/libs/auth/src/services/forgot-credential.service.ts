import { UserNotificationService } from '@app/notification';
import { GetUserService } from '@app/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ForgotCredentialPayload } from '../dtos';
import { DetailResponse } from '@app/shared';

@Injectable()
export class ForgotCredentialService {
  constructor(
    private readonly ds: DataSource,
    private readonly notify: UserNotificationService,
    private readonly getUserService: GetUserService,
  ) {}

  public async resent(payload: ForgotCredentialPayload) {
    const qryR = this.ds.createQueryRunner();

    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { realm, phone, email, ua } = await payload.getRequestDto();

      console.log('1 Hello World lalals ');
      const user = await this.getUserService.getByPhoneEmailAndRealm(qryR.manager, realm, phone, email);
      console.log('2 Hello World lalals ');
      const updatedUser = await qryR.manager.save(await payload.getUpdatedUserDetail(user));
      console.log('3 Hello World lalals ');
      await qryR.commitTransaction();
      console.log('4 Hello World lalals ');

      const smsDetail = payload.getSMSDetail();

      await this.notify.sendAuthSMS(smsDetail);
      await this.notify.sendResetPasswordEmail(updatedUser, smsDetail.password, ua);

      return new DetailResponse(updatedUser);
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error?.code, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await qryR.release();
    }
  }
}
