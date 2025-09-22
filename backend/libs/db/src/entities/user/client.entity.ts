import { Exclude, plainToClass } from 'class-transformer';
import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'clients' })
export class ClientEntity {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column()
  name: string;

  @Column()
  allowedUrls: string;

  @Column({ nullable: true, length: 512 })
  signaturePrivate?: string;

  @Column({ nullable: true, length: 512 })
  signaturePublic?: string;

  @Column({ unique: true })
  @Exclude({ toPlainOnly: true })
  keyHash: string;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  // User
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.clients, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'user_id', nullable: false, unsigned: true })
  userId: number;

  toDto() {
    return plainToClass(ClientEntity, this);
  }
}
