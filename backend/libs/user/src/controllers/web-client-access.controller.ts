import { Roles } from '@app/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CleantAccessPageOptionsDto, CreateClientAccessDto, UpdateClientAccessDto } from '../dtos';
import { ClientAccessService } from '../services';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('web/clients')
@Roles('MERCHANT', 'AGENT')
export class ClientController {
  constructor(private clientAccessService: ClientAccessService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllClients(
    @Query(new ValidationPipe({ transform: true })) pageOptionsDto: CleantAccessPageOptionsDto,
    @Req() req,
  ) {
    try {
      pageOptionsDto.userId = Number(req.user.uid);
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

  // Create Clients - POST /clients
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async createClients(@Body() dto: CreateClientAccessDto, @Req() req) {
    try {
      const userId = Number(req.user.uid);

      const client = await this.clientAccessService.createClientAccess({ ...dto, userId });
      return client;
    } catch (error) {
      throw new HttpException(error, error.statusCode || 500);
    }
  }
  // Update Clients - PUT /clients
  @Put('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  async updateClients(@Param('id', ParseIntPipe) id: number, @Req() req, @Body() dto: UpdateClientAccessDto) {
    try {
      const client = await this.clientAccessService.updateClientAccess({ ...dto, userId: Number(req.user.uid) }, id);
      return client;
    } catch (error) {
      throw new HttpException(error, error.statusCode || 500);
    }
  }
}
