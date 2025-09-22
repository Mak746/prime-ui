import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfileEntity } from '../user';
import { CityEntity } from './city.entity';
import { CountryEntity } from './country.entity';

@Entity({ name: 'states' })
export class StateEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  stateName: string;

  @Column({ type: Boolean })
  isActive: boolean;

  @ManyToOne(() => CountryEntity, (o: CountryEntity) => o.states, { nullable: false })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country: CountryEntity;

  @Column({ name: 'country_id', nullable: false, unsigned: true })
  countryId: number;

  // cities
  @OneToMany(() => CityEntity, (o: CityEntity) => o.state, { nullable: true })
  cities?: CityEntity[];

  // userProfiles
  @OneToMany(() => UserProfileEntity, (o: UserProfileEntity) => o.state, { nullable: true })
  userProfiles?: UserProfileEntity[];


  toDto() {
    return plainToClass(StateEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<StateEntity>) {
    Object.assign(this, partial);
  }
}
