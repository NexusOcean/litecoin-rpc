import {
  makeClient,
  maybeDescribeAddress,
  maybeDescribeSpentInfo,
  ADDRESS,
  SPENT_TXID,
  SPENT_INDEX,
} from './setup.js';

const client = makeClient();

maybeDescribeAddress('getAddressBalance', () => {
  it('returns balance fields for a known address', async () => {
    const balance = await client.getAddressBalance(ADDRESS);
    expect(typeof balance.balance).toBe('number');
    expect(typeof balance.received).toBe('number');
  });
});

maybeDescribeAddress('getAddressTxIds', () => {
  it('returns an array of txids for a known address', async () => {
    const txids = await client.getAddressTxIds(ADDRESS);
    expect(Array.isArray(txids)).toBe(true);
  });
});

maybeDescribeAddress('getAddressDeltas', () => {
  it('returns deltas with expected fields', async () => {
    const deltas = await client.getAddressDeltas([ADDRESS]);
    expect(Array.isArray(deltas)).toBe(true);
    expect(deltas.length).toBeGreaterThan(0);
    for (const delta of deltas) {
      expect(typeof delta.satoshis).toBe('number');
      expect(typeof delta.txid).toBe('string');
      expect(typeof delta.index).toBe('number');
      expect(typeof delta.blockindex).toBe('number');
      expect(typeof delta.height).toBe('number');
      expect(delta.address).toBe(ADDRESS);
    }
  });
});

maybeDescribeAddress('getAddressMempool', () => {
  it('returns an array of mempool deltas', async () => {
    const mempool = await client.getAddressMempool([ADDRESS]);
    expect(Array.isArray(mempool)).toBe(true);
    for (const entry of mempool) {
      expect(typeof entry.address).toBe('string');
      expect(typeof entry.txid).toBe('string');
      expect(typeof entry.index).toBe('number');
      expect(typeof entry.satoshis).toBe('number');
      expect(typeof entry.timestamp).toBe('number');
    }
  });
});

maybeDescribeAddress('getAddressUtxos', () => {
  it('returns an array of utxos with expected fields', async () => {
    const utxos = await client.getAddressUtxos([ADDRESS]);
    expect(Array.isArray(utxos)).toBe(true);
    for (const utxo of utxos) {
      expect(typeof utxo.address).toBe('string');
      expect(typeof utxo.txid).toBe('string');
      expect(typeof utxo.outputIndex).toBe('number');
      expect(typeof utxo.script).toBe('string');
      expect(typeof utxo.satoshis).toBe('number');
      expect(typeof utxo.height).toBe('number');
    }
  });
});

maybeDescribeSpentInfo('getSpentInfo', () => {
  it('returns the spending txid and index', async () => {
    const result = await client.getSpentInfo(SPENT_TXID, SPENT_INDEX);
    expect(typeof result.txid).toBe('string');
    expect(typeof result.index).toBe('number');
  });
});
