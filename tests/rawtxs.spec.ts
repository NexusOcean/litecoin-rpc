import { makeClient } from './setup.js';

const client = makeClient();

let rawHex: string;
let utxo: Awaited<ReturnType<typeof client.listUnspent>>[number] | undefined;

beforeAll(async () => {
  const unspent = await client.listUnspent(1);
  utxo = unspent.find((u) => u.spendable && u.address);
  if (utxo) {
    rawHex = await client.createRawTransaction(
      [{ txid: utxo.txid, vout: utxo.vout }],
      {
        [utxo.address as string]: parseFloat((utxo.amount - 0.0001).toFixed(8)),
      },
    );
  }
});

describe('createRawTransaction', () => {
  it('returns a non-empty hex string', async () => {
    if (!utxo) return;
    expect(typeof rawHex).toBe('string');
    expect(rawHex.length).toBeGreaterThan(0);
    expect(rawHex).toMatch(/^[0-9a-f]+$/);
  });
});

describe('decodeRawTransaction', () => {
  it('returns a decoded transaction with expected fields', async () => {
    if (!utxo) return;
    const tx = await client.decodeRawTransaction(rawHex);
    expect(typeof tx.txid).toBe('string');
    expect(tx.txid).toMatch(/^[0-9a-f]{64}$/);
    expect(typeof tx.version).toBe('number');
    expect(typeof tx.locktime).toBe('number');
    expect(Array.isArray(tx.vin)).toBe(true);
    expect(Array.isArray(tx.vout)).toBe(true);
    expect(tx.vin.length).toBeGreaterThan(0);
    expect(tx.vout.length).toBeGreaterThan(0);
  });
});

describe('decodeScript', () => {
  it('returns decoded script with expected fields', async () => {
    if (!utxo) return;
    const tx = await client.decodeRawTransaction(rawHex);
    const scriptHex = tx.vout[0]!.scriptPubKey.hex;
    const result = await client.decodeScript(scriptHex);
    expect(typeof result.asm).toBe('string');
    expect(typeof result.type).toBe('string');
  });
});

describe('fundRawTransaction', () => {
  it('returns funded hex with fee and changepos', async () => {
    if (!utxo) return;
    const unfunded = await client.createRawTransaction([], {
      [utxo.address as string]: 0.001,
    });
    const result = await client.fundRawTransaction(unfunded);
    expect(typeof result.hex).toBe('string');
    expect(result.hex.length).toBeGreaterThan(0);
    expect(typeof result.fee).toBe('number');
    expect(result.fee).toBeGreaterThan(0);
    expect(typeof result.changepos).toBe('number');
  });
});

describe('signRawTransaction', () => {
  it('returns signed hex and complete flag', async () => {
    if (!utxo) return;
    const result = await client.signRawTransaction(rawHex);
    expect(typeof result.hex).toBe('string');
    expect(result.hex.length).toBeGreaterThan(0);
    expect(typeof result.complete).toBe('boolean');
  });
});

describe('sendRawTransaction', () => {
  it('rejects an unsigned transaction with a validation error', async () => {
    if (!utxo) return;
    await expect(client.sendRawTransaction(rawHex)).rejects.toMatchObject({
      code: expect.any(Number),
    });
  });
});
