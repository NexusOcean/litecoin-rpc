import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type { DescriptorInfo, MultisigResult } from '../../types/index.js';

export interface UtilMethods {
  createMultisig(nrequired: number, keys: string[]): Promise<MultisigResult>;
  signMessageWithPrivKey(privkey: string, message: string): Promise<string>;
  verifyMessage(
    address: string,
    signature: string,
    message: string,
  ): Promise<boolean>;
  getDescriptorInfo(descriptor: string): Promise<DescriptorInfo>;
  deriveAddresses(
    descriptor: string,
    range?: number | [number, number],
  ): Promise<string[]>;
}

export function createUtilMethods(http: AxiosInstance): UtilMethods {
  return {
    createMultisig(nrequired: number, keys: string[]): Promise<MultisigResult> {
      return callRpc<MultisigResult>(http, 'createmultisig', [nrequired, keys]);
    },

    signMessageWithPrivKey(privkey: string, message: string): Promise<string> {
      return callRpc<string>(http, 'signmessagewithprivkey', [
        privkey,
        message,
      ]);
    },

    verifyMessage(
      address: string,
      signature: string,
      message: string,
    ): Promise<boolean> {
      return callRpc<boolean>(http, 'verifymessage', [
        address,
        signature,
        message,
      ]);
    },

    getDescriptorInfo(descriptor: string): Promise<DescriptorInfo> {
      return callRpc<DescriptorInfo>(http, 'getdescriptorinfo', [descriptor]);
    },

    deriveAddresses(
      descriptor: string,
      range?: number | [number, number],
    ): Promise<string[]> {
      return callRpc<string[]>(
        http,
        'deriveaddresses',
        range === undefined ? [descriptor] : [descriptor, range],
      );
    },
  };
}
