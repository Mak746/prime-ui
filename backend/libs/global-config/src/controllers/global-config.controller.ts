import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AppConfigDto,
  AuthConfigDto,
  CreateGlobalConfigDto,
  GeneralConfigDto,
  NotificationConfigDto,
  UpdateGlobalConfigDto,
} from '../dto';

// import { ActivityTitle, Roles } from '../../../decorators';
import { ADMIN_PREFIX, Roles } from '@app/shared';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GlobalConfigService } from '../services';

@ApiBearerAuth()
@Controller(ADMIN_PREFIX + 'global-configs')
@Roles('ADMIN')
export class GlobalConfigController {
  constructor(private globalConfigService: GlobalConfigService) {}
  @Get('/')
  @HttpCode(HttpStatus.OK)
  // @Public()
  async getAllGlobalConfigs() {
    const globalConfig = await this.globalConfigService.getConfigs(); //await this.globalConfigService.getAllGlobalConfigs();
    return globalConfig;
  }

  // Get GlobalConfigs With id - GET /globalConfigs/:id
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getGlobalConfigs(@Param('id') id: string) {
    const globalConfig = await this.globalConfigService.getGlobalConfigById(id);
    return globalConfig;
  }

  // Create GlobalConfigs - POST /globalConfigs
  @Post('/general-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  // @ActivityTitle('Update General Config')
  async saveGeneralConfig(@Body() configDto: GeneralConfigDto) {
    const globalConfig = await this.globalConfigService.saveConfig<GeneralConfigDto>('general', configDto);
    return globalConfig;
  }
  @Post('/notification-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  // @ActivityTitle('Update Notification Config')
  async saveNotificationConfig(@Body() configDto: NotificationConfigDto) {
    const globalConfig = await this.globalConfigService.saveConfig<NotificationConfigDto>('notification', configDto);
    return globalConfig;
  }
  @Post('/auth-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  // @ActivityTitle('Update Authentication Config')
  async saveAuthConfig(@Body() configDto: AuthConfigDto) {
    const globalConfig = await this.globalConfigService.saveConfig<AuthConfigDto>('auth', configDto);
    return globalConfig;
  }

  // App configs
  @Post('/app-config')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async saveAppConfig(@Body() configDto: AppConfigDto) {
    const appConfig = await this.globalConfigService.saveConfig<AppConfigDto>('app', configDto);
    return appConfig;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  // @ActivityTitle('Create Config')
  async createGlobalConfigs(@Body() createGlobalConfigDto: CreateGlobalConfigDto) {
    const globalConfig = await this.globalConfigService.createGlobalConfig(createGlobalConfigDto);
    return globalConfig;
  }

  // Update GlobalConfigs - PUT /globalConfigs
  @Put('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  // @ActivityTitle('Update Config')
  async updateGlobalConfigs(@Param('id') id: string, @Body() updateGlobalConfigDto: UpdateGlobalConfigDto) {
    const globalConfig = await this.globalConfigService.updateGlobalConfig(updateGlobalConfigDto, id);
    return globalConfig;
  }
}
