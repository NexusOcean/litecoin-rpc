/**
 * Network Dashboard
 *
 * Inspect node connectivity and peer health.
 * Useful for node monitoring tools, masternode dashboards, or network visualizers.
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

async function networkSummary() {
  const [networkInfo, peers, chainInfo] = await Promise.all([
    client.getNetworkInfo(),
    client.getPeerInfo(),
    client.getBlockchainInfo(),
  ]);

  console.log(`Node version:    ${networkInfo.subversion}`);
  console.log(`Protocol:        ${networkInfo.protocolversion}`);
  console.log(`Connections:     ${networkInfo.connections}`);
  console.log(`Chain:           ${chainInfo.chain}`);
  console.log(`Blocks:          ${chainInfo.blocks}`);
  console.log(
    `Verification:    ${(chainInfo.verificationprogress * 100).toFixed(2)}%`,
  );

  console.log(`\nPeers (${peers.length}):`);
  for (const peer of peers) {
    const direction = peer.inbound ? 'inbound ' : 'outbound';
    console.log(`  [${direction}] ${peer.addr} — version: ${peer.subver}`);
  }
}

networkSummary().catch(console.error);
