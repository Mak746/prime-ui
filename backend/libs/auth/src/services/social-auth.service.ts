/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { IGoogleConfig } from '../interfaces';

export const googleConfig: IGoogleConfig = {
  login_dialog_uri: 'https://accounts.google.com/o/oauth2/auth',
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  oauth_redirect_uri: 'http://localhost/auth/login',
  access_token_uri: 'https://accounts.google.com/o/oauth2/token',
  response_type: 'code',
  scopes: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'],

  grant_type: 'authorization_code',
};


export const SERVER_CONFIG = {
  httpProtocol: 'http',
  domain: 'localhost',
  httpPort: 3000,
};
@Injectable()
export class SocialAuthService {
  private url: string;
  constructor(private readonly httpService: HttpService) {
    this.url = `${SERVER_CONFIG.httpProtocol}://${SERVER_CONFIG.domain}:${SERVER_CONFIG.httpPort}`;
  }

  async requestGoogleRedirectUri(): Promise<{ redirect_uri: string } | any> {
    const queryParams: string[] = [
      `client_id=${googleConfig.client_id}`,
      `redirect_uri=${googleConfig.oauth_redirect_uri}`,
      `response_type=${googleConfig.response_type}`,
      `scope=${googleConfig.scopes.join(' ')}`,
    ];
    const redirect_uri: string = `${googleConfig.login_dialog_uri}?${queryParams.join('&')}`;

    return {
      redirect_uri,
    };
  }
  async googleSignIn(code: string): Promise<AxiosResponse<any>> {
    const params = new URLSearchParams({
      code,
      client_id: googleConfig.client_id,
      client_secret: googleConfig.client_secret,
      redirect_uri: googleConfig.oauth_redirect_uri,
      grant_type: googleConfig.grant_type,
    });
    // const params = new URLSearchParams();
    // params.append('token', token);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const accessTokenUrl = googleConfig.access_token_uri;
    const tokenInfo = await firstValueFrom(this.httpService.post(accessTokenUrl, params.toString(), config));
    console.log('tokenInfo', tokenInfo);

    const { access_token } = tokenInfo.data;
    if (access_token) {
      const tokenInfo2 = await firstValueFrom(
        this.httpService.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`),
      );

      console.log('tokenInfo2', tokenInfo2);
    }
    return tokenInfo;
  }
}
