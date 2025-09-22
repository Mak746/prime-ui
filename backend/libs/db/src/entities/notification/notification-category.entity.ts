import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'notification_categories' })
export class NotificationCategoryEntity extends BaseEntity {
  @Column()
  type: string;

  @Column()
  icon: string;

  @Column()
  desc: string;

  @OneToMany(() => NotificationEntity, (o) => o.notificationCategory, { nullable: true })
  notifications?: NotificationEntity;

  toDto() {
    return plainToClass(NotificationCategoryEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
}
