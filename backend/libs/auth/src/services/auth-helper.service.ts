import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AzpType } from '../dtos';
import { TokenService } from './token.service';
import { Realm } from '@app/shared';

@Injectable()
export class AuthHelperService {
  private serverDns;
  private WEB_ACCESS_ADMIN_ORIGINS = [];
  private WEB_ACCESS_CUSTOMER_ORIGINS = [];
  private WEB_ACCESS_ORIGINS = [];
  constructor(
    private readonly tokenService: TokenService,
    private readonly conf: ConfigService,
  ) {
    this.serverDns = this.conf.get('app').serverDns;
    const isDevelopmentEnv = this.conf.get('NODE_ENV') === 'development';
    // consider admin access for testing
    const uatDomains = ['', 'admin.', 'inst.', 'patients.'].map((sdomain) => `https://${sdomain}${this.serverDns}`);
    const localDomains = ['', ':4200', ':4201', ':4202', ':4203', '3000'].map((port) => `http://localhost${port}`);
    //
    this.WEB_ACCESS_ADMIN_ORIGINS = isDevelopmentEnv
      ? [...localDomains, 'http://localhost:3000']
      : [...uatDomains, ...localDomains, undefined, 'http://localhost:3000'];

    this.WEB_ACCESS_CUSTOMER_ORIGINS = isDevelopmentEnv
      ? [
          'http://localhost:8081',
          'http://localhost:4201',
          'http://127.0.0.1:4201',
          'http://localhost:4242',
          'http://localhost:4204',
        ]
      : [`https://${this.serverDns}`, 'https://doctors.eand.et'];
    this.WEB_ACCESS_ORIGINS = [
      ...this.WEB_ACCESS_ADMIN_ORIGINS,
      ...this.WEB_ACCESS_CUSTOMER_ORIGINS,
      undefined,
      'http://localhost:3000',
    ];
  }

  public async getRefreshTokenCookie(refreshToken: string, req: Request) {
    const { exp } = await this.tokenService.decodeRefreshToken(refreshToken);
    // const baseURL = req.protocol + '://' + req.headers.host + '/';
    // const baseURL = req.protocol + '://' + req.headers.host + '/';
    const baseURL = req.protocol + '://' + req.headers.origin + '/';
    console.log('baseURL', baseURL);
    console.log('req.headers.host', req.headers.host);
    console.log('req.headers.origin', req.headers.origin);
    const parsedURL = new URL(req.url, baseURL);
    // const domain = '.eand.et'; // parsedURL.hostname;
    const secure = parsedURL.protocol === 'https:';
    const expires = new Date(0).setUTCSeconds(exp);
    return `ref_token=${refreshToken}; expires='${expires}'; httpOnly=true; signed:true; Secure=${secure}; SameSite=None;`;
    // return `ref_token=${refreshToken}; expires='${expires}'; httpOnly=true; Secure=${secure}; SameSite=Lax; domain=${domain}; path=/`;
  }

  public getLogoutRefreshTokenCookie(req: Request) {
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const parsedURL = new URL(req.url, baseURL);
    // const domain = parsedURL.hostname;
    const secure = parsedURL.protocol === 'https:';
    const expires = new Date(0).setUTCSeconds(0);

    // res?.clearCookie('ref_token', { signed: true, httpOnly: true, sameSite: 'none', secure });

    return `ref_token=''; expires='${expires}'; httpOnly=true; signed:true; Secure=${secure}; SameSite=None;`;
    // return `ref_token=''; expires='${expires}'; httpOnly=true; Secure=${secure}; SameSite=Lax; domain=${domain}; path=/`;
  }
  public isWebAccess(req: Request) {
    const origin = req.headers.origin;
    return origin && (this.WEB_ACCESS_ORIGINS.includes(origin) || origin.includes('.ngrok-free.app'));
  }

  public getAccessRealm(req: Request) {
    if (req.header('realm')) {
      return req.header('realm') as Realm;
    }
    const origin = req.headers.origin;
    return this.WEB_ACCESS_ADMIN_ORIGINS.includes(origin) ? 'ADMIN' : 'CUSTOMER';
  }
  public getAccessChannel(req: Request) {
    return this.isWebAccess(req) ? 'WEB' : 'APP';
  }
  public validateChannel(req: Request, channel: 'WEB' | 'APP') {
    if (req.headers['user-agent'].indexOf('PostmanRuntime') != -1) {
      return true;
    }
    const origin = req.headers.origin;
    if ((channel !== 'WEB' && this.isWebAccess(req)) || (channel !== 'APP' && !this.isWebAccess(req))) {
      throw new UnauthorizedException(`The value '${origin}' is not a valid ${channel} request origin`);
    }
  }
  public getAzp(req: Request) {
    const origin = req.headers.origin;
    let azp: AzpType;
    if (this.isWebAccess(req)) {
      azp = this.WEB_ACCESS_ADMIN_ORIGINS.includes(origin) ? 'wc-manager-web' : 'wc-customer-web';
    } else {
      azp = 'wc-customer-app';
    }
    return azp;
  }
}
