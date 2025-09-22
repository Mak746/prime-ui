import { ADMIN_PREFIX, ActivityTitle, PATIENTS_PREFIX, Roles } from '@app/shared';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationPageOptionsDto } from '../../dtos';
import { CommonNotificationService, NotificationService } from '../../services';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('app/' + PATIENTS_PREFIX + 'notifications')
@Roles('PATIENT_USER')
export class AppPatientNotificationController {
  constructor(
    private notificationService: NotificationService,
    private commonNotificationService: CommonNotificationService,
  ) {}

  // Get Notifications Created by you - GET /notifications
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllNotifications(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: NotificationPageOptionsDto,
    @Req() req: Request,
  ) {
    pageOptionsDto.userId = req['user']['uid'];
    const notification = await this.notificationService.getNotifications(pageOptionsDto);
    return notification;
  }

  // Get Notifications With id - GET /notifications/:id
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getNotifications(@Param('id', ParseIntPipe) id: number) {
    const notification = await this.notificationService.getNotificationById(id);
    return notification;
  }
}
