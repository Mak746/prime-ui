import { BaseEntity, CHANNEL, Channel, USER_ACCESS_STATUS, UserAccessStatus } from '@app/shared';
import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccessDeviceEntity } from './access-device.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_accesses' })
@Index((u: UserAccessEntity) => [u.accessChannel, u.userId, u.apiClientId], {
  unique: true,
  where: 'apiClientId IS NOT NULL',
})
export class UserAccessEntity extends BaseEntity {
  @Column({ type: 'enum', enum: CHANNEL, nullable: false })
  @Index()
  accessChannel: Channel;

  // credentials

  @Column({ nullable: true })
  clientName?: string;

  @Column({ nullable: true, length: 2048 })
  allowedUrls?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  apiClientId?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  deviceUuid?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  otpCode?: number;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  secretHash?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  tempSecretHash?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  emailActivationToken?: string;

  @Column({ nullable: true })
  firebaseToken?: string;

  // states:
  // REGISTERED -> OTP_SENT -> OTP_VERIFIED -> ACTIVE
  //////////////////////////////////////////////////////
  @Column({ type: 'enum', enum: USER_ACCESS_STATUS, default: 'PENDING', nullable: false })
  status: UserAccessStatus;

  // User
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.userAccesses, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  // User Devices
  @OneToMany(() => AccessDeviceEntity, (o: AccessDeviceEntity) => o.userAccess, {
    nullable: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  accessDevices: AccessDeviceEntity[];

  toDto() {
    return plainToClass(UserAccessEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserAccessEntity>) {
    super();
    return Object.assign(this, partial);
  }
}
/* 
import { createHash } from 'crypto';

function toBase64<T>(data: T): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

const data = {
  ua: 'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36',
  browser: { name: 'Chrome', version: '103.0.0.0', major: '103' },
  engine: { name: 'Blink', version: '103.0.0.0' },
  os: { name: 'Android', version: '12' },
  device: { vendor: 'Samsung', model: 'SM-G998B', type: 'mobile' },
  cpu: { architecture: undefined },
};

// console.log(toBase64(data));
//eyJ1YSI6Ik1vemlsbGEvNS4wIChMaW51eDsgQW5kcm9pZCAxMjsgU00tRzk5OEIpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMDMuMC4wLjAgTW9iaWxlIFNhZmFyaS81MzcuMzYiLCJicm93c2VyIjp7Im5hbWUiOiJDaHJvbWUiLCJ2ZXJzaW9uIjoiMTAzLjAuMC4wIiwibWFqb3IiOiIxMDMifSwiZW5naW5lIjp7Im5hbWUiOiJCbGluayIsInZlcnNpb24iOiIxMDMuMC4wLjAifSwib3MiOnsibmFtZSI6IkFuZHJvaWQiLCJ2ZXJzaW9uIjoiMTIifSwiZGV2aWNlIjp7InZlbmRvciI6IlNhbXN1bmciLCJtb2RlbCI6IlNNLUc5OThCIiwidHlwZSI6Im1vYmlsZSJ9LCJjcHUiOnt9fQ==
// len: 472
//========
console.log(createHash('sha256').update(JSON.stringify(data)).digest('base64'));
// nowUWJ2mdnvBuUQw1F9ycEsrbW9Ym/EANlzH0V7ByEo=
// len: 44
*/
