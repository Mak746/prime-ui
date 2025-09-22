import {

  UserAccessEntity,
  UserEntity,
  UserProfileEntity,
} from '@app/db';
import { DetailResponse } from '@app/shared';
import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { DataSource } from 'typeorm';
import { UpdateFirebaseTokenDto, UpdateUserDto } from '../dtos';

export class ResponseAppPatientProfileDto {
  userProfile: UserProfileEntity;

  dependantsCount: number;

  bookingsCount: number;

  questionsCount: number;


  user: UserEntity;
}

@Injectable()
export class UserProfileService {
  constructor(private readonly ds: DataSource) {}

  async getAppPatientProfile(userId: number, patientId: number) {
    const profile = await this.ds.getRepository(UserProfileEntity).findOne({
      where: {
        user: { id: userId },
      },
    });

    const user = await this.ds.getRepository(UserEntity).findOne({
      where: {
        id: userId,
      },
    });

    


   

    const resp = plainToClass(ResponseAppPatientProfileDto, {
      user: user,
      userProfile: profile,

    });

    return new DetailResponse(resp);
  }

  async updateProfilePicture(userId: number, profilePicture: string) {
    const userProfile = await this.ds.getRepository(UserProfileEntity).findOne({
      where: {
        user: { id: userId },
      },
    });

    const updated = await this.ds.getRepository(UserProfileEntity).preload({
      id: userProfile.id,
      profilePic: profilePicture,
    });

    await this.ds.getRepository(UserProfileEntity).save(updated);

    return new DetailResponse(updated);
  }

  async updateUserProfile(userId: number, dto: UpdateUserDto) {
    const userProfile = await this.ds.getRepository(UserProfileEntity).findOne({
      where: {
        user: { id: userId },
      },
    });

    const updated = await this.ds.getRepository(UserProfileEntity).preload({
      id: userProfile.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      cityId: dto.cityId,
      countryId: dto.countryId,
      stateId: dto.stateId,
      middleName: dto.middleName,
      nationalId: dto.nationalId,
      gender: dto.gender,
      address: dto.address,
    });

    await this.ds.getRepository(UserProfileEntity).save(updated);

    return new DetailResponse(updated);
  }

  async updateFirebaseToken(userId: number, dto: UpdateFirebaseTokenDto) {
    const userAccess = await this.ds.getRepository(UserAccessEntity).findOne({
      where: {
        userId: userId,
        accessChannel: dto.accessChannel,
      },
    });

    const data = await this.ds.getRepository(UserAccessEntity).preload({
      id: userAccess.id,
      accessChannel: dto.accessChannel,
      firebaseToken: dto.newToken,
    });

    return {
      token: data.firebaseToken,
    };
  }
}
