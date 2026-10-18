/**
 * Fees
 *
 * Estimate transaction fees and fee rates for confirmation within
 * a target number of blocks.
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

async function main(nblocks: number = 5) {
  const blocks = Math.round(nblocks);

  const [feeRate, estimatedFee, smartFee] = await Promise.all([
    client.getFeeRate(),
    client.estimateFee(blocks),
    client.estimateSmartFee(blocks),
  ]);

  console.log(`Target:        ${blocks} blocks`);
  console.log(`Fee rate:      ${JSON.stringify(feeRate)}`);
  console.log(`Estimated fee: ${estimatedFee} LTC`);
  console.log(`Smart fee:     ${JSON.stringify(smartFee)}`);
}

main().catch(console.error);
