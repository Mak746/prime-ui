import { ADMIN_ROLE, KeysOf, Roles } from '@app/shared';
import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { CleantAccessPageOptionsDto } from '../../dtos';
import { ClientAccessService } from '../../services';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('manage/clients')
@Roles(...KeysOf(ADMIN_ROLE))
export class ManageClientAccessController {
  constructor(private clientAccessService: ClientAccessService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllClients(@Query(new ValidationPipe({ transform: true })) pageOptionsDto: CleantAccessPageOptionsDto) {
    try {
      const client = await this.clientAccessService.getClientAccesses(pageOptionsDto);
      return client;
    } catch (error) {
      throw new HttpException(error, error.statusCode || 500);
    }
  }

  // Get Clients With id - GET /clients/:id
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getClients(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const client = await this.clientAccessService.getClientAccessById({ id, userId: Number(req.user.uid) });
      return client;
    } catch (error) {
      throw new HttpException(error, error.statusCode || 500);
    }
  }
}
