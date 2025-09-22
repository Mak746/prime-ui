/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import GoogleTokenStrategy from 'passport-google-plus-token';

@Injectable()
export class GooglePlusTokenStrategy extends PassportStrategy(GoogleTokenStrategy, 'google-plus-token') {
  constructor(private readonly configService: ConfigService) {
    super(configService.get('google'));
    console.log('------------------');
    console.log('Strategy Initialized: ', configService.get('google'));
    console.log('------------------');
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { name, email, picture } = profile._json;
    const user = {
      email,
      firstName: name.givenName,
      lastName: name.familyName,
      picture,
      accessToken,
    };
    done(null, user);
  }
}
