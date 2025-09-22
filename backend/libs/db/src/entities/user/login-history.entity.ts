import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccessDeviceEntity } from './access-device.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'login_histories' })
export class LoginHistoryEntity extends BaseEntity {
  @Column({ type: 'timestamp', nullable: true })
  logoutTime?: Date;

  @ManyToOne(() => AccessDeviceEntity, (o: AccessDeviceEntity) => o.loginHistories, { nullable: false })
  @JoinColumn({ name: 'access_device', referencedColumnName: 'id' })
  accessDevice: AccessDeviceEntity;

  @Column({ name: 'access_device', nullable: false, unsigned: true })
  accessDeviceId: number;

  // User
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.loginHistories, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  toDto() {
    return plainToClass(LoginHistoryEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<LoginHistoryEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
