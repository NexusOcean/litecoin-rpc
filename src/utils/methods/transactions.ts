import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  RawTxInput,
  RawTxOutput,
  DecodeRawTransactionResult,
  DecodeScriptResult,
  FundRawTransactionResult,
  SignRawTransactionResult,
  PrevTx,
} from '../../types/index.js';

export interface RawTransactionMethods {
  createRawTransaction(
    inputs: RawTxInput[],
    outputs: RawTxOutput,
    locktime?: number,
  ): Promise<string>;
  decodeRawTransaction(hex: string): Promise<DecodeRawTransactionResult>;
  decodeScript(hex: string): Promise<DecodeScriptResult>;
  fundRawTransaction(
    hex: string,
    options?: Record<string, unknown>,
  ): Promise<FundRawTransactionResult>;
  sendRawTransaction(hex: string, allowHighFees?: boolean): Promise<string>;
  signRawTransaction(
    hex: string,
    prevtxs?: PrevTx[],
    privatekeys?: string[],
    sighashtype?: string,
  ): Promise<SignRawTransactionResult>;
}

export function createRawTransactionMethods(
  http: AxiosInstance,
): RawTransactionMethods {
  return {
    createRawTransaction: (inputs, outputs, locktime = 0) =>
      callRpc<string>(http, 'createrawtransaction', [
        inputs,
        outputs,
        locktime,
      ]),

    decodeRawTransaction: (hex: string) =>
      callRpc<DecodeRawTransactionResult>(http, 'decoderawtransaction', [hex]),

    decodeScript: (hex: string) =>
      callRpc<DecodeScriptResult>(http, 'decodescript', [hex]),

    fundRawTransaction: (hex: string, options = {}) =>
      callRpc<FundRawTransactionResult>(http, 'fundrawtransaction', [
        hex,
        options,
      ]),

    sendRawTransaction: (hex: string, allowHighFees = false) =>
      callRpc<string>(http, 'sendrawtransaction', [hex, allowHighFees]),

    signRawTransaction: (
      hex,
      prevtxs = [],
      privatekeys = [],
      sighashtype = 'ALL',
    ) =>
      callRpc<SignRawTransactionResult>(http, 'signrawtransaction', [
        hex,
        prevtxs,
        privatekeys,
        sighashtype,
      ]),
  };
}
