import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type { NetworkInfo, PeerInfo } from '../../types/index.js';

export interface NetworkMethods {
  getNetworkInfo(): Promise<NetworkInfo>;
  getPeerInfo(): Promise<PeerInfo[]>;
}

export function createNetworkMethods(http: AxiosInstance): NetworkMethods {
  return {
    getNetworkInfo(): Promise<NetworkInfo> {
      return callRpc<NetworkInfo>(http, 'getnetworkinfo', []);
    },

    getPeerInfo(): Promise<PeerInfo[]> {
      return callRpc<PeerInfo[]>(http, 'getpeerinfo', []);
    },
  };
}
