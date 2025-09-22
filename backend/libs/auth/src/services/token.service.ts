import { UserEntity } from '@app/db';
import { GlobalConfigService } from '@app/global-config';
import { AuthConfigDto } from '@app/global-config/dto';
import { RedisService } from '@app/redis';
import { GetUserService } from '@app/user/services';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import Decimal from 'decimal.js';
import { AccessTokenPayload, AzpType, RefreshTokenPayload, TokensDto } from '../dtos';
import { ROLE } from '@app/shared';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserService: GetUserService,
    private readonly jwtService: JwtService,
    private readonly authRedisService: RedisService,
    private readonly globalConfigService: GlobalConfigService,
  ) {}

  // private issuer = this.configService.get('app').webApiUrl;

  public async signRefreshToken(user: UserEntity, azp: AzpType): Promise<string | undefined> {
    const conf = this.configService.get('jwtRefresh');
    const sysConf = (await this.globalConfigService.getConfigByKey<AuthConfigDto>('auth')) as AuthConfigDto;
    const EXP = sysConf ? sysConf.refreshTokenLifespan : 1209600;
    const NOW_SECONDS = Math.round(Number(new Date()) / 1000);

    const payload: RefreshTokenPayload = {
      sub: user?.idpId,
      role: user.role,
      realm: user.realm,
      exp: new Decimal(NOW_SECONDS).plus(EXP).toNumber(),
      iat: NOW_SECONDS,
      typ: 'Refresh',
      iss: this.configService.get('app').webApiUrl,
      azp,
    };

    const refToken = await this.jwtService.signAsync(payload, {
      // expiresIn: FOURTEEN_DAYS_IN_SEC,
      privateKey: conf.privateKey,
      algorithm: 'ES256',
      keyid: '354e8056-9727-407c-9a97-1dfea271d22',
    });
    // await this.authRedisService.putValue<typeof refToken>(`${payload.sub}_${payload.azp}`, refToken, EXP);
    await this.authRedisService.saveToken(`${payload.sub}_${payload.azp}`, refToken, EXP);
    return refToken;
  }

  public async signAccessToken(user: UserEntity, azp: AzpType): Promise<string | undefined> {
    const NOW_SECONDS = Math.round(Number(new Date()) / 1000);
    const conf = this.configService.get('jwt');
    const _sysConf = await this.globalConfigService.getConfigByKey<AuthConfigDto>('auth');
    const sysConf = plainToInstance(AuthConfigDto, _sysConf as object, {
      enableImplicitConversion: true,
    });
    console.log('sysConf..', sysConf, typeof sysConf);
    const EXP = sysConf ? sysConf['accessTokenLifespan'] : 3600;
    console.log('exp..', EXP);
    console.log('NOW_SECONDS..', NOW_SECONDS);
    const exp = new Decimal(NOW_SECONDS).plus(3600).toNumber();
    const payload: AccessTokenPayload = {
      sub: user?.idpId,
      name: user?.username,
      phone: user.phone,
      email: user.email,
      uid: user.id,
      pcid: user?.parentUserId,
      role: user.role,
      realm: user.realm,
      exp,
      iat: NOW_SECONDS,
      typ: 'Bearer',
      iss: this.configService.get('app').webApiUrl,
      azp,
    };

    // add professional id to access token if user is professional user
    if (user.role === ROLE.PROFESSIONAL_USER) {
      // payload.professionalId = user.professionalId;
    } else if (user.role == ROLE.INSTITUTION_USER) {
      // add institution user details to access token if user is institution user
      // payload.institutionUserId = user.institutionUser.id;
      // payload.institutionId = user.institutionUser.institution.id;
      // payload.institutionRole = user.institutionUsers[0].role;
      // payload.institutionId = user.institutionUsers[0].institutionId;
      //payload.institutionUserId = user.institutionUsers[0].id;
    } else if (user.role == ROLE.PATIENT_USER) {
      // payload.patientId = user.patientId;
    }

    return this.jwtService.signAsync(payload, {
      privateKey: conf.privateKey.replace(/\\n/g, '\n'),
      algorithm: 'ES256',
      keyid: 'fec6c706-bd06-4172-a405-a1fef21f070a',
    });
  }
  public async createTokenPair(user: UserEntity, azp: AzpType): Promise<TokensDto | undefined> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user, azp),
      this.signRefreshToken(user, azp),
    ]);
    Logger.log({
      message: '[accessToken, refreshToken]',
      meta: { access_token: accessToken, refresh_token: refreshToken },
      context: TokenService.name,
    });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async verifyAccessToken(accessToken: string): Promise<AccessTokenPayload | undefined> {
    try {
      if (!accessToken) {
        return;
      }
      const conf = this.configService.get('jwt');
      const result = await this.jwtService.verifyAsync<AccessTokenPayload>(accessToken, {
        publicKey: conf.publicKey.replace(/\\n/g, '\n'),
        algorithms: ['ES256'],
        ignoreExpiration: false,
      });
      return result;
    } catch (error) {
      Logger.error({ message: `verifyAccessToken failed`, stack: error, context: TokenService.name });
      return;
    }
  }

  public async decodeRefreshToken(refreshToken: string): Promise<RefreshTokenPayload | undefined> {
    const refPayload: RefreshTokenPayload = (await this.jwtService.decode(refreshToken, {
      json: true,
    })) as RefreshTokenPayload;

    return refPayload;
  }
  public async validRefreshToken(refreshToken: string, azp: AzpType): Promise<TokensDto | undefined> {
    const refPayload: RefreshTokenPayload = await this.decodeRefreshToken(refreshToken);

    if (!refPayload) {
      // trhow error...
      Logger.error({
        message: `Invalid or expired refresh token provided`,
        stack: { refPayload, azp, refreshToken },
        context: TokenService.name,
      });

      throw new HttpException(`Invalid or expired refresh token provided.`, HttpStatus.UNAUTHORIZED);
    }

    const refTokenKey = `${refPayload.sub}_${azp}`;
    Logger.log({ message: 'refreshToken', meta: refreshToken, context: TokenService.name });
    Logger.log({ message: 'refTokenKey', meta: refTokenKey, context: TokenService.name });

    const data = await this.authRedisService.getToken(refTokenKey);
    Logger.log({ message: '{ data }', meta: { data }, context: TokenService.name });
    const refresh_token = data;
    Logger.log({ message: 'refresh_token', meta: refresh_token, context: TokenService.name });
    if (!refresh_token || refresh_token !== refreshToken) {
      // trhow error...
      Logger.error({
        message: `Invalid or expired refresh token provided`,
        stack: { refPayload, azp, refreshToken },
        context: TokenService.name,
      });
      throw new HttpException(`Invalid or expired refresh token provided.`, HttpStatus.UNAUTHORIZED);
    }
    const user = await this.getUserService.getBy({ idpId: refPayload?.sub });
    return this.createTokenPair(user.data, azp);
  }
  public async logoutRefreshToken(refreshToken: string, azp: AzpType): Promise<void | undefined> {
    const refPayload: RefreshTokenPayload = (await this.jwtService.decode(refreshToken, {
      json: true,
    })) as RefreshTokenPayload;

    if (!refPayload) {
      // trhow error...
      Logger.error({
        message: `Invalid or expired refresh token provided`,
        stack: { refPayload, azp, refreshToken },
        context: TokenService.name,
      });
      throw new HttpException(`Invalid or expired refresh token provided.`, HttpStatus.UNAUTHORIZED);
    }
    const refTokenKey = `${refPayload.sub}_${azp}`;
    await this.authRedisService.deleteEntry(refTokenKey);

    return;
  }
}
