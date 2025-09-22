import { plainToClass } from 'class-transformer';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user';
import { BaseEntity } from '@app/shared';

@Entity({ name: 'activity_logs' })
export class ActivityLogEntity extends BaseEntity {
  @Column()
  logTitle: string;

  @Column({ type: 'text' })
  logText: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  channel?: string;

  // User - Action By
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.activityLogs, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @Column({ name: 'user_id', nullable: true, unsigned: true })
  userId?: number;

  toDto() {
    return plainToClass(ActivityLogEntity, this);
  }
  constructor(partial: Partial<ActivityLogEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
