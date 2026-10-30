import { buildHttpClient } from './http.js';
import { callRpc, callRpcBatch } from './rpc.js';
import type {
  RpcConfig,
  CallOptions,
  BatchCall,
  BatchResult,
} from '../types/index.js';

import {
  createBlockchainMethods,
  type BlockchainMethods,
  createNetworkMethods,
  type NetworkMethods,
  createWalletMethods,
  type WalletMethods,
  createAddressIndexMethods,
  type AddressIndexMethods,
  createFeesMethods,
  type FeesMethods,
  createRawTransactionMethods,
  type RawTransactionMethods,
  createUtilMethods,
  type UtilMethods,
} from './methods/index.js';

export interface LitecoinRpcClient
  extends
    BlockchainMethods,
    NetworkMethods,
    WalletMethods,
    AddressIndexMethods,
    FeesMethods,
    RawTransactionMethods,
    UtilMethods {
  call<T = unknown>(
    method: string,
    params?: unknown[],
    options?: CallOptions,
  ): Promise<T>;
  batch(calls: BatchCall[], options?: CallOptions): Promise<BatchResult[]>;
  /** Wallet methods scoped to a named wallet, required when several are loaded. */
  wallet(name: string): WalletMethods;
}

export function createLitecoinRpcClient(config: RpcConfig): LitecoinRpcClient {
  const http = buildHttpClient(config);

  return {
    call<T = unknown>(
      method: string,
      params: unknown[] = [],
      options?: CallOptions,
    ): Promise<T> {
      return callRpc<T>(http, method, params, options);
    },
    batch(calls: BatchCall[], options?: CallOptions): Promise<BatchResult[]> {
      return callRpcBatch(http, calls, options);
    },
    wallet(name: string): WalletMethods {
      return createWalletMethods(http, name);
    },

    ...createBlockchainMethods(http),
    ...createNetworkMethods(http),
    ...createWalletMethods(http),
    ...createAddressIndexMethods(http),
    ...createFeesMethods(http),
    ...createRawTransactionMethods(http),
    ...createUtilMethods(http),
  };
}
