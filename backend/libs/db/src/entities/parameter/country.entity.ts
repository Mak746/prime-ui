import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntity } from '../user';
import { CityEntity } from './city.entity';
import { StateEntity } from './state.entity';

@Entity({ name: 'countries' })
export class CountryEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  countryName: string;

  @Column()
  phonePrefix: string;

  @Column({ type: Boolean, default: false })
  isActive: boolean;

  // cities
  @OneToMany(() => CityEntity, (o: CityEntity) => o.country, { nullable: true })
  cities?: CityEntity[];

  // states
  @OneToMany(() => StateEntity, (o: StateEntity) => o.country, { nullable: true })
  states?: StateEntity[];

  // userProfiles
  @OneToMany(() => UserProfileEntity, (o: UserProfileEntity) => o.country, { nullable: true })
  userProfiles?: UserProfileEntity[];
  // institutions

  toDto() {
    return plainToClass(CountryEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<CountryEntity>) {
    Object.assign(this, partial);
  }
}
