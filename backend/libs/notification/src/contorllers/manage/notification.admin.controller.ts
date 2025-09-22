import { ADMIN_PREFIX, ActivityTitle, Roles } from '@app/shared';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NotificationPageOptionsDto } from '../../dtos';
import { CommonNotificationService, NotificationService } from '../../services';

@ApiBearerAuth()
@Controller(ADMIN_PREFIX + 'notifications')
@Roles('ADMIN')
export class ManageNotificationController {
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
  ) {
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

  // Retry Notification - PUT /operators
  @Put('sms/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ActivityTitle('Retry SMS Notification')
  @UsePipes(ValidationPipe)
  async retrySms(@Param('id', ParseIntPipe) id: number) {
    const data = await this.commonNotificationService.retrySendingSMS(id);
    return data;
  }
}
