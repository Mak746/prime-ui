import { CUSTOMER_ROLE, KeysOf, Roles } from '@app/shared';
import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, Req, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLogPageOptionsDto } from '../dtos';
import { ActivityLogService } from '../services';
@Roles(...KeysOf(CUSTOMER_ROLE))
@ApiBearerAuth()
@Controller('web/activity-logs')
export class WebActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  // Get ActivityLogs Created by you - GET /activityLogs
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllActivityLogs(@Query(new ValidationPipe({ transform: true })) dto: ActivityLogPageOptionsDto, @Req() req) {
    dto.userId = +req.user?.uid;
    const data = await this.activityLogService.getActivityLogs(dto);
    return data;
  }
  @Get('/users/:childUserId')
  @HttpCode(HttpStatus.OK)
  async getActivityLogsOfUser(
    @Param('childUserId', ParseIntPipe) childUserId: number,
    @Query(new ValidationPipe({ transform: true })) dto: ActivityLogPageOptionsDto,
    @Req() req,
  ) {
    dto.userId = childUserId;
    dto.parentUserId = +req.user?.uid;
    const data = await this.activityLogService.getActivityLogs(dto);
    return data;
  }

  @Get('/:id/users/:childUserId')
  @HttpCode(HttpStatus.OK)
  async getActivityLogOfChildUser(
    @Param('childUserId', ParseIntPipe) childUserId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ) {
    const dto = { id, parentUserId: +req.user?.uid, userId: childUserId };
    const data = await this.activityLogService.getActivityLogById(dto);
    return data;
  }

  // Get ActivityLogs With id - GET /activityLogs/:id
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getActivityLogs(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const dto = { id, userId: +req.user?.uid };
    const data = await this.activityLogService.getActivityLogById(dto);
    return data;
  }
}
