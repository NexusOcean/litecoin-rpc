import { makeClient } from './setup.js';

const client = makeClient();

let bestHash: string;

beforeAll(async () => {
  const blockCount = await client.getBlockCount();
  bestHash = await client.getBlockHash(blockCount);
});

describe('getRawTransaction', () => {
  it('returns a coinbase transaction with expected fields', async () => {
    const block = await client.getBlock(bestHash);
    const txid = block.tx[0]!.txid;
    const tx = await client.getRawTransaction(txid, true, bestHash);
    expect(tx.txid).toBe(txid);
    expect(typeof tx.hex).toBe('string');
    expect(tx.vin[0]).toHaveProperty('coinbase');
  });

  it('returns a standard transaction with prevout vin fields', async () => {
    const block = await client.getBlock(bestHash);
    const standardTx = block.tx[1];
    if (!standardTx) return;
    const tx = await client.getRawTransaction(standardTx.txid, true, bestHash);
    const vin = tx.vin[0]! as { txid?: string; vout?: number };
    expect(typeof vin.txid).toBe('string');
    expect(typeof vin.vout).toBe('number');
  });

  it('returns hex string when verbose is false', async () => {
    const block = await client.getBlock(bestHash);
    const txid = block.tx[0]!.txid;
    const hex = await client.getRawTransaction(txid, false, bestHash);
    expect(typeof hex).toBe('string');
    expect(hex).toMatch(/^[0-9a-f]+$/);
  });
});
