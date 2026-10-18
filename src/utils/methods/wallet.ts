import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  WalletInfo,
  ValidateAddressResult,
  AddressInfo,
  WalletTransaction,
  WalletTransactionListEntry,
  ListSinceBlockResult,
  UnspentOutput,
  AddressGrouping,
  AddressBalances,
  LockedUnspent,
  ReceivedByAddressEntry,
  BumpFeeOptions,
  BumpFeeResult,
  UnspentOutputRef,
  ImportMultiRequest,
  ImportMultiOptions,
  ImportMultiResult,
} from '../../types/index.js';

export interface WalletMethods {
  getWalletInfo(): Promise<WalletInfo>;
  getBalance(minconf?: number): Promise<number>;
  getUnconfirmedBalance(): Promise<number>;
  getNewAddress(label?: string): Promise<string>;
  validateAddress(address: string): Promise<ValidateAddressResult>;
  getAddressInfo(address: string): Promise<AddressInfo>;
  getTransaction(txid: string): Promise<WalletTransaction>;
  listTransactions(
    label?: string,
    count?: number,
    skip?: number,
  ): Promise<WalletTransactionListEntry[]>;
  listSinceBlock(
    blockhash?: string,
    targetConfirmations?: number,
    includeWatchOnly?: boolean,
  ): Promise<ListSinceBlockResult>;
  listUnspent(
    minconf?: number,
    maxconf?: number,
    addresses?: string[],
    includeUnsafe?: boolean,
  ): Promise<UnspentOutput[]>;
  sendToAddress(
    address: string,
    amount: number,
    comment?: string,
    commentTo?: string,
    subtractFeeFromAmount?: boolean,
  ): Promise<string>;
  getReceivedByAddress(address: string, minconf?: number): Promise<number>;
  importAddress(
    address: string,
    label?: string,
    rescan?: boolean,
    p2sh?: boolean,
  ): Promise<void>;
  getRawChangeAddress(): Promise<string>;
  listAddressBalances(minAmount?: number): Promise<AddressBalances>;
  listAddressGroupings(): Promise<AddressGrouping>;
  listLockUnspent(): Promise<LockedUnspent[]>;
  listReceivedByAddress(
    minconf?: number,
    includeEmpty?: boolean,
    includeWatchOnly?: boolean,
  ): Promise<ReceivedByAddressEntry[]>;
  setMinInput(amount: number): Promise<boolean>;
  setTxFee(amount: number): Promise<boolean>;
  // dumpprivkey requires a one-time confirmation code, undocumented in CLI help.
  // First call (no code) always errors with the code embedded in the error message;
  // second call (address + code) returns the key. Caller is responsible for the flow.
  dumpPrivKey(address: string, code?: string): Promise<string>;
  // Unlocks an encrypted wallet for `timeout` seconds.
  walletPassphrase(passphrase: string, timeout: number): Promise<null>;
  walletLock(): Promise<null>;
  // Permanent: litecoind has no RPC to decrypt a wallet again.
  encryptWallet(passphrase: string): Promise<string>;
  walletPassphraseChange(
    oldPassphrase: string,
    newPassphrase: string,
  ): Promise<null>;
  importPrivKey(
    privKey: string,
    label?: string,
    rescan?: boolean,
  ): Promise<void>;
  importPubKey(pubKey: string, label?: string, rescan?: boolean): Promise<void>;
  signMessage(address: string, message: string): Promise<string>;
  lockUnspent(
    unlock: boolean,
    transactions?: UnspentOutputRef[],
  ): Promise<boolean>;
  // fromaccount is a legacy positional param — hardcoded to '', not exposed.
  sendMany(
    recipients: Record<string, number>,
    minconf?: number,
    comment?: string,
    subtractFeeFrom?: string[],
  ): Promise<string>;
  bumpFee(txid: string, options?: BumpFeeOptions): Promise<BumpFeeResult>;
  importMulti(
    requests: ImportMultiRequest[],
    options?: ImportMultiOptions,
  ): Promise<ImportMultiResult[]>;
  abandonTransaction(txid: string): Promise<void>;
}

export function createWalletMethods(http: AxiosInstance): WalletMethods {
  return {
    getWalletInfo(): Promise<WalletInfo> {
      return callRpc<WalletInfo>(http, 'getwalletinfo', []);
    },

    getBalance(minconf: number = 1): Promise<number> {
      return callRpc<number>(http, 'getbalance', ['*', minconf]);
    },

    getUnconfirmedBalance(): Promise<number> {
      return callRpc<number>(http, 'getunconfirmedbalance', []);
    },

    getNewAddress(label?: string): Promise<string> {
      return callRpc<string>(
        http,
        'getnewaddress',
        label !== undefined ? [label] : [],
      );
    },

    validateAddress(address: string): Promise<ValidateAddressResult> {
      return callRpc<ValidateAddressResult>(http, 'validateaddress', [address]);
    },

    getAddressInfo(address: string): Promise<AddressInfo> {
      return callRpc<AddressInfo>(http, 'getaddressinfo', [address]);
    },

    getTransaction(txid: string): Promise<WalletTransaction> {
      return callRpc<WalletTransaction>(http, 'gettransaction', [txid]);
    },

    listTransactions(
      label: string = '*',
      count: number = 10,
      skip: number = 0,
    ): Promise<WalletTransactionListEntry[]> {
      return callRpc<WalletTransactionListEntry[]>(http, 'listtransactions', [
        label,
        count,
        skip,
      ]);
    },

    listSinceBlock(
      blockhash?: string,
      targetConfirmations: number = 1,
      includeWatchOnly: boolean = false,
    ): Promise<ListSinceBlockResult> {
      const params: unknown[] = [];
      if (blockhash !== undefined) {
        params.push(blockhash, targetConfirmations, includeWatchOnly);
      }
      return callRpc<ListSinceBlockResult>(http, 'listsinceblock', params);
    },

    listUnspent: (
      minconf = 1,
      maxconf = 9999999,
      addresses,
      includeUnsafe = true,
    ) =>
      callRpc<UnspentOutput[]>(http, 'listunspent', [
        minconf,
        maxconf,
        addresses ?? [],
        includeUnsafe,
      ]),

    sendToAddress(
      address: string,
      amount: number,
      comment?: string,
      commentTo?: string,
      subtractFeeFromAmount: boolean = false,
    ): Promise<string> {
      const params: unknown[] = [address, amount];
      if (
        comment !== undefined ||
        commentTo !== undefined ||
        subtractFeeFromAmount
      ) {
        params.push(comment ?? '', commentTo ?? '', subtractFeeFromAmount);
      }
      return callRpc<string>(http, 'sendtoaddress', params);
    },

    getReceivedByAddress(
      address: string,
      minconf: number = 1,
    ): Promise<number> {
      return callRpc<number>(http, 'getreceivedbyaddress', [address, minconf]);
    },

    importAddress: (address, label = '', rescan = true, p2sh = false) =>
      callRpc<void>(http, 'importaddress', [address, label, rescan, p2sh]),

    getRawChangeAddress: () => callRpc<string>(http, 'getrawchangeaddress'),

    listAddressBalances: (minAmount = 0) =>
      callRpc<AddressBalances>(http, 'listaddressbalances', [minAmount]),

    listAddressGroupings: () =>
      callRpc<AddressGrouping>(http, 'listaddressgroupings'),

    listLockUnspent: () => callRpc<LockedUnspent[]>(http, 'listlockunspent'),

    listReceivedByAddress: (
      minconf = 1,
      includeEmpty = false,
      includeWatchOnly = false,
    ) =>
      callRpc<ReceivedByAddressEntry[]>(http, 'listreceivedbyaddress', [
        minconf,
        includeEmpty,
        includeWatchOnly,
      ]),

    setMinInput: (amount: number) =>
      callRpc<boolean>(http, 'setmininput', [amount]),

    setTxFee: (amount: number) => callRpc<boolean>(http, 'settxfee', [amount]),

    walletPassphrase: (passphrase: string, timeout: number) =>
      callRpc<null>(http, 'walletpassphrase', [passphrase, timeout]),

    walletLock: () => callRpc<null>(http, 'walletlock', []),

    encryptWallet: (passphrase: string) =>
      callRpc<string>(http, 'encryptwallet', [passphrase]),

    walletPassphraseChange: (oldPassphrase: string, newPassphrase: string) =>
      callRpc<null>(http, 'walletpassphrasechange', [
        oldPassphrase,
        newPassphrase,
      ]),

    dumpPrivKey: (address: string, code?: string) =>
      callRpc<string>(
        http,
        'dumpprivkey',
        code !== undefined ? [address, code] : [address],
      ),

    importPrivKey: (privKey: string, label = '', rescan = true) =>
      callRpc<void>(http, 'importprivkey', [privKey, label, rescan]),

    importPubKey: (pubKey: string, label = '', rescan = true) =>
      callRpc<void>(http, 'importpubkey', [pubKey, label, rescan]),

    signMessage: (address: string, message: string) =>
      callRpc<string>(http, 'signmessage', [address, message]),

    lockUnspent: (unlock: boolean, transactions: UnspentOutputRef[] = []) =>
      callRpc<boolean>(http, 'lockunspent', [unlock, transactions]),

    // fromaccount is a legacy positional param — hardcoded to '', not exposed.
    sendMany: (
      recipients: Record<string, number>,
      minconf = 1,
      comment = '',
      subtractFeeFrom: string[] = [],
    ) =>
      callRpc<string>(http, 'sendmany', [
        '',
        recipients,
        minconf,
        comment,
        subtractFeeFrom,
      ]),

    bumpFee: (txid: string, options: BumpFeeOptions = {}) =>
      callRpc<BumpFeeResult>(http, 'bumpfee', [txid, options]),

    importMulti: (
      requests: ImportMultiRequest[],
      options: ImportMultiOptions = {},
    ) => callRpc<ImportMultiResult[]>(http, 'importmulti', [requests, options]),

    abandonTransaction: (txid: string) =>
      callRpc<void>(http, 'abandontransaction', [txid]),
  };
}
