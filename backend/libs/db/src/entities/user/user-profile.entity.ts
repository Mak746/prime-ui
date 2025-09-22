import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CityEntity, CountryEntity, StateEntity } from '../parameter';
import { UserEntity } from './user.entity';
import { GENDER_TYPE, GenderType } from '@app/shared';

@Entity({ name: 'user_profiles' })
export class UserProfileEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  nationalId?: string;

  @Column({ length: 1024, nullable: true })
  profilePic?: string;

  @Column({ length: 1024, nullable: true })
  address?: string;

  @Column({ type: 'enum', enum: GENDER_TYPE, default: 'NA' })
  gender: GenderType;

  // City
  @ManyToOne(() => CityEntity, (o: CityEntity) => o.userProfiles, { nullable: true })
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?: CityEntity;

  @Column({ name: 'city_id', nullable: true, unsigned: true })
  cityId?: number;

  // State
  @ManyToOne(() => StateEntity, (o: StateEntity) => o.userProfiles, { nullable: true })
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state?: StateEntity;

  @Column({ name: 'state_id', nullable: true, unsigned: true })
  stateId?: number;
  // Country
  @ManyToOne(() => CountryEntity, (o: CountryEntity) => o.userProfiles, { nullable: true })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country?: CountryEntity;

  @Column({ name: 'country_id', nullable: true, unsigned: true })
  countryId?: number;

  // USER
  @OneToOne(() => UserEntity, (user) => user.userProfile, { nullable: false })
  user: UserEntity;

  toDto() {
    return plainToClass(UserProfileEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserProfileEntity>) {
    return Object.assign(this, partial);
  }
}
