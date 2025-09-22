import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DetailResponse, USER_STATUS } from '@app/shared';
import { DataSource } from 'typeorm';
import { CommonUserService } from './common-user.service';
import { GetUserService } from './get-user.service';
import { UserEntity } from '@app/db';
import { UpdateUserPayload } from '../dtos';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly ds: DataSource,
    private readonly common: CommonUserService,
    private readonly getUserService: GetUserService,
  ) {}
  public async updateUser(payload: UpdateUserPayload): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();

      const updatePayload = await payload.getUpdatePayload();
      const user = await this.getUserService.getByUserId(qryR.manager, updatePayload.id);
      if (!user) {
        throw new BadRequestException(`Requested user not found`);
      }
      let isPhoneUsed = false,
        isEmailUsed = false;
      if (updatePayload.phone) {
        isPhoneUsed = await this.common.isPhoneAlreadyUsed(qryR.manager, user.realm, updatePayload.phone, user.id);
      }
      if (updatePayload.email) {
        isEmailUsed = await this.common.isEmailAlreadyUsed(qryR.manager, user.realm, updatePayload.email, user.id);
      }
      payload.validateUpdate(user, isPhoneUsed, isEmailUsed);
      const updatedUser = await qryR.manager.save(UserEntity, { ...user, ...updatePayload });

      await qryR.commitTransaction();
      payload.deleteOldProfilePic();
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

  async updateUserActivation(data: UserEntity): Promise<DetailResponse<UserEntity> | undefined> {
    const qryR = this.ds.createQueryRunner();
    try {
      await qryR.connect();
      await qryR.startTransaction();
      if (data.status === USER_STATUS.ACTIVE) {
        const updatedUser = await qryR.manager.update(UserEntity, data.id, { status: USER_STATUS.BLOCKED });
      await qryR.commitTransaction();
      return new DetailResponse(updatedUser.raw);
      } else {
        const updatedUser = await qryR.manager.update(UserEntity, data.id, { status: USER_STATUS.ACTIVE });
        await qryR.commitTransaction();
        return new DetailResponse(updatedUser.raw);
      }
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

