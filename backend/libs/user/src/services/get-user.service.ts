import { UserEntity } from '@app/db';
import { DetailResponse, Realm, Role } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class GetUserService {
  constructor(private readonly ds: DataSource) {}

  public async getBy(
    opts: Partial<{ id: number; idpId: string; parentId: number; role: Role }>,
  ): Promise<DetailResponse<UserEntity> | undefined> {
    const { id, idpId, parentId, role } = opts;
    if (!id && !idpId && !parentId) return;
    const qb = this.ds.getRepository(UserEntity).createQueryBuilder('user');
    qb.leftJoinAndSelect('user.parentUser', 'parentUser');
    qb.leftJoinAndSelect('user.userProfile', 'userProfile');
    qb.leftJoinAndSelect('userProfile.city', 'city');
    qb.leftJoinAndSelect('userProfile.country', 'country');
    qb.leftJoinAndSelect('userProfile.state', 'state');
    qb.leftJoinAndSelect('user.institutionUsers', 'institutionUsers');
    qb.leftJoinAndSelect('institutionUsers.institution', 'institution');
    //qb.leftJoinAndSelect('institutionUser.institutionRole', 'institutionRole');
    qb.leftJoinAndSelect('user.professional', 'professional');
    qb.leftJoinAndSelect('professional.professionType', 'professionType');
    qb.leftJoinAndSelect('user.patient', 'patient');

    if (id) {
      qb.andWhere('user.id = :id', { id });
    }
    if (idpId) {
      qb.andWhere('user.idpId = :idpId', { idpId });
    }
    if (parentId) {
      qb.andWhere('user.parentUserId = :parentId', { parentId });
    }
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }
    return new DetailResponse(await qb.getOne());
  }
  public async getByPhoneEmailAndRealm(
    m: EntityManager,
    realm: Realm,
    phone?: string,
    email?: string,
  ): Promise<UserEntity | undefined> {
    const where = phone ? { phone, realm } : { email, realm };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userAccesses: 'user.userAccesses',
          userProfile: 'user.userProfile',
          accessDevices: 'userAccesses.accessDevices',
          institutionUsers: 'user.institutionUsers',
        },
      },
    });
  }
  public async getByPhoneEmailOrUsernameAndRealm(
    m: EntityManager,
    realm: Realm,
    phone?: string,
    email?: string,
    username?: string,
  ): Promise<UserEntity | undefined> {
    const where = phone ? { phone, realm } : email ? { email, realm } : { username, realm };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userAccesses: 'user.userAccesses',
          userProfile: 'user.userProfile',
          accessDevices: 'userAccesses.accessDevices',
          institutionUsers: 'user.institutionUsers',
        },
      },
    });
  }
  public async getByUserId(m: EntityManager, userId: number): Promise<UserEntity | undefined> {
    const where = { id: userId };
    return m.findOne(UserEntity, {
      where,
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          userAccesses: 'user.userAccesses',
          userProfile: 'user.userProfile',
          accessDevices: 'userAccesses.accessDevices',
        },
      },
    });
  }



  async findById(options: { id: number }) {
    const queryBuilder = this.ds
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userProfile', 'userProfile')


    if (options.id) {
      queryBuilder.where('user.id = :id', { id: options.id });
    }
    const user = await queryBuilder.getOne();
    return new DetailResponse(user.toDto());
  }
}
