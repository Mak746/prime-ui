import { ActivityLogEntity } from '@app/db';
import { DetailResponse, PageDto, PageMetaDto, getStartAndEndDates } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ActivityLogPageOptionsDto } from '../dtos';

@Injectable()
export class ActivityLogService {
  constructor(private readonly ds: DataSource) {}

  private async getActivityLog(
    options: Partial<{ id: number; userId: number; parentUserId: number }>,
  ): Promise<DetailResponse<ActivityLogEntity> | undefined> {
    const qb = this.ds.createQueryBuilder(ActivityLogEntity, 'activityLog').leftJoinAndSelect('activityLog.user', 'user').leftJoinAndSelect('user.userProfile', 'userProfile');

    if (options.id) {
      qb.andWhere('activityLog.id = :id', { id: options.id });
    }
    if (options.userId) {
      qb.andWhere('activityLog.userId = :userId', { userId: options.userId });
    }
    return new DetailResponse(await qb.getOne());
  }
  public async getActivityLogById(
    options: Partial<{ id: number; userId: number; parentUserId: number }>,
  ): Promise<DetailResponse<ActivityLogEntity> | undefined> {
    const activityLog = await this.getActivityLog(options);
    return activityLog;
  }
  public async getActivityLogs(options: ActivityLogPageOptionsDto): Promise<PageDto<ActivityLogEntity> | undefined> {
    const qb = this.ds.createQueryBuilder(ActivityLogEntity, 'activityLog').leftJoinAndSelect('activityLog.user', 'user').leftJoinAndSelect('user.userProfile', 'userProfile').leftJoinAndSelect('userProfile.city', 'city').leftJoinAndSelect('userProfile.state', 'state').leftJoinAndSelect('userProfile.country', 'country');

    if (options.userId) {
      qb.andWhere('activityLog.userId = :userId', { userId: options.userId });
    }
    if (options.channel) {
      qb.andWhere('activityLog.channel = :channel', { channel: options.channel });
    }
    if (options.parentUserId) {
      qb.andWhere('user.parentUserId = :parentUserId', { parentUserId: options.parentUserId });
    }
    if (options.userFullname) {
      qb.andWhere(`user.fullName LIKE :userFullname`, { userFullname: `%${options.userFullname}%` });
    }
    if (options.id) {
      qb.andWhere('activityLog.id LIKE :id', { id: `%${options.id}%` });
    }
    if (options.logTitle) {
      qb.andWhere('activityLog.logTitle LIKE :logTitle', { logTitle: `%${options.logTitle}%` });
    }
    if (options.logText) {
      qb.andWhere(`activityLog.logText LIKE :logText`, { logText: `%${options.logText}%` });
    }
    if (options.ipAddress) {
      qb.andWhere(`activityLog.ipAddress LIKE :ipAddress`, { ipAddress: `%${options.ipAddress}%` });
    }
    if (options.createdAtRange) {
      const { start, end } = getStartAndEndDates(options.createdAtRange);
      qb.andWhere(`activityLog.createdAt BETWEEN :start AND :end`, { start, end });
    }

    // sort
    if (options.sort && options.sort === 'userFullname') {
      qb.orderBy(`user.fullName`, options.order);
    } else {
      qb.orderBy(`activityLog.${options.sort || 'createdAt'}`, options.order);
    }
    const [activityLogs, activityLogsCount] = await qb
      .skip((options.page - 1) * options.take)
      .take(options.take)
      .getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      options,
      itemCount: activityLogsCount,
    });
    const data = await activityLogs.map((la) => la.toDto());
    return new PageDto(data, pageMetaDto);
  }
}
