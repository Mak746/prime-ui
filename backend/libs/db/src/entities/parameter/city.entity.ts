import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntity } from '../user';
import { CountryEntity } from './country.entity';
import { StateEntity } from './state.entity';

@Entity({ name: 'cities' })
export class CityEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  cityName: string;

  @Column({ type: Boolean, default: false })
  isActive: boolean;

  @ManyToOne(() => CountryEntity, (o: CountryEntity) => o.cities, { nullable: false })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country: CountryEntity;

  @Column({ name: 'country_id', nullable: false, unsigned: true })
  countryId: number;

  @ManyToOne(() => StateEntity, (o: StateEntity) => o.cities, { nullable: false })
  @JoinColumn({ name: 'state_id', referencedColumnName: 'id' })
  state: StateEntity;

  @Column({ name: 'state_id', nullable: false, unsigned: true })
  stateId: number;

  // userProfiles
  @OneToMany(() => UserProfileEntity, (o: UserProfileEntity) => o.city, { nullable: true })
  userProfiles?: UserProfileEntity[];
  // institutions

  toDto() {
    return plainToClass(CityEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<CityEntity>) {
    Object.assign(this, partial);
  }
}
