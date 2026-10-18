import { makeClient } from './setup.js';

const client = makeClient();

describe('getBestBlockHash', () => {
  it('returns the tip hash matching getBlockHash at current height', async () => {
    const [best, count] = await Promise.all([
      client.getBestBlockHash(),
      client.getBlockCount(),
    ]);
    const tip = await client.getBlockHash(count);
    expect(best).toBe(tip);
    expect(best).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('getBlockHeader', () => {
  let bestHash: string;

  beforeAll(async () => {
    bestHash = await client.getBestBlockHash();
  });

  it('returns a header with expected fields', async () => {
    const header = await client.getBlockHeader(bestHash);
    expect(header.hash).toBe(bestHash);
    expect(typeof header.height).toBe('number');
    expect(typeof header.time).toBe('number');
    expect(typeof header.merkleroot).toBe('string');
    expect(typeof header.chainwork).toBe('string');
  });

  it('returns hex string when verbose is false', async () => {
    const hex = await client.getBlockHeader(bestHash, false);
    expect(typeof hex).toBe('string');
    expect(hex).toMatch(/^[0-9a-f]+$/);
  });
});

describe('getTxOut', () => {
  it('returns null for a non-existent output', async () => {
    const result = await client.getTxOut(
      '0000000000000000000000000000000000000000000000000000000000000000',
      0,
    );
    expect(result).toBeNull();
  });

  it('returns output details for an unspent coinbase output', async () => {
    const count = await client.getBlockCount();
    const hash = await client.getBlockHash(count);
    const block = await client.getBlock(hash);
    const coinbaseTxid = block.tx[0]!.txid;
    const result = await client.getTxOut(coinbaseTxid, 0);
    if (!result) return;
    expect(typeof result.value).toBe('number');
    expect(typeof result.confirmations).toBe('number');
    expect(result.scriptPubKey).toBeDefined();
    expect(typeof result.coinbase).toBe('boolean');
  });
});

describe('listUnspent', () => {
  it('returns an array of unspent outputs', async () => {
    const utxos = await client.listUnspent();
    expect(Array.isArray(utxos)).toBe(true);
    if (utxos.length === 0) return;
    const utxo = utxos[0]!;
    expect(typeof utxo.txid).toBe('string');
    expect(typeof utxo.vout).toBe('number');
    expect(typeof utxo.amount).toBe('number');
    expect(typeof utxo.confirmations).toBe('number');
    expect(typeof utxo.spendable).toBe('boolean');
  });

  it('respects minconf filter', async () => {
    const utxos = await client.listUnspent(9999999);
    expect(Array.isArray(utxos)).toBe(true);
    expect(utxos.length).toBe(0);
  });
});
