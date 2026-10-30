import type { ScriptPubKey, ScriptSig } from './shared.js';

export interface CoinbaseVin {
  coinbase: string;
  sequence: number;
}

export interface StandardVin {
  txid: string;
  vout: number;
  scriptSig: ScriptSig;
  sequence: number;
}

export type Vin = CoinbaseVin | StandardVin;

export interface Vout {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
}

export interface Transaction {
  txid: string;
  hash: string;
  hex: string;
  size: number;
  vsize: number;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  blockhash: string;
  height: number;
  confirmations: number;
  time: number;
  blocktime: number;
}

export interface RawTxInput {
  txid: string;
  vout: number;
}

export interface RawTxOutput {
  [address: string]: number;
}

export interface PrevTx {
  txid: string;
  vout: number;
  scriptPubKey: string;
  redeemScript?: string;
  witnessScript?: string;
  /** Required when signing segwit inputs. */
  amount?: number;
}

export interface SignRawTransactionResult {
  hex: string;
  complete: boolean;
  errors?: {
    txid: string;
    vout: number;
    scriptSig: string;
    sequence: number;
    error: string;
  }[];
}

export interface DecodeRawTransactionResult {
  txid: string;
  hash: string;
  size: number;
  vsize: number;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
}

export interface DecodeScriptResult {
  asm: string;
  hex?: string;
  type: string;
  reqSigs?: number;
  addresses?: string[];
  p2sh?: string;
}

export interface FundRawTransactionResult {
  hex: string;
  fee: number;
  changepos: number;
}
