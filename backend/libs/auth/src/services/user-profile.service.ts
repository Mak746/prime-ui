import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { CreateUserProfileDto, UpdateUserProfileDto } from '../dtos/user-profile.dto';
import { UserProfileEntity } from '@app/db';
import { DetailResponse } from '@app/shared';
import { Strategy as GooglePlusTokenStrategy } from 'passport-google-plus-token';

//import { UsersService } from './users.services';
//import { DetailResponse } from '@wecare/shared';

@Injectable()
export class UserProfileService {
  constructor(
    //@InjectRepository(UserProfileEntity)
    //private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly datasource: DataSource,
  ) {}

  //async getProfile(userId: number) {
  //let profile = await this.userProfileRepository.findOne({
  //where: {
  //user: {
  //id: userId,
  //},
  //},
  //relations: {
  //city: true,
  //country: true,
  //user: true,
  //},
  //});

  //if (!profile) {
  //profile = await this.userProfileRepository.save({
  //user: {
  //id: userId,
  //},
  //});
  //}

  //return new DetailResponse(profile.toDto());
  //}

  //async createUserProfile(createUserProfileDto: CreateUserProfileDto, userId: number) {
  //const user = await this.userService.findById(userId);

  //const userProfile = await this.userProfileRepository.save({
  //...createUserProfileDto,
  //userId,
  //});

  //return userProfile;
  //}
  //
  async updateUserProfilePicture(user_id: number, profile_picture: string) {
    const getProfile = await this.datasource.getRepository(UserProfileEntity).findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });
    const profile = await this.datasource.getRepository(UserProfileEntity).preload({
      id: getProfile.id,
      profilePic: profile_picture,
    });

    await this.datasource.getRepository(UserProfileEntity).save(profile);

    return new DetailResponse(profile.toDto());
  }

  async updateUserProfile(user_id: number, profile_picture: string, { ...dtos }: CreateUserProfileDto) {
    const getProfile = await this.datasource.getRepository(UserProfileEntity).findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });

    const profile = await this.datasource.getRepository(UserProfileEntity).preload({
      id: getProfile.id,
      profilePic: profile_picture,
      firstName: dtos.firstName,
      middleName: dtos.middleName,
      nationalId: dtos.nationalId,
      gender: dtos.gender,
      lastName: dtos.lastName,
      country: { id: dtos.countryId },
      city: { id: dtos.cityId },
      state: { id: dtos.stateId },
      user: { id: user_id },
    });

    await this.datasource.getRepository(UserProfileEntity).save(profile);

    return new DetailResponse(profile.toDto());
  }

  //async updateUserProfileWeb(userId: number, profile_picture: string, { ...dtos }: CreateUserProfileDto) {
  //const profile = await this.userProfileRepository.findOne({
  //where: {
  //id: userId,
  //},
  //});

  //await this.userProfileRepository.preload({
  //id: profile.id,
  //profile_picture,
  //first_name: dtos.firstName,
  //gender: dtos.gender,
  //last_name: dtos.lastName,
  //country: { id: dtos.country_id ?? null },
  //city: { id: dtos.city_id ?? null },
  //state: { id: dtos.state_id ?? null },
  //});

  //return profile;
  //}

  //async create(profile_picture: string, { user_id, ...dtos }: CreateUserProfileDto) {
  //const profile = await this.userProfileRepository.create({
  //user: { id: user_id },
  //profile_picture,
  //first_name: dtos.firstName,
  //gender: dtos.gender,
  //last_name: dtos.lastName,
  //country: { id: dtos.country_id },
  //city: { id: dtos.city_id },
  //state: { id: dtos.state_id },
  //});

  //await this.userProfileRepository.save(profile);

  //return new DetailResponse(profile.toDto());
  //}
}
