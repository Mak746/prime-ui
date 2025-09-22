import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, Req, ValidationPipe } from '@nestjs/common';
import { ActivityLogPageOptionsDto } from '../../dtos';

import { ADMIN_ROLE, KeysOf, Roles } from '@app/shared';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogService } from '../../services';

@ApiBearerAuth()
@Controller('manage/activity-logs')
@Roles(...KeysOf(ADMIN_ROLE))
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  // Get ActivityLogs Created by you - GET /activityLogs
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllActivityLogs(@Query(new ValidationPipe({ transform: true })) dto: ActivityLogPageOptionsDto, @Req() req) {
    const role = req.user?.role;
    if ('ADMIN' !== role) {
      dto.userId = +req.user?.uid;
    }
    const activityLog = await this.activityLogService.getActivityLogs(dto);
    return activityLog;
  }

  // Get ActivityLogs With id - GET /activityLogs/:id
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getActivityLogs(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const role = req.user?.role;
    const dto = { id };
    if ('ADMIN' !== role) {
      dto['userId'] = +req.user?.uid;
    }
    const activityLog = await this.activityLogService.getActivityLogById(dto);
    return activityLog;
  }
}
