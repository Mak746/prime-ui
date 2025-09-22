import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import {
WebAuthController,
} from './controllers';

import { GlobalConfigModule } from '@app/global-config';
import { NotificationModule } from '@app/notification';
import { UserModule } from '@app/user';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  AuthCommonService,
  AuthHelperService,
  AuthWebService,
  ChangeOwnCredentialService,
  LoginHistoryService,
  LoginService,
  ResendOtpService,
  ResetUserPasswordService,
  ForgotCredentialService,
  SetCredentialService,
  SocialAuthService,
  TokenService,
  VerifyOTPService,
  UserProfileService,
} from './services';
import {  GooglePlusTokenStrategy, GoogleStrategy, JwtStrategy } from './strategies';
// import { TelegramModule } from '@app/telegram';
const providers = [
  AuthCommonService,
  AuthHelperService,
  AuthWebService,
  ChangeOwnCredentialService,
  LoginService,
  ResendOtpService,
  ResetUserPasswordService,
  SetCredentialService,
  TokenService,
  VerifyOTPService,
  LoginHistoryService,
  ForgotCredentialService,

  // user profile service
  UserProfileService,

  //social
  SocialAuthService,
  // strategies
  JwtStrategy,
  GooglePlusTokenStrategy,
  GoogleStrategy,
  // TelegramStrategy,
  // FacebookStrategy,
];
const controllers = [

  WebAuthController
];

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return { ...configService.get('jwt') };
      },
      inject: [ConfigService],
    }),
    forwardRef(() => NotificationModule),
    forwardRef(() => GlobalConfigModule),
    forwardRef(() => UserModule),
    // forwardRef(() => TelegramModule),
  ],
  providers,
  controllers,
  exports: providers,
})
export class AuthModule {}
