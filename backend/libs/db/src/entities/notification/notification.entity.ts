import {
  BaseEntity,
  NOTIFICATION_CHANNEL,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../user';
import { NotificationCategoryEntity } from './notification-category.entity';

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  destination: string;

  @Column({ type: 'enum', enum: NOTIFICATION_STATUS, default: 'PENDING', nullable: false })
  status: NotificationStatus;

  @Column({ type: 'enum', enum: NOTIFICATION_TYPE, nullable: false })
  type: NotificationType;

  @Column({ type: 'enum', enum: NOTIFICATION_CHANNEL, nullable: false })
  channel: NotificationChannel;

  // User
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.notifications, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  @ManyToOne(() => NotificationCategoryEntity, (o: NotificationCategoryEntity) => o.notifications, { nullable: true })
  @JoinColumn({ name: 'notification_category_id', referencedColumnName: 'id' })
  notificationCategory?: NotificationCategoryEntity;

  @Column({ name: 'notification_category_id', nullable: true, unsigned: true })
  notificationCategoryId?: number;

  toDto() {
    return plainToClass(NotificationEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<NotificationEntity>) {
    super();
    Object.assign(this, partial);
  }
}
