import { GlobalConfigService } from '@app/global-config';
import { UserNotificationService } from '@app/notification';
// import { CreateProductPriceDto } from '@app/product/dtos';
import { ADMIN_ROLE, ActivityTitle, IRequestInfo, KeysOf, Roles, UploadProfilePic } from '@app/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CustomerFactory,
  PhoneEmailValidationDto,
  PhoneEmailValidationPayload,
  RegisterCustomerDto,
  UpdateUserDto,
  UpdateUserPayload,
  UserPageOptionsDto,
} from '../../dtos';
import {
  CreateUserService,
  GetUserService,
  ListUsersService,
  PhoneAndEmailValidationService,
  UpdateUserService,
} from '../../services';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('manage/customers')
@Roles(...KeysOf(ADMIN_ROLE))
export class ManageCustomerController {
  constructor(
    private readonly globalConfigService: GlobalConfigService,
    private readonly listUsersService: ListUsersService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly phoneAndEmailValidationService: PhoneAndEmailValidationService,
    private readonly notify: UserNotificationService,
    private readonly createUserService: CreateUserService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query(new ValidationPipe({ transform: true })) pageOptionsDto: UserPageOptionsDto) {
    pageOptionsDto.realm = 'CUSTOMER';
    const user = await this.listUsersService.getUsersWebVersion(pageOptionsDto);
    return user;
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
    const data = await this.getUserService.getBy({ id });
    return data;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'ACCOUNTS_MANAGER')
  @ActivityTitle('Register Customer')
  @UploadProfilePic('customer')
  async register(@UploadedFile() file: Express.Multer.File, @Body() dto: RegisterCustomerDto, @Req() req, @Ip() ip) {
    const device = this.globalConfigService.getUa(req);
    const requestInfo: IRequestInfo = { channel: 'WEB', ip, realm: 'CUSTOMER', createdBy: +req.user.uid, device };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { productPrices: productPricesStr, ...payload } = dto;
    const _payload = { ...payload, profilePic: file?.path };
    // if (productPricesStr) {
    //   _payload['productPrices'] = productPricesStr.map((o) =>
    //     plainToClass(CreateProductPriceDto, JSON.parse(o), {
    //       excludeExtraneousValues: false,
    //       enableImplicitConversion: true,
    //     }),
    //   );
    // }
    const builder = CustomerFactory.get(_payload, requestInfo);
    const user = await this.createUserService.createUser(builder);
    const smsPayload = builder.getNotificationDetail(user.id);
    await this.notify.sendAuthSMS(smsPayload);
    await this.notify.sendWelcomeEmail(user, smsPayload.otpCode, smsPayload.password);
    return user;
  }

  @Put('update-profile-pic/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'ACCOUNTS_MANAGER')
  @ActivityTitle('Update Customer Profile Pic')
  @UploadProfilePic('customer')
  async updateProfilePic(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Ip() ip,
  ) {
    const userId = Number(req.user.uid);
    const device = this.globalConfigService.getUa(req);
    const profilePic = file?.path;
    const payload = new UpdateUserPayload({ profilePic }, id, 'WEB', ip, userId, device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(ValidationPipe)
  @Roles('ADMIN', 'ACCOUNTS_MANAGER')
  @ActivityTitle('Update Customer')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() req, @Ip() ip) {
    const userId = Number(req.user.uid);
    const device = this.globalConfigService.getUa(req);
    const payload = new UpdateUserPayload(dto, id, 'WEB', ip, userId, device);
    const result = await this.updateUserService.updateUser(payload);
    return result;
  }
}
