import { IEMail, IMailNotifier, ISMSNotifier, ISMSPayload, IWalletTransactionMail } from '@app/shared';
import { IWalletTransactionNotification } from '../wallet-txn-sms.interface';

export class WalletTransactionNotifier implements ISMSNotifier, IMailNotifier<IWalletTransactionMail> {
  private _destinationPhone: string;
  private _destinationEmail: string;
  constructor(public dto: IWalletTransactionNotification) {
    this._destinationPhone = dto.phone ? `${dto.phone}` : '';
    this._destinationEmail = dto.email ? dto.email : '';
  }
  getMailData(): IEMail<IWalletTransactionMail> {
    const { amount, balance, fullName, currencyCode, transactionType, userId, walletType } = this.dto;
    return {
      to: this._destinationEmail,
      userId,
      context: {
        amount,
        balance,
        fullName,
        currencyCode,
        transactionType,
        walletType,
      },
    };
  }
  updateDestinationMail?(email: string): void {
    this._destinationEmail = email;
  }
  getData(): ISMSPayload {
    const { amount, balance, fullName, currencyCode, transactionType, userId, walletType } = this.dto;
    const _txnType = transactionType === 'CR' ? 'Credit ' : 'Debit';
    const _account = `${walletType.toLowerCase()} account`;
    // format message
    const greeting = `Dear ${fullName},`;
    const msg = `Please be informed that ${amount} ${currencyCode} ${_txnType} Transaction is made to your ${_account}.`;
    const balanceInfo = `Your ${_account} balance: ${balance} ${currencyCode}.`;
    const closing = `Thank you for choosing WeCare.et!`;
    return {
      text: `${greeting} ${msg} ${balanceInfo} ${closing}`,
      to: this._destinationPhone,
      subject: `${transactionType}_${walletType}`,
      userId,
    };
  }

  updateDestination(phone: string): void {
    this._destinationPhone = phone.startsWith('251') ? phone : `${phone}`;
  }
  hasValidDefinitionFor(paramToCheck: 'EMAIL' | 'PHONE'): boolean {
    switch (paramToCheck) {
      case 'EMAIL':
        return this._destinationEmail ? true : false;

      case 'PHONE':
        return this._destinationPhone ? true : false;

      default:
        return false;
    }
  }
}
