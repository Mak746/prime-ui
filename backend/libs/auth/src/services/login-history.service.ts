import { AccessDeviceEntity, LoginHistoryEntity, UserEntity } from '@app/db';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SaveUserLoginDto } from '../dtos';

@Injectable()
export class LoginHistoryService {
  // NOTE options.user.userAccesses should be populated
  public async saveOnLogin(
    m: EntityManager,
    options: SaveUserLoginDto,
    user: UserEntity,
  ): Promise<LoginHistoryEntity | undefined> {
    const { requestInfo, userId } = options;
    // log user login history
    const ua = requestInfo.device.getFormatedUserAgent(userId);

    let accessDevice = null;
    for (const userAccess of user.userAccesses) {
      const device = userAccess.accessDevices.find((o) => o.deviceHash === ua.deviceHash);
      if (device) {
        // existing device
        accessDevice = device;
        break;
      }
    }
    if (!accessDevice) {
      // new device
      accessDevice = new AccessDeviceEntity({ ...ua, userAccessId: userId });
      accessDevice = await m.save(accessDevice);
    }
    const history = new LoginHistoryEntity({ accessDevice, userId: user.id });
    return await m.save(history);
  }
}
