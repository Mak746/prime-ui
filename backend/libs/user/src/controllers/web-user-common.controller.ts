import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Put,
  Req,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateUserDto, UpdateUserPayload } from '../dtos';

import { GlobalConfigService } from '@app/global-config';
import { ActivityTitle, KeysOf, ROLE, Roles, UploadProfilePic } from '@app/shared';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUserService, UpdateUserService } from '../services';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('web/user')
@Roles(...KeysOf(ROLE))
export class WebUserCommonController {
  constructor(
    private readonly globalConfigService: GlobalConfigService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @Put('update-profile-pic/me')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Own Profile Pic')
  @UploadProfilePic('customer-own')
  async updateProfilePic(@UploadedFile() file: Express.Multer.File, @Req() req, @Ip() ip) {
    const id = +req.user?.uid;
    const _dto = { id };
    const { data } = await this.getUserService.getBy(_dto);
    if (!data) {
      throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
    }
    const userId = Number(req.user.uid);
    const device = this.globalConfigService.getUa(req);
    const profilePic = file?.path;
    const payload = new UpdateUserPayload({ profilePic }, id, 'WEB', ip, userId, device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }
  @Put('me')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @ActivityTitle('Update Own Profile')
  async updateOwnProfile(@Body() dto: UpdateUserDto, @Req() req, @Ip() ip) {
    const id = +req.user?.uid;
    const _dto = { id };
    const { data } = await this.getUserService.getBy(_dto);
    if (!data) {
      throw new HttpException('Unavailable or Forbidden resource access', HttpStatus.FORBIDDEN);
    }
    const userId = Number(req.user.uid);
    const device = this.globalConfigService.getUa(req);
    const payload = new UpdateUserPayload(dto, id, 'WEB', ip, userId, device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  } 
}
