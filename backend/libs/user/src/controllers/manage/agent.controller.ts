import { Roles } from '@app/shared';
import { Controller } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('manage/agents')
@Roles('ADMIN', 'FINANCE', 'ACCOUNTS_MANAGER')
export class ManageAgentController {
  // constructor(
  //   private readonly globalConfigService: GlobalConfigService,
  //   private readonly listUsersService: ListUsersService,
  //   private readonly getUserService: GetUserService,
  //   private readonly notify: UserNotificationService,
  //   private readonly createUserService: CreateUserService,
  // ) {}
  // @Get('/')
  // @HttpCode(HttpStatus.OK)
  // async getUsers(@Query(new ValidationPipe({ transform: true })) dto: UserPageOptionsDto) {
  //   dto.realm = 'CUSTOMER';
  //   dto.role = 'AGENT';
  //   const user = await this.listUsersService.getUsersWebVersion(dto);
  //   return user;
  // }
  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // async getUser(@Param('id', ParseIntPipe) id: number) {
  //   const data = await this.getUserService.getBy({ id, role: 'AGENT' });
  //   return data;
  // }
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @UsePipes(ValidationPipe)
  // @Roles('ADMIN', 'ACCOUNTS_MANAGER')
  // @ActivityTitle('Register Agent')
  // @UploadProfilePic('agent')
  // async register(@UploadedFile() file: Express.Multer.File, @Body() dto: RegisterAgentDto, @Req() req, @Ip() ip) {
  //   try {
  //     const device = this.globalConfigService.getUa(req);
  //     const requestInfo: IRequestInfo = { channel: 'WEB', ip, realm: 'CUSTOMER', createdBy: +req.user.uid, device };
  //     const builder = new AgentBuilder({ ...dto, profilePic: file?.path }, requestInfo);
  //     const user = await this.createUserService.createUser(builder);
  //     const smsPayload = builder.getNotificationDetail(user.id);
  //     await this.notify.sendAuthSMS(smsPayload);
  //     await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     } else {
  //       throw new HttpException(error?.message || error, HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  // }
}
