/**
 * Search
 *
 * Route a query to the right RPC call based on its format.
 *
 * - 64 hex chars  → transaction
 * - numeric       → block by height
 * - base58 addr   → address (requires -addressindex on your node)
 */

import dotenv from 'dotenv';
import { createLitecoinRpcClient } from '../src/index.js';
import type {
  Block,
  Transaction,
  AddressBalance,
  AddressTxIds,
} from '../src/index.js';

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

type SearchResult =
  | { type: 'transaction'; data: Transaction }
  | { type: 'block'; data: Block }
  | {
      type: 'address';
      data: { balance: AddressBalance; txids: AddressTxIds };
    };

async function search(query: string): Promise<SearchResult> {
  const q = query.trim();

  if (/^[0-9a-fA-F]{64}$/.test(q)) {
    const data = await client.getRawTransaction(q);
    return { type: 'transaction', data };
  }

  if (/^\d+$/.test(q)) {
    const hash = await client.getBlockHash(parseInt(q, 10));
    const data = await client.getBlock(hash);
    return { type: 'block', data };
  }

  if (/^[a4][1-9A-HJ-NP-Za-km-z]{25,40}$/.test(q)) {
    const [balance, txids] = await Promise.all([
      client.getAddressBalance(q),
      client.getAddressTxIds(q),
    ]);
    return { type: 'address', data: { balance, txids } };
  }

  throw new Error(`Could not identify query: ${q}`);
}

async function main() {
  const query = process.argv[2];
  if (!query) {
    console.error('Usage: npx tsx examples/search.ts <txid|height|address>');
    process.exit(1);
  }

  const result = await search(query);
  console.log(`Type: ${result.type}\n`);

  if (result.type === 'address') {
    const { balance, txids } = result.data;
    console.log(`Balance:  ${balance.balance} LTC`);
    console.log(`Received: ${balance.received} LTC`);
    console.log(`TxIds (${txids.length} total):`, txids.slice(0, 5));
    if (txids.length > 5) console.log(`  ...and ${txids.length - 5} more`);
  } else {
    console.log(JSON.stringify(result.data, null, 2));
  }
}

main().catch(console.error);
