import {
  BaseEntity,
  CHANNEL,
  Channel,
  REALM,
  REGISTRATION_PROVIDER,
  ROLE,
  Realm,
  RegistrationProvider,
  Role,
  USER_STATUS,
  UserStatus,
} from '@app/shared';
import { Exclude, instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { NotificationEntity } from '../notification';

import { ActivityLogEntity } from './activity-logs.entity';
import { ClientEntity } from './client.entity';
import { LoginHistoryEntity } from './login-history.entity';
import { UserAccessEntity } from './user-access.entity';
import { UserProfileEntity } from './user-profile.entity';

// import { ProductPriceEntity } from '../product';

@Entity({ name: 'users' })
@Index((u: UserEntity) => [u.email, u.realm], {
  unique: true,
  where: 'email IS NOT NULL',
})
@Index((u: UserEntity) => [u.phone, u.realm], {
  unique: true,
  where: 'phone IS NOT NULL',
})
@Index((u: UserEntity) => [u.username, u.realm], {
  unique: true,
  where: 'username IS NOT NULL',
})
@Index((u: UserEntity) => [u.socialProfileId, u.registrationProvider], {
  unique: true,
  where: 'socialProfileId IS NOT NULL',
})
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  @Exclude({ toPlainOnly: true })
  idpId: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  socialProfileId?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'enum', enum: REGISTRATION_PROVIDER, default: 'LOCAL' })
  registrationProvider: RegistrationProvider;

  //--------------------------------------
  @Column({ type: 'set', enum: CHANNEL, default: [CHANNEL.WEB] })
  accessChannels: Channel[];

  @Column({ type: 'enum', enum: REALM, nullable: false })
  realm: Realm;

  @Column({ type: 'enum', enum: ROLE, nullable: false })
  role: Role;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ type: 'enum', enum: USER_STATUS, default: 'PENDING' })
  status: UserStatus;

  // UserProfile
  @OneToOne(() => UserProfileEntity, (o) => o.user, { cascade: true, nullable: true })
  @JoinColumn({ name: 'user_profile_id', referencedColumnName: 'id' })
  userProfile?: UserProfileEntity;

  //@OneToOne(() => ConnectedUserEntity, (o) => o.user, { cascade: true, nullable: true })
  //@JoinColumn({ name: 'connected_user_id', referencedColumnName: 'id' })
  //connectedUser?: ConnectedUserEntity;

  @Column({ name: 'user_profile_id', nullable: true, unsigned: true })
  userProfileId?: number;

  // InstitutionUser
  //@OneToOne(() => InstitutionUserEntity, (o) => o.user, { cascade: true, nullable: true })
  //@JoinColumn({ name: 'institution_user_id', referencedColumnName: 'id' })
  //institutionUser?: InstitutionUserEntity;





  // // Main Wallet
  // @OneToOne(() => WalletEntity, (o) => o.user, {
  //   cascade: true,
  //   nullable: true,
  // }) // specify inverse side as a second parameter
  // @JoinColumn({ name: 'wallet_id', referencedColumnName: 'id' })
  // wallet?: WalletEntity;

  // @Column({ name: 'wallet_id', nullable: true, unsigned: true })
  // walletId?: number;
  // // Commission Wallet
  // @OneToOne(() => WalletEntity, (o) => o.commissionUser, {
  //   cascade: true,
  //   nullable: true,
  // }) // specify inverse side as a second parameter
  // @JoinColumn({ name: 'commission_wallet_id', referencedColumnName: 'id' })
  // commissionWallet?: WalletEntity;

  // @Column({ name: 'commission_wallet_id', nullable: true, unsigned: true })
  // commissionWalletId?: number;

  // Notifications
  @OneToMany(() => NotificationEntity, (o: NotificationEntity) => o.user, { nullable: true })
  notifications?: NotificationEntity[];


  // ActivityLogEntity
  @OneToMany(() => ActivityLogEntity, (o: ActivityLogEntity) => o.user, { nullable: true })
  activityLogs?: ActivityLogEntity[];

  // Clients
  @OneToMany(() => ClientEntity, (o: ClientEntity) => o.user, { nullable: true, cascade: true })
  clients?: ClientEntity[];


  // // Wallet
  // @OneToMany(() => WalletEntity, (o: WalletEntity) => o.user, { nullable: true, cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'] })
  // wallets: WalletEntity[];

  // User Devices
  @OneToMany(() => UserAccessEntity, (o: UserAccessEntity) => o.user, {
    nullable: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  })
  userAccesses: UserAccessEntity[];

  // PARENT CHILD HIERARCHY
  @ManyToOne(() => UserEntity, (o: UserEntity) => o.childrenUsers, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_user_id', referencedColumnName: 'id' })
  parentUser: UserEntity;

  @Column({ name: 'parent_user_id', nullable: true, unsigned: true })
  parentUserId: number;

  @OneToMany(() => UserEntity, (o: UserEntity) => o.parentUser, {
    nullable: true,
  })
  childrenUsers: UserEntity[];
  // END -PARENT-CHILD

  //----------------------------------------------------

  // loginHistories
  @OneToMany(() => LoginHistoryEntity, (o: LoginHistoryEntity) => o.user, { nullable: true })
  loginHistories?: LoginHistoryEntity[];

  // walletTransactions



  // // walletConversionAudits
  // @OneToMany(() => WalletConversionAuditEntity, (o: WalletConversionAuditEntity) => o.customer, { nullable: true })
  // walletConversionAudits?: WalletConversionAuditEntity[];

  // // transactionAudits
  // @OneToMany(() => TransactionAuditEntity, (o: TransactionAuditEntity) => o.customer, { nullable: true })
  // transactionAudits?: TransactionAuditEntity[];

  // // transactionAuditSummaries
  // @OneToMany(() => TransactionAuditSummaryEntity, (o: TransactionAuditSummaryEntity) => o.customer, { nullable: true })
  // transactionAuditSummaries?: TransactionAuditSummaryEntity[];

  // // ownedCashWalletLogs
  // @OneToMany(() => CashWalletLogEntity, (o: CashWalletLogEntity) => o.customer, { nullable: true })
  // ownedCashWalletLogs?: CashWalletLogEntity[];

  // // performedCashWalletLogs
  // @OneToMany(() => CashWalletLogEntity, (o: CashWalletLogEntity) => o.user, {
  //   nullable: true,
  // })
  // performedCashWalletLogs?: CashWalletLogEntity[];

  // // ownedCashWalletTransactions
  // @OneToMany(() => CashWalletTransactionEntity, (o: CashWalletTransactionEntity) => o.customer, { nullable: true })
  // ownedCashWalletTransactions?: CashWalletTransactionEntity[];

  // // performedCashWalletTransactions
  // @OneToMany(() => CashWalletTransactionEntity, (o: CashWalletTransactionEntity) => o.user, { nullable: true })
  // performedCashWalletTransactions?: CashWalletTransactionEntity[];

  // // ownedCashLoans
  // @OneToMany(() => CashLoanEntity, (o: CashLoanEntity) => o.customer, {
  //   nullable: true,
  // })
  // ownedCashLoans?: CashLoanEntity[];

  // // performedCashLoans
  // @OneToMany(() => CashLoanEntity, (o: CashLoanEntity) => o.user, {
  //   nullable: true,
  // })
  // performedCashLoans?: CashLoanEntity[];

  // // // ownedAirtimeWalletTransactions
  // // @OneToMany(() => AirtimeWalletTransactionEntity, (o: AirtimeWalletTransactionEntity) => o.customer, { nullable: true })
  // // ownedAirtimeWalletTransactions?: AirtimeWalletTransactionEntity[];

  // // // performedAirtimeWalletTransactions
  // // @OneToMany(() => AirtimeWalletTransactionEntity, (o: AirtimeWalletTransactionEntity) => o.user, { nullable: true })
  // // performedAirtimeWalletTransactions?: AirtimeWalletTransactionEntity[];

  // // ownedPaypalTransactions
  // @OneToMany(() => PaypalTransactionEntity, (o: PaypalTransactionEntity) => o.customer, { nullable: true })
  // ownedPaypalTransactions: PaypalTransactionEntity[];

  // // ownedPaymentProofs
  // @OneToMany(() => PaymentProofEntity, (o: PaymentProofEntity) => o.customer, {
  //   nullable: true,
  // })
  // ownedPaymentProofs: PaymentProofEntity[];

  // // performedPaymentProofs
  // @OneToMany(() => PaymentProofEntity, (o: PaymentProofEntity) => o.user, {
  //   nullable: true,
  // })
  // performedPaymentProofs: PaymentProofEntity[];

  // // companyBanks
  // @OneToMany(() => CompanyBankEntity, (o: CompanyBankEntity) => o.user, {
  //   nullable: true,
  // })
  // companyBanks: CompanyBankEntity[];

  // // airtimeOrders
  // @OneToMany(() => AirtimeOrderEntity, (o: AirtimeOrderEntity) => o.user, {
  //   nullable: true,
  // })
  // airtimeOrders?: AirtimeOrderEntity[];

  // // productPlans
  // @OneToMany(() => ProductPlanEntity, (o: ProductPlanEntity) => o.user, {
  //   nullable: true,
  // })
  // productPlans?: ProductPlanEntity[];

  // // // topupContacts
  // // @OneToMany(() => TopupContactEntity, (o: TopupContactEntity) => o.user, { nullable: true })
  // // topupContacts?: TopupContactEntity[];

  // // apiProfiles
  // @OneToMany(() => ApiProfileEntity, (o: ApiProfileEntity) => o.user, {
  //   nullable: true,
  // })
  // apiProfiles?: ApiProfileEntity[];

  // // apiLogs
  // @OneToMany(() => ApiLogEntity, (o: ApiLogEntity) => o.user, {
  //   nullable: true,
  // })
  // apiLogs?: ApiLogEntity[];

  // // invoices
  // @OneToMany(() => InvoiceEntity, (o: InvoiceEntity) => o.user, {
  //   nullable: true,
  // })
  // invoices?: InvoiceEntity[];

  // // productPrices
  // @OneToMany(() => ProductPriceEntity, (d: ProductPriceEntity) => d.user, {
  //   nullable: true,
  //   cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  // })
  // productPrices: ProductPriceEntity[];

  // // productBasePrices
  // @OneToMany(() => ProductBasePriceEntity, (d: ProductBasePriceEntity) => d.user, {
  //   nullable: true,
  //   cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  // })
  // productBasePrices: ProductBasePriceEntity[];

  // // productStockTransactions
  // @OneToMany(() => ProductStockTransactionEntity, (d: ProductStockTransactionEntity) => d.user, { nullable: true })
  // productStockTransactions: ProductStockTransactionEntity[];

  // // productOrders
  // @OneToMany(() => ProductOrderEntity, (d: ProductOrderEntity) => d.user, {
  //   nullable: true,
  //   cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  // })
  // productOrders: ProductOrderEntity[];

  // // vouchers
  // @OneToMany(() => VoucherEntity, (o: VoucherEntity) => o.customer, {
  //   nullable: true,
  // })
  // vouchers?: VoucherEntity[];

  // // productTransactions
  // @OneToMany(() => ProductTransactionEntity, (o: ProductTransactionEntity) => o.customer, { nullable: true })
  // productTransactions?: ProductTransactionEntity[];

  // // webhookConfigs
  // @OneToMany(() => WebhookConfigEntity, (o: WebhookConfigEntity) => o.user, {
  //   nullable: true,
  // })
  // webhookConfigs?: WebhookConfigEntity[];

  // // productContacts
  // @OneToMany(() => ProductContactEntity, (o: ProductContactEntity) => o.customer, { nullable: true })
  // productContacts?: ProductContactEntity[];

  // //------------------------------------------
  // // REFERRAL
  // //------------------------------------------
  // //
  // // referralCommissionPayouts
  // @OneToMany(() => CommissionPayoutEntity, (o: CommissionPayoutEntity) => o.referrerUser, { nullable: true })
  // referralCommissionPayouts?: CommissionPayoutEntity[];

  // // referralPartnerProfiles
  // @OneToMany(() => ReferralPartnerProfileEntity, (o: ReferralPartnerProfileEntity) => o.customer, {
  //   nullable: true,
  //   cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
  // })
  // referralPartnerProfiles?: ReferralPartnerProfileEntity[];

  // // referralPartnerProfilesVerified
  // @OneToMany(() => ReferralPartnerProfileEntity, (o: ReferralPartnerProfileEntity) => o.verifierUser, {
  //   nullable: true,
  // })
  // referralPartnerProfilesVerified?: ReferralPartnerProfileEntity[];

  // // referralTransactions
  // @OneToMany(() => ReferralTransactionEntity, (o: ReferralTransactionEntity) => o.referrerUser, { nullable: true })
  // referralTransactions?: ReferralTransactionEntity[];

  // // referredTransactions
  // @OneToMany(() => ReferralTransactionEntity, (o: ReferralTransactionEntity) => o.referredUser, { nullable: true })
  // referredTransactions?: ReferralTransactionEntity[];

  // // airtimeRequests
  // @OneToMany(() => AirtimeRequestEntity, (o: AirtimeRequestEntity) => o.user, {
  //   nullable: true,
  // })
  // airtimeRequests?: AirtimeRequestEntity[];

  // // eobDestinationUploadBatches
  // @OneToMany(() => EobDestinationUploadBatchEntity, (o: EobDestinationUploadBatchEntity) => o.user, { nullable: true })
  // eobDestinationUploadBatches?: EobDestinationUploadBatchEntity[];

  toDto() {
    return plainToClass(UserEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
