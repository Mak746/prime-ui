import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'banks' })
export class BankEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true })
  bankName: string;

  @Column({ type: Boolean, default: false })
  isActive: boolean;



  toDto() {
    return plainToClass(BankEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<BankEntity>) {
    Object.assign(this, partial);
  }
}
