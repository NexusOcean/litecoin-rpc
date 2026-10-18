/**
 * Wallet
 *
 * Look up balance and transaction history for a Litecoin address.
 * Requires -addressindex enabled on your node.
 *
 */

import dotenv from 'dotenv';
import { createLitecoinRpcClient } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });
const { LTC_HOST, LTC_USER, LTC_PASS, LTC_PORT, LTC_PROTOCOL } =
  parsed as Record<string, string>;

const client = createLitecoinRpcClient({
  host: LTC_HOST,
  port: parseInt(LTC_PORT, 10),
  user: LTC_USER,
  pass: LTC_PASS,
  protocol: LTC_PROTOCOL as 'http' | 'https',
});

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.error('Usage: npx tsx examples/wallet.ts <address>');
    process.exit(1);
  }

  const [balance, txids] = await Promise.all([
    client.getAddressBalance(address),
    client.getAddressTxIds(address),
  ]);

  console.log(`Address:  ${address}`);
  console.log(`Balance:  ${balance.balance} LTC`);
  console.log(`Received: ${balance.received} LTC`);
  console.log(`TxIds (${txids.length} total):`, txids.slice(0, 5));
  if (txids.length > 5) console.log(`  ...and ${txids.length - 5} more`);
}

main().catch(console.error);
