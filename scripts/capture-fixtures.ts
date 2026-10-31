/**
 * Capture Fixtures
 *
 * Saves raw RPC responses and `help` text from a live node into
 * tests/fixtures/<chain>/, as a local reference for typing and e2e tests.
 * The directory is gitignored: it holds wallet and node data.
 * Read-only: no wallets are created, nothing is signed or sent.
 *
 * Wallet responses (balances, addresses, UTXOs) are skipped unless --wallet
 * is passed.
 *
 * Usage:
 *   npx tsx scripts/capture-fixtures.ts
 *   npx tsx scripts/capture-fixtures.ts --wallet
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import dotenv from 'dotenv';
import { createLitecoinRpcClient, RpcCallError } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });
const { LTC_HOST, LTC_USER, LTC_PASS, LTC_PORT, LTC_PROTOCOL } =
  parsed as Record<string, string>;

if (!LTC_HOST || !LTC_USER || !LTC_PASS || !LTC_PORT || !LTC_PROTOCOL) {
  throw new Error('Missing required LTC_* env vars in .env.test');
}

const client = createLitecoinRpcClient({
  host: LTC_HOST,
  port: parseInt(LTC_PORT, 10),
  user: LTC_USER,
  pass: LTC_PASS,
  protocol: LTC_PROTOCOL as 'http' | 'https',
});

const HELP_METHODS = [
  'getblockchaininfo',
  'getblock',
  'getblockheader',
  'getmempoolentry',
  'getrawtransaction',
  'getnewaddress',
  'getbalances',
  'getwalletinfo',
  'createwallet',
  'importmulti',
  'signrawtransactionwithwallet',
  'signrawtransactionwithkey',
  'getdescriptorinfo',
  'deriveaddresses',
];

let dir: string;
const failures: string[] = [];

async function save(name: string, method: string, params: unknown[] = []) {
  try {
    const result = await client.call(method, params);
    await writeFile(
      join(dir, `${name}.json`),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    console.log(`  saved  ${name}.json`);
    return result;
  } catch (err) {
    const msg =
      err instanceof RpcCallError ? `${err.code} ${err.message}` : String(err);
    failures.push(`${name}: ${msg}`);
    console.log(`  failed ${name}: ${msg}`);
    return undefined;
  }
}

async function main() {
  const withWallet = process.argv.includes('--wallet');

  const { chain } = await client.getBlockchainInfo();
  dir = join('tests', 'fixtures', chain);
  await mkdir(join(dir, 'help'), { recursive: true });
  console.log(`Chain: ${chain}, writing to ${dir}/\n`);

  console.log('Chain data');
  await save('getblockchaininfo', 'getblockchaininfo');
  await save('getnetworkinfo', 'getnetworkinfo');
  await save('getmempoolinfo', 'getmempoolinfo');

  const bestHash = await client.call<string>('getbestblockhash');
  const block = (await save('getblock', 'getblock', [bestHash])) as
    { tx: string[] } | undefined;
  await save('getblock-verbosity2', 'getblock', [bestHash, 2]);
  await save('getblockheader', 'getblockheader', [bestHash]);

  // The first tx is the coinbase; take a regular one when there is one.
  const txid = block?.tx[1] ?? block?.tx[0];
  if (txid) {
    await save('getrawtransaction', 'getrawtransaction', [
      txid,
      true,
      bestHash,
    ]);
  }

  const mempool = await client.call<string[]>('getrawmempool');
  if (mempool[0]) {
    await save('getmempoolentry', 'getmempoolentry', [mempool[0]]);
  } else {
    console.log('  skip   getmempoolentry (mempool is empty)');
  }

  if (withWallet) {
    console.log('\nWallet data');
    await save('getwalletinfo', 'getwalletinfo');
    await save('getbalances', 'getbalances');
    await save('listunspent', 'listunspent');
    const address = await client.getNewAddress();
    await save('getaddressinfo', 'getaddressinfo', [address]);
  }

  console.log('\nHelp text');
  for (const method of HELP_METHODS) {
    try {
      const text = await client.call<string>('help', [method]);
      await writeFile(join(dir, 'help', `${method}.txt`), `${text}\n`);
      console.log(`  saved  help/${method}.txt`);
    } catch (err) {
      failures.push(`help ${method}: ${String(err)}`);
      console.log(`  failed help ${method}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} failed:`);
    for (const f of failures) console.log(`  ${f}`);
    process.exitCode = 1;
  } else {
    console.log('\nDone.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
