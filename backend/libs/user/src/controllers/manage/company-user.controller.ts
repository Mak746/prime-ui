import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { GlobalConfigService } from '@app/global-config';
import { UserNotificationService } from '@app/notification';
import { ADMIN_ROLE, ActivityTitle, DetailResponse, IRequestInfo, Roles, UserStatus } from '@app/shared';
import {
  CreateUserService,
  GetUserService,
  ListUsersService,
  PhoneAndEmailValidationService,
  UpdateUserService,
} from '@app/user/services';
import {
  AdministrativeUserBuilder,
  PhoneEmailValidationDto,
  PhoneEmailValidationPayload,
  RegisterAdminStaffDto,
  UpdateUserDto,
  UpdateUserPayload,
  UserPageOptionsDto,
} from '../../dtos';

import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('manage/company-users')
@Roles('ADMIN', 'ACCOUNTS_MANAGER')
export class ManageCompanyUserController {
  constructor(
    private readonly globalConfigService: GlobalConfigService,
    private readonly listUsersService: ListUsersService,
    private readonly getUserService: GetUserService,
    private readonly createUserService: CreateUserService,
    private readonly notify: UserNotificationService,
    private readonly updateUserService: UpdateUserService,
    private readonly phoneAndEmailValidationService: PhoneAndEmailValidationService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query(new ValidationPipe({ transform: true })) pageOptionsDto: UserPageOptionsDto) {
    pageOptionsDto.realm = 'ADMIN';
    const result = await this.listUsersService.getUsersWebVersion(pageOptionsDto);
    return result;
  }

  @Get('/validate-registration')
  @HttpCode(HttpStatus.OK)
  async validateRegistration(@Query(new ValidationPipe({ transform: true })) dto: PhoneEmailValidationDto) {
    const payload = new PhoneEmailValidationPayload(dto);
    const result = await this.phoneAndEmailValidationService.validate(payload);
    return result;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getUserService.getBy({ id });
    return result;
  }

  // Company User Registration

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @ActivityTitle('Register Company User')
  async registerCompanyUser(@Body() dto: RegisterAdminStaffDto, @Req() req, @Ip() ip) {
    const device = this.globalConfigService.getUa(req);
    const requestInfo: IRequestInfo = { channel: 'WEB', ip, realm: 'ADMIN', createdBy: +req.user.uid, device };
    const builder = new AdministrativeUserBuilder(dto, requestInfo);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);

    return new DetailResponse();
  }
  @Put('me')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'BANK_API', 'RECON_API', 'FINANCE', 'ACCOUNTS_MANAGER')
  @ActivityTitle('Update Own Profile')
  async updateOwn(@Body() dto: UpdateUserDto, @Req() req, @Ip() ip) {
    const userId = Number(req.user.uid);
    const device = this.globalConfigService.getUa(req);
    const payload = new UpdateUserPayload(dto, userId, 'WEB', ip, userId, device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles('ADMIN')
  @ActivityTitle('Update Company User')
  async updateCompanyUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() req, @Ip() ip) {
    const userId = Number(req.user.uid);
    const device = this.globalConfigService.getUa(req);
    const payload = new UpdateUserPayload(dto, id, 'WEB', ip, userId, device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }

  @Put('activation-status/:id')
  @Roles(ADMIN_ROLE.ADMIN)
  async updateUserActivation(@Param('id', ParseIntPipe) id: number, @Body() status: UserStatus) {
    const _dto = { id };
    const { data } = await this.getUserService.getBy(_dto);
    if (!data) {
      throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
    }
    const result = await this.updateUserService.updateUserActivation(data);
    return result;
  }
}
