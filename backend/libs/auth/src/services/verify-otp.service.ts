import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetailResponse } from '@app/shared';
import { DataSource } from 'typeorm';
import { UserEntity } from '@app/db';
import { GetUserService } from '@app/user/services';
import { VerifyOtpPayload } from '../dtos';

@Injectable()
export class VerifyOTPService {
  constructor(
    private readonly ds: DataSource,
    private readonly getUserService: GetUserService,
  ) {}

  public async verify(payload: VerifyOtpPayload): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { phone, email, realm } = await payload.getRequestDto();
      const user = await this.getUserService.getByPhoneEmailAndRealm(qryR.manager, realm, phone, email);

      if (await payload.isValidOTPVerification(user)) {
        const verifiedUser = payload.getVerifiedUserDetail();
        await qryR.manager.save(verifiedUser);
      }
      await qryR.commitTransaction();
      return new DetailResponse();
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
