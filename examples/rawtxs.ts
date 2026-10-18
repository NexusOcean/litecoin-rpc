/**
 * Raw Transactions
 *
 * Demonstrates the full raw transaction lifecycle:
 * create → decode → fund → sign → (optionally) broadcast.
 *
 * Does NOT broadcast by default — pass --send to actually submit.
 *
 * Usage:
 *   npx tsx examples/rawtxs.ts
 *   npx tsx examples/rawtxs.ts --send
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
  const shouldSend = process.argv.includes('--send');

  const unspent = await client.listUnspent(1);
  const utxo = unspent.find((u) => u.spendable && u.address);
  if (!utxo) {
    console.error('No spendable outputs available');
    process.exit(1);
  }
  console.log(`Using UTXO: ${utxo.txid}:${utxo.vout} (${utxo.amount} LTC)`);

  const amount = parseFloat((utxo.amount - 0.0001).toFixed(8));
  const rawHex = await client.createRawTransaction(
    [{ txid: utxo.txid, vout: utxo.vout }],
    { [utxo.address as string]: amount },
  );
  console.log(`\nCreated raw tx (${rawHex.length / 2} bytes)`);

  const decoded = await client.decodeRawTransaction(rawHex);
  console.log(`\nDecoded:`);
  console.log(`  txid:     ${decoded.txid}`);
  console.log(`  inputs:   ${decoded.vin.length}`);
  console.log(`  outputs:  ${decoded.vout.length}`);
  console.log(`  locktime: ${decoded.locktime}`);

  const scriptHex = decoded.vout[0]!.scriptPubKey.hex;
  const script = await client.decodeScript(scriptHex);
  console.log(`\nOutput script:`);
  console.log(`  type: ${script.type}`);
  console.log(`  asm:  ${script.asm}`);

  const signed = await client.signRawTransaction(rawHex);
  console.log(`\nSigned: complete=${signed.complete}`);

  if (!signed.complete) {
    console.error('Transaction signing incomplete — aborting');
    process.exit(1);
  }

  if (shouldSend) {
    const txid = await client.sendRawTransaction(signed.hex);
    console.log(`\nBroadcast txid: ${txid}`);
  } else {
    console.log('\nDry run complete. Pass --send to broadcast.');
    console.log(`Signed hex: ${signed.hex.slice(0, 64)}...`);
  }
}

main().catch(console.error);
