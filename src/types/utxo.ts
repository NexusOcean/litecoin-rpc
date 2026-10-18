export interface TxOut {
  bestblock: string;
  confirmations: number;
  value: number;
  scriptPubKey: {
    asm: string;
    hex: string;
    reqSigs?: number;
    type: string;
    addresses?: string[];
  };
  coinbase: boolean;
}

export interface UnspentOutput {
  txid: string;
  vout: number;
  address?: string;
  account?: string;
  scriptPubKey: string;
  amount: number;
  confirmations: number;
  redeemScript?: string;
  spendable: boolean;
  solvable: boolean;
  safe: boolean;
}
