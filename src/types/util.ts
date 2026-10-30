export interface MultisigResult {
  address: string;
  redeemScript: string;
}

export interface DescriptorInfo {
  descriptor: string;
  checksum: string;
  isrange: boolean;
  issolvable: boolean;
  hasprivatekeys: boolean;
}

export interface CreateWalletResult {
  name: string;
  warning: string;
}

export interface BalanceGroup {
  trusted: number;
  untrusted_pending: number;
  immature: number;
}

export interface Balances {
  mine: BalanceGroup;
  watchonly?: BalanceGroup;
}
