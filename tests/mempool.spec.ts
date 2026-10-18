import { makeClient } from './setup.js';
import { RpcCallError } from '../src/index.js';

const client = makeClient();

describe('getMempoolInfo', () => {
  it('returns mempool info with expected fields', async () => {
    const info = await client.getMempoolInfo();
    expect(typeof info.size).toBe('number');
    expect(typeof info.bytes).toBe('number');
    expect(typeof info.usage).toBe('number');
    expect(typeof info.maxmempool).toBe('number');
  });
});

describe('getRawMempool', () => {
  it('returns a record of txid to mempool entry', async () => {
    const mempool = await client.getRawMempool();
    expect(typeof mempool).toBe('object');
    const entries = Object.values(mempool);
    if (entries.length > 0) {
      const entry = entries[0]!;
      expect(typeof entry.vsize).toBe('number');
      expect(typeof entry.fees.base).toBe('number');
      expect(typeof entry.time).toBe('number');
      expect(Array.isArray(entry.depends)).toBe(true);
    }
  });

  it('returns an array of txids when verbose is false', async () => {
    const txids = await client.getRawMempool(false);
    expect(Array.isArray(txids)).toBe(true);
  });
});

describe('getMempoolEntry', () => {
  it('throws RpcCallError for a txid not in mempool', async () => {
    const fakeTxid = 'a'.repeat(64);
    await expect(client.getMempoolEntry(fakeTxid)).rejects.toBeInstanceOf(
      RpcCallError,
    );
  });
});
