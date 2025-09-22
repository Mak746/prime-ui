import { UserEntity } from '@app/db';
import { PageDto, PageMetaDto, USER_STATUS, getStartAndEndDates, normalizePhoneSearchTerm } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserPageOptionsDto } from '../dtos';

@Injectable()
export class ListUsersService {
  constructor(private readonly ds: DataSource) {}

  public async getUsersWebVersion(options: UserPageOptionsDto): Promise<PageDto<UserEntity> | undefined> {
    const qb = this.ds.getRepository(UserEntity).createQueryBuilder('user');
    qb.leftJoinAndSelect('user.parentUser', 'parentUser');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    qb.leftJoinAndSelect('userProfile.city', 'city');
    qb.leftJoinAndSelect('userProfile.country', 'country');
    qb.leftJoinAndSelect('userProfile.state', 'state');
    //qb.leftJoinAndSelect('user.wallet', 'wallet');
    //qb.leftJoinAndSelect('wallet.currency', 'currency');

    if (options.idpId) {
      qb.andWhere('user.idpId = :idpId', { idpId: options.idpId });
    }

    if (options.email) {
      qb.andWhere('user.email LIKE :email', { email: `%${options.email}%` });
    }
    if (options.username) {
      qb.andWhere('user.fullName LIKE :fullName', { fullName: `%${options.username}%` });
    }
    if (options.phone) {
      qb.andWhere('user.phone LIKE :phone', { phone: `%${normalizePhoneSearchTerm(options.phone)}%` });
    }

    if (options.phoneOrName) {
      const searchTerm = normalizePhoneSearchTerm(options.phoneOrName);
      const phone = Number(searchTerm);
      if (isNaN(phone)) {
        qb.andWhere('user.fullName LIKE :phoneOrName', { phoneOrName: `%${searchTerm}%` });
      } else {
        qb.andWhere('user.phone LIKE :phoneOrName', { phoneOrName: `%${searchTerm}%` });
      }
    }
    if (options.createdAtRange) {
      const { start, end } = getStartAndEndDates(options.createdAtRange);
      qb.andWhere('user.createdAt >= :start', { start });
      qb.andWhere('user.createdAt <= :end', { end });
    }

    if (typeof options.parentCustomerId !== 'undefined') {
      qb.andWhere('user.parentUserId = :parentCustomerId', { parentCustomerId: options.parentCustomerId });
    }
    if (options.realm) {
      qb.andWhere('user.realm = :realm', { realm: options.realm });
    }
    if (options.status) {
      qb.andWhere('user.status = :status', { status: `${USER_STATUS[options.status]}` });
    }
    if (options.roles) {
      const r = options.roles.join("', '");
      qb.andWhere(`user.role IN ('${r}')`);
    }
    if (options.role) {
      qb.andWhere('user.role = :role', { role: options.role });
    }

    qb.orderBy(`user.${options.sort || 'createdAt'}`, options.order);

    qb.skip((options.page - 1) * options.take).take(options.take);
    const [users, usersCount] = await qb.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ options, itemCount: usersCount });
    const data = await users.map((la) => la.toDto());
    return new PageDto(data, pageMetaDto);
  }
}
