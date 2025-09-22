import { UserProfileEntity } from '@app/db';
export interface IUserProfileOpts {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nationalId?: string;
  profilePic?: string;
  cityId?: number;
  stateId?: number;
  countryId?: number;
}
export class UserProfileBuilder {
  private profile: UserProfileEntity;

  constructor(opts: IUserProfileOpts) {
    // defaults...
    this.profile = new UserProfileEntity({ ...opts });
  }

  build(): UserProfileEntity {
    return this.profile;
  }
}
