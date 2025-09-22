import { NotificationEntity } from '@app/db/entities';
import { NotificationStatus, PageDto, PageMetaDto } from '@app/shared';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateNotificationDto, NotificationPageOptionsDto } from '../dtos';

@Injectable()
export class NotificationService {
  constructor(private readonly ds: DataSource) {}
  private async getNotification(
    options: Partial<{ id: number; isActive: string }>,
  ): Promise<NotificationEntity | undefined> {
    const qb = this.ds.getRepository(NotificationEntity).createQueryBuilder('notification');
    if (options.id) {
      qb.andWhere('notification.id = :id', { id: options.id });
    }
    return qb.getOne();
  }
  public async getNotificationById(id: number): Promise<NotificationEntity | undefined> {
    const notification = await this.getNotification({ id });
    return notification;
  }
  public async getNotifications(options: NotificationPageOptionsDto): Promise<PageDto<NotificationEntity> | undefined> {
    const qb = this.ds
      .getRepository(NotificationEntity)
      .createQueryBuilder('notification')
      .leftJoin('notification.user', 'user')
      .leftJoin('user.userProfile', 'userProfile')
      .leftJoin('notification.notificationCategory', 'notificationCategory');


    if (options.userId) {
      qb.andWhere('user.id = :userId', {
        userId: options.userId,
      });
    }

    if (options.type) {
      qb.andWhere('notification.type = :type', { type: options.type });
    }

    if (options.status) {
      qb.andWhere('notification.status = :status', {
        status: options.status,
      });
    }
    if (options.subject) {
      qb.andWhere(`notification.subject LIKE :subject`, {
        subject: `%${options.subject}%`,
      });
    }
    const [notifications, notificationsCount] = await qb
      .skip((options.page - 1) * options.take)
      .take(options.take)
      .orderBy(`notification.${options.sort || 'updatedAt'}`, options.order)
      .getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      options,
      itemCount: notificationsCount,
    });
    const data = await notifications.map((la) => la.toDto());
    return new PageDto(data, pageMetaDto);
  }

  public async createNotification(createNotification: CreateNotificationDto): Promise<NotificationEntity | undefined> {
    const notification = this.ds.getRepository(NotificationEntity).create({ ...createNotification });
    await this.ds.getRepository(NotificationEntity).save(notification);
    return notification;
  }

  public async updateStatus(status: NotificationStatus, id: number): Promise<NotificationEntity | undefined> {
    const notification = await this.getNotification({ id });
    if (!notification) {
      throw new HttpException('Requested Notification Not Found', HttpStatus.BAD_REQUEST);
    }
    const qb = this.ds.getRepository(NotificationEntity).createQueryBuilder('notification');
    await qb.update().set({ status }).where('id = :id', { id }).execute();
    return this.getNotification({ id });
  }
}
