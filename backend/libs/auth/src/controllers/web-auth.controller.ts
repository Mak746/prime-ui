import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Logger,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AuthCommonService,
  AuthHelperService,
  ChangeOwnCredentialService,
  ForgotCredentialService,
  LoginService,
  ResendOtpService,
  ResetUserPasswordService,
  SetCredentialService,
  TokenService,
  UserProfileService,
  VerifyOTPService,
} from '../services';

import { UserEntity } from '@app/db';
import { GlobalConfigService } from '@app/global-config';
import { UserNotificationService } from '@app/notification';
import { ActivityTitle, DetailResponse, IRequestInfo, KeysOf, Public, ROLE, Roles } from '@app/shared';
import {
  CustomerFactory,
  PhoneEmailValidationDto,
  PhoneEmailValidationPayload,
  RegisterPatientUserDto,
} from '@app/user';
import { CreateUserService, GetUserService, PhoneAndEmailValidationService } from '@app/user/services';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import {
  AzpType,
  ChangeOwnCredentialPayload,
  ChangeOwnPasswordDto,
  ForgotCredentialDto,
  ForgotCredentialPayload,
  LoginPayload,
  PasswordLoginDto,
  RefreshTokenDto,
  ResendOtpDto,
  ResendOtpPayload,
  ResetWebLoginDto,
  ResetWebLoginPayload,
  SetCredentialPayload,
  SetPasswordDto,
  VerifyOtpDto,
  VerifyOtpPayload,
} from '../dtos';
import { AppThrottlerGuard } from '../guards';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { join } from 'path';
import { CreateUserProfileDto } from '../dtos/user-profile.dto';

@ApiBearerAuth()
@Controller('web/auth')
export class WebAuthController {
  private serverDns;
  constructor(
    private readonly conf: ConfigService,
    private readonly resendOtpService: ResendOtpService,
    private readonly helper: AuthHelperService,
    private readonly globalConfigService: GlobalConfigService,
    private readonly authCommonService: AuthCommonService,
    private readonly verifyOTPService: VerifyOTPService,
    private readonly getUserService: GetUserService,
    private readonly tokenService: TokenService,
    private readonly loginService: LoginService,
    private readonly setCredentialService: SetCredentialService,
    private readonly changeOwnCredentialService: ChangeOwnCredentialService,
    private readonly resetUserPasswordService: ResetUserPasswordService,
    private readonly forgotCredentialService: ForgotCredentialService,
    private readonly notify: UserNotificationService,
    private readonly createUserService: CreateUserService,
    private readonly phoneAndEmailValidationService: PhoneAndEmailValidationService,
    private readonly userProfileService: UserProfileService,
  ) {
    this.serverDns = this.conf.get('app').serverDns;
  }

  // User Profile
  @Get('profile')
  @Roles(...KeysOf(ROLE))
  async getMyProfile(@Req() req) {
    const data = await this.getUserService.getBy({ id: Number(req.user.uid) });
    return data;
  }

  @Get('profile/:id')
  async find(@Param('id', ParseIntPipe) id: number) {
    const professional = await this.getUserService.findById({ id });
    return professional;
  }

  @Get('/validate-registration')
  @HttpCode(HttpStatus.OK)
  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // limit of 10, and ttl of 600 seconds
  @UseGuards(AppThrottlerGuard)
  async validateRegistration(@Query(new ValidationPipe({ transform: true })) dto: PhoneEmailValidationDto) {
    const payload = new PhoneEmailValidationPayload(dto);
    const result = await this.phoneAndEmailValidationService.validate(payload);
    return result;
  }

  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: join('images', 'users', 'profile-pictures'),
        filename: (req, file, cb) => {
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
    }),
  )
  @Put('self_change_profile_picture')
  async updateSelfProfilePicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpg|jpeg|png|gif)',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    profile_picture: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['user']['uid'];

    // profile

    const profile = await this.userProfileService.updateUserProfilePicture(
      userId,
      profile_picture ? join('images', 'users', 'profile-pictures', profile_picture.filename) : null,
    );
    return profile;
    //return this.userProfileService.create(body);
  }

  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: join('images', 'users', 'profile-pictures'),
        filename: (req, file, cb) => {
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
    }),
  )
  @Put('change_profile_picture')
  async updateProfilePicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpg|jpeg|png|gif)',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    profile_picture: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['user']['uid'];

    // profile

    const profile = await this.userProfileService.updateUserProfilePicture(
      userId,
      profile_picture ? join('images', 'users', 'profile-pictures', profile_picture.filename) : null,
    );
    return profile;
    //return this.userProfileService.create(body);
  }

  @UseInterceptors(
    FileInterceptor('profile_picture', {
      storage: diskStorage({
        destination: join('images', 'users', 'profile-pictures'),
        filename: (req, file, cb) => {
          cb(null, `${new Date().getTime()}-${file.originalname}`);
        },
      }),
    }),
  )
  @Put('profile')
  async update(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpg|jpeg|png|gif)',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    profile_picture: Express.Multer.File,
    @Body() body: CreateUserProfileDto,
    @Req() req: Request,
  ) {
    const userId = req['user']['uid'];

    // profile

    const profile = await this.userProfileService.updateUserProfile(
      userId,
      profile_picture
        ? join('images', 'users', 'profile-pictures', profile_picture.filename)
        : body.profilePic
          ? body.profilePic
          : null,
      body,
    );
    return profile;
    //return this.userProfileService.create(body);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @ActivityTitle('End user self register')
  async selfRegister(@Body() dto: RegisterPatientUserDto, @Req() req, @Ip() ip) {
    const device = this.globalConfigService.getUa(req);
    const requestInfo: IRequestInfo = { channel: 'WEB', ip, realm: 'CUSTOMER', device };

    const builder = CustomerFactory.get({ ...dto, role: 'PATIENT_USER' }, requestInfo);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
    return new DetailResponse(smsPayload.otpCode);
  }

  // Web Login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @UsePipes(ValidationPipe)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  async login(@Body() dto: PasswordLoginDto, @Req() req, @Ip() ip, @Res({ passthrough: true }) res: Response) {
    const isWebAccess = this.helper.isWebAccess(req);
    this.helper.validateChannel(req, 'WEB');
    Logger.log({ message: 'realm' });
    const device = this.globalConfigService.getUa(req);
    // const realm = this.helper.getAccessRealm(req);
    const realm = 'CUSTOMER';
    const payload = new LoginPayload(dto, { channel: 'WEB', ip, realm, device });
    const result = await this.loginService.login(payload);
    if (result && result.success) {
      const azp: AzpType = 'wc-customer-web';
      const { refresh_token, ...resp } = await this.tokenService.createTokenPair(
        result.data['user'] as UserEntity,
        azp,
      );

      if (refresh_token) {
        if (isWebAccess) {
          const refresh_cookie = await this.helper.getRefreshTokenCookie(refresh_token, req);
          res.setHeader('set-cookie', refresh_cookie);
        }
      }
      return {
        ...resp,
        refresh_token: isWebAccess ? null : refresh_token,
        success: true,
        statusCode: 200,
        message: 'Login Successful',
      };
    }
    return result;
  }

  // WEB - Verify OTP Code
  @Post('verify-otp')
  @Public()
  @UsePipes(ValidationPipe)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  async verifyUserOtp(@Body() dto: VerifyOtpDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const payload = new VerifyOtpPayload(dto, { channel: 'WEB', ip, realm, device });
    const result = await this.verifyOTPService.verify(payload);
    return result;
  }

  // Set Password
  @Post('set-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async setUserPassword(@Body() dto: SetPasswordDto, @Req() req, @Ip() ip, @Res({ passthrough: true }) res: Response) {
    // this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);

    const payload = new SetCredentialPayload(dto, { channel: 'WEB', ip, realm, device });
    const { data, ...msgResponse } = await this.setCredentialService.setCredential(payload);

    if (data && msgResponse.success) {
      const azp: AzpType = realm && realm === 'ADMIN' ? 'wc-manager-web' : 'wc-customer-web';
      const { refresh_token, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refresh_token) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refresh_token, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'OK' };
    }
    return msgResponse;
  }

  // Change Own Password
  @Post('change-my-password')
  @Roles(...KeysOf(ROLE))
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Change own Password')
  async changeMyPassword(
    @Body() dto: ChangeOwnPasswordDto,
    @Req() req,
    @Ip() ip,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const userId = Number(req.user.uid);
    const payload = new ChangeOwnCredentialPayload(dto, { channel: 'WEB', ip, realm, device, createdBy: userId });
    const { data, ...msgResponse } = await this.changeOwnCredentialService.change(payload);

    if (data && msgResponse.success) {
      const azp: AzpType = realm && realm === 'ADMIN' ? 'wc-manager-web' : 'wc-customer-web';
      const { refresh_token, ...resp } = await this.tokenService.createTokenPair(data, azp);

      if (refresh_token) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(refresh_token, req);
        res.setHeader('set-cookie', refresh_cookie);
      }
      return { ...resp, success: true, statusCode: 200, message: 'OK' };
    }
    return msgResponse;
  }

  // Admin reset Password
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @Roles(...KeysOf(ROLE))
  @ActivityTitle('Reset User Password')
  async resetUserPassword(@Body() dto: ResetWebLoginDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const payload = new ResetWebLoginPayload(dto, { channel: 'WEB', ip, realm, device });

    const result = await this.resetUserPasswordService.reset(payload);
    return result;
  }

  // Resend OTP Code
  @Post('resend-otp')
  @Public()
  @Throttle({ default: { limit: 1, ttl: 20000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async resendUserOtp(@Body() dto: ResendOtpDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const payload = new ResendOtpPayload(dto, { channel: 'WEB', ip, realm, device });
    const result = await this.resendOtpService.resend(payload);
    return result;
  }

  // FORGOT Password
  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() dto: ForgotCredentialDto, @Req() req, @Ip() ip) {
    this.helper.validateChannel(req, 'WEB');
    const realm = this.helper.getAccessRealm(req);
    const device = this.globalConfigService.getUa(req);
    const payload = new ForgotCredentialPayload(dto, { channel: 'WEB', ip, realm, device });

    const result = await this.forgotCredentialService.resent(payload);
    return result;

    //const isloadtest = req.headers.isloadtest;
    //const origin = isloadtest ? `https://manage.${this.serverDns}` : req.headers.origin;
    //if (!this.helper.isWebAccess(req) && !isloadtest) {
    //throw new UnauthorizedException(`The value '${origin}' is not a valid web login request origin`);
    //}
    //const realm = isloadtest ? 'ADMIN' : this.helper.getAccessRealm(req);
    //const userAgent = this.globalConfigService.getUa(req);
    //const deviceUuid = forgotPassword.deviceUuid ? forgotPassword.deviceUuid : origin;
    //const response = await this.forgotCredentialService.forgotCredential({
    //...forgotPassword,
    //deviceUuid,
    //realm,
    //userAgent,
    //accessChannel: 'WEB',
    //});
    //return response;
    //} catch (error) {
    //throw new HttpException(error, error.statusCode || 500);
    //}
  }

  // Refresh Access Token
  @Post('refresh')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async refresh(@Body() refreshDto: RefreshTokenDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      // const isWebAccess = this.helper.isWebAccess(req);
      const isWebAccess = true;

      const origin = req.headers.origin;
      if (!isWebAccess) {
        throw new UnauthorizedException(`The value '${origin}' is not a valid web request origin`);
      }

      // const azp: AzpType = this.helper.getAzp(req);
      const azp: AzpType = 'wc-customer-web';
      refreshDto.refreshToken = isWebAccess ? req.cookies?.ref_token : refreshDto.refreshToken;
      Logger.log({ message: 'refreshDto', meta: refreshDto, context: WebAuthController.name });
      refreshDto.refreshToken = req.cookies?.ref_token;
      Logger.log({ message: 'req.cookies.ref_token', meta: req.cookies?.ref_token, context: WebAuthController.name });

      const result = await this.authCommonService.refreshAccessToken(refreshDto, azp);

      Logger.log({ message: 'result', meta: result, context: WebAuthController.name });
      const { refresh_token, ...resp } = result;
      if (isWebAccess && result?.refresh_token) {
        const refresh_cookie = await this.helper.getRefreshTokenCookie(result.refresh_token, req);
        res.setHeader('set-cookie', refresh_cookie);
        Logger.log({
          message: `{ ...resp, success: true, statusCode: 200, message: 'OK' }`,
          meta: { ...resp, success: true, statusCode: 200, message: 'OK' },
          context: WebAuthController.name,
        });

        return { ...resp, success: true, statusCode: 200, message: 'OK' };
      }
      Logger.log({ message: 'should not reach here....', meta: {}, context: WebAuthController.name });
      return { ...resp, refresh_token, success: true, statusCode: 200, message: 'OK' };
    } catch (error) {
      const refresh_cookie = this.helper.getLogoutRefreshTokenCookie(req);

      res.setHeader('set-cookie', refresh_cookie);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // Logout
  @Post('logout')
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AppThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async logout(@Body() refreshDto: RefreshTokenDto, @Req() req, @Res({ passthrough: true }) res: Response) {
    let refresh_cookie;
    try {
      const isWebAccess = true;
      // const isWebAccess = this.helper.isWebAccess(req);
      // const origin = req.headers.origin;
      // if (!isWebAccess) {
      //   throw new UnauthorizedException(`The value '${origin}' is not a valid web request origin`);
      // }
      const azp: AzpType = 'wc-customer-web';

      refreshDto.refreshToken = isWebAccess ? req.cookies?.ref_token : refreshDto.refreshToken;
      const result = await this.authCommonService.logoutRefreshToken(refreshDto, azp);
      refresh_cookie = this.helper.getLogoutRefreshTokenCookie(req);

      res.setHeader('set-cookie', refresh_cookie);
      return result;
    } catch (error) {
      res.setHeader('set-cookie', refresh_cookie);

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
