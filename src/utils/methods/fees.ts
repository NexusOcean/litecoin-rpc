import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  FeeRate,
  SmartFeeEstimate,
  SmartPriorityEstimate,
} from '../../types/index.js';

export interface FeesMethods {
  getFeeRate(): Promise<FeeRate>;
  estimateFee(nblocks: number): Promise<number>;
  estimateSmartFee(nblocks: number): Promise<SmartFeeEstimate>;
  estimatePriority(nblocks: number): Promise<number>;
  estimateSmartPriority(nblocks: number): Promise<SmartPriorityEstimate>;
}

export function createFeesMethods(http: AxiosInstance): FeesMethods {
  return {
    getFeeRate: () => callRpc<FeeRate>(http, 'getfeerate'),

    estimateFee: (nblocks: number) =>
      callRpc<number>(http, 'estimatefee', [nblocks]),

    estimateSmartFee: (nblocks: number) =>
      callRpc<SmartFeeEstimate>(http, 'estimatesmartfee', [nblocks]),

    estimatePriority: (nblocks: number) =>
      callRpc<number>(http, 'estimatepriority', [nblocks]),

    estimateSmartPriority: (nblocks: number) =>
      callRpc<SmartPriorityEstimate>(http, 'estimatesmartpriority', [nblocks]),
  };
}
