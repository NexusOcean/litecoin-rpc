import { MempoolEntry } from './mempool.js';

export interface Bip9SoftFork {
  status: 'defined' | 'started' | 'locked_in' | 'active' | 'failed';
  bit?: number;
  start_time: number;
  timeout: number;
  since: number;
}

export interface SoftFork {
  type: 'buried' | 'bip9';
  active: boolean;
  height?: number;
  bip9?: Bip9SoftFork;
}

export interface BlockchainInfo {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
  pruneheight?: number;
  automatic_pruning?: boolean;
  prune_target_size?: number;
  softforks: Record<string, SoftFork>;
  warnings: string;
}

export interface TxOutSetInfo {
  height: number;
  bestblock: string;
  transactions: number;
  txouts: number;
  hash_serialized_2: string;
  disk_size: number;
  total_amount: number;
}

export type ChainTipStatus =
  'invalid' | 'headers-only' | 'valid-headers' | 'valid-fork' | 'active';

export interface ChainTip {
  height: number;
  hash: string;
  branchlen: number;
  status: ChainTipStatus;
}

export type MempoolAncestorsResult<V extends boolean = false> = V extends true
  ? Record<string, MempoolEntry>
  : string[];

export type MempoolDescendantsResult<V extends boolean = false> = V extends true
  ? Record<string, MempoolEntry>
  : string[];
