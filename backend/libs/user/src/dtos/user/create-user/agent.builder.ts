/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserEntity } from '@app/db';
import { IRequestInfo } from '@app/shared';
import { BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserBuilder } from './base';
import { IUserBuilder } from './interfaces';
import { RegisterAgentDto } from './request-dtos';

export class AgentBuilder implements IUserBuilder {
  private builder: UserBuilder;
  constructor(
    private dto: RegisterAgentDto,
    requestInfo: IRequestInfo,
  ) {
    this.builder = new UserBuilder(requestInfo);
  }
  // ------------------
  // PRIVATE
  // ------------------
  // private async _getPriceList(m: EntityManager, productPrices: CreateProductPriceDto[]): Promise<IProductList[]> {
  //   const priceList: IProductList[] = [];
  //   // for (let i = 0; i < productPrices.length; i++) {
  //   //   const priceItem = productPrices[i];
  //   //   const product = await m.findOne(ProductEntity, {
  //   //     join: { alias: 'product', leftJoinAndSelect: { productPrices: 'product.productPrices' } },
  //   //     where: { id: priceItem.productId },
  //   //   });
  //   //   priceList.push({ ...priceItem, product });
  //   // }
  //   return priceList;
  // }

  // ------------------
  // PUBLIC
  // ------------------

  async getUser(m: EntityManager): Promise<UserEntity> {
    if (!m) {
      throw new BadRequestException('Entity Manager Required');
    }
    const {
      username,
      phone,
      email,
      profilePic,
      currencyId,
      canCreateSubAccounts,
      maximumDailyWalletThreshold,
      shareParentWallet,
      walletAlertThreshold,
    } = this.dto;
    // const priceList = await this._getPriceList(m, productPrices);

    this.builder = this.builder
      .setUsername(username)
      .setPhone(phone)
      .setEmail(email)
      .setRole('AGENT')
      .setAccessChannels(['WEB', 'APP'])
      .setCustomerProfile({ profilePic });
    // .setupWallet(currencyId)
    // .setCustomerProfile({
    //   canCreateSubAccounts,
    //   maximumDailyWalletThreshold,
    //   shareParentWallet,
    //   walletAlertThreshold,
    // })
    // .setProductPriceList(priceList);
    this.builder = await this.builder.addUserAccesses(['WEB', 'APP']);
    const user = this.builder.build();
    return user;
  }

  getNotificationDetail(userId: number) {
    return this.builder.getNotificationDetail(userId);
  }
}
