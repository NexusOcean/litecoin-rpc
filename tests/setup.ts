import dotenv from 'dotenv';
import { createLitecoinRpcClient } from '../src/index.js';
import type { LitecoinRpcClient, RpcConfig } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });

const {
  LTC_HOST,
  LTC_USER,
  LTC_PASS,
  LTC_PORT,
  LTC_PROTOCOL,
  LTC_TEST_SEND,
  TEST_IMPORT_ADDRESS,
  TEST_ADDRESS,
  TEST_WALLET_PASSPHRASE,
  TEST_SPENT_TXID,
  TEST_SPENT_INDEX,
  TEST_MULTIWALLET,
} = parsed as Record<string, string>;

if (!LTC_HOST || !LTC_USER || !LTC_PASS || !LTC_PORT || !LTC_PROTOCOL) {
  throw new Error('Missing required LTC_* env vars in .env.test');
}

export const config = {
  host: LTC_HOST,
  port: parseInt(LTC_PORT, 10),
  user: LTC_USER,
  pass: LTC_PASS,
  protocol: LTC_PROTOCOL as 'http' | 'https',
};

export function makeClient(
  overrides: Partial<RpcConfig> = {},
): LitecoinRpcClient {
  return createLitecoinRpcClient({ ...config, ...overrides });
}

export const shouldTestSend = LTC_TEST_SEND === '1';

export const maybeDescribe = TEST_IMPORT_ADDRESS ? describe : describe.skip;

export const IMPORT_ADDRESS = TEST_IMPORT_ADDRESS ?? '';

export const maybeDescribeAddress = TEST_ADDRESS ? describe : describe.skip;

export const ADDRESS = TEST_ADDRESS ?? '';

export const maybeDescribeUnlocked = TEST_WALLET_PASSPHRASE
  ? describe
  : describe.skip;

export const WALLET_PASSPHRASE = TEST_WALLET_PASSPHRASE ?? '';

export const maybeDescribeSpentInfo =
  TEST_SPENT_TXID && TEST_SPENT_INDEX ? describe : describe.skip;

export const SPENT_TXID = TEST_SPENT_TXID ?? '';

export const SPENT_INDEX = TEST_SPENT_INDEX
  ? parseInt(TEST_SPENT_INDEX, 10)
  : 0;

// Loads a second wallet on the node, which makes unscoped wallet calls in
// other spec files fail with -19 while it runs. Run this spec on its own.
export const maybeDescribeMultiWallet =
  TEST_MULTIWALLET === '1' ? describe : describe.skip;
