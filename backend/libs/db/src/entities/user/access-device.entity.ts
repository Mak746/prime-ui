import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoginHistoryEntity } from './login-history.entity';
import { UserAccessEntity } from './user-access.entity';

@Entity({ name: 'access_devices' })
@Index((u: AccessDeviceEntity) => [u.deviceHash, u.userAccessId], { unique: true })
export class AccessDeviceEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  // device info

  @Column({ nullable: true })
  ua?: string;

  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  engine?: string;

  @Column({ nullable: true })
  os?: string;

  @Column({ nullable: true })
  device?: string;

  @Column({ nullable: true })
  cpu?: string;

  // Additional
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  deviceHash?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedDate?: Date;

  // User Aess
  @ManyToOne(() => UserAccessEntity, (o: UserAccessEntity) => o.accessDevices, { nullable: false })
  @JoinColumn({ name: 'user_access_id', referencedColumnName: 'id' })
  userAccess: UserAccessEntity;

  @Column({ name: 'user_access_id', nullable: false, unsigned: true })
  userAccessId: number;

  // loginHistories
  @OneToMany(() => LoginHistoryEntity, (o: LoginHistoryEntity) => o.accessDevice, { nullable: true })
  loginHistories?: LoginHistoryEntity[];

  toDto() {
    return plainToClass(AccessDeviceEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<AccessDeviceEntity>) {
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
