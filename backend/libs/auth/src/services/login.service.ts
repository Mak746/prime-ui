import { UserEntity } from '@app/db';
import { DetailResponse, USER_STATUS } from '@app/shared';
import { GetUserService } from '@app/user/services';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoginPayload } from '../dtos';
import { LoginHistoryService } from './login-history.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly ds: DataSource,
    private readonly getUserService: GetUserService,
    private readonly loginHistoryService: LoginHistoryService,
  ) {}

  public async login(
    payload: LoginPayload,
  ): Promise<DetailResponse<{ user: UserEntity }> | DetailResponse<string> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const { phone, email, requestInfo, userId, username } = await payload.getRequestDto();
            const user = userId
        ? await this.getUserService.getByUserId(qryR.manager, userId)
        :
          await this.getUserService.getByPhoneEmailOrUsernameAndRealm(
            qryR.manager,
            requestInfo.realm,
            phone,
            email,
            username,
          );
            const result = await payload.processUserLogin(user);
if (user.status !== USER_STATUS.ACTIVE && user.status !== USER_STATUS.PENDING) {
        throw new HttpException('User is not Active', HttpStatus.FORBIDDEN);
      }
      if (result?.success) {
                return new DetailResponse({ user });
      }
      await qryR.commitTransaction();
      return result;
    } catch (error) {
      await qryR.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error?.code || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await qryR.release();
    }
  }
}
