/**
 * Mempool Monitor
 *
 * Poll the mempool for unconfirmed transactions.
 * Useful for real-time dashboards, fee estimators, or alert systems.
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

async function snapshot() {
  const info = await client.getMempoolInfo();
  const mempool = await client.getRawMempool();
  const txids = Object.keys(mempool);

  console.log(
    `Mempool: ${info.size} txs, ${(info.bytes / 1024).toFixed(1)} KB`,
  );

  for (const txid of txids.slice(0, 5)) {
    const entry = mempool[txid]!;
    console.log(
      `\ttx: ${txid.slice(0, 16)}... entered at: ${new Date(entry.time * 1000).toLocaleTimeString('sv-SE', { timeZone: 'UTC' })}`,
    );
  }
}

async function monitor(intervalMs = 30_000, iterations = 5) {
  console.log(
    `Monitoring mempool every ${intervalMs / 1000}s for ${iterations} iterations...\n`,
  );

  do {
    --iterations;

    await snapshot();
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  } while (0 < iterations);
}

monitor()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
