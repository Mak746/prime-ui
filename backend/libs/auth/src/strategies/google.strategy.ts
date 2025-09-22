import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserService, EUserSocialBuilder, RegisterEUserSocialDto } from '@app/user';
import { GlobalConfigService } from '@app/global-config';
import { IRequestInfo } from '@app/shared';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly globalConfigService: GlobalConfigService,
    private readonly createUserService: CreateUserService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: '/api/auth/oauth2/callback',
      callbackURL: '/api/web/auth/oauth2/telegram',
      passReqToCallback: true,
      scope: `profile email phone`,
      proxy: true,
    });
  }

  //If removed => passReqToCallback: true,
  // async validate( accessToken, refreshToken, profile) {
  //   console.log('validate: ....');
  //   console.log('\n', 'accessToken:', accessToken);
  //   console.log('\n', 'refreshToken:', refreshToken);
  //   console.log('\n', 'profile:', profile);
  //   // TODO: Validate or register the user locally
  //   return {
  //     userId: profile.id,
  //     name: profile.displayName,
  //     username: profile.emails[0].value,
  //     picture: profile.photos[0].value,
  //     roles: ['user'],
  //   };
  // }

  async validate(request: any, accessToken: string, refreshToken: string, profile, done: any) {
    try {
      console.log('validate', profile);
      // create user / validate and sign user token...
      const jwt: string = ''; //await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
      const user = {
        jwt,
      };
      // register / fetch user
      const device = this.globalConfigService.getUa(request);
      const requestInfo: IRequestInfo = { channel: 'WEB', ip: request?.ip, realm: 'CUSTOMER', device };

      const dto: RegisterEUserSocialDto = {
        fullName: profile.displayName,
        email: profile.emails[0].value,
        profilePic: profile.photos[0].value,
        registrationProvider: 'GOOGLE',
        socialProfileId: profile.id,
      };
      const builder = new EUserSocialBuilder(dto, requestInfo);
      const _user = await this.createUserService.createUser(builder);
      done(null, _user || user);
    } catch (err) {
      console.log('validate', err);
      done(err, false);
    }
  }
}
