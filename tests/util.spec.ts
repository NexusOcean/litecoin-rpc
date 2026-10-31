import { makeClient } from './setup.js';

const client = makeClient();

let address: string;
let addrDescriptor: string;

beforeAll(async () => {
  address = await client.getNewAddress();
  const info = await client.getDescriptorInfo(`addr(${address})`);
  addrDescriptor = info.descriptor;
});

describe('getDescriptorInfo', () => {
  it('returns a checksummed descriptor for an addr() descriptor', async () => {
    const info = await client.getDescriptorInfo(`addr(${address})`);
    expect(info.descriptor).toMatch(/^addr\(.+\)#[a-z0-9]{8}$/);
    expect(info.checksum).toMatch(/^[a-z0-9]{8}$/);
    expect(info.isrange).toBe(false);
    expect(info.issolvable).toBe(false);
    expect(info.hasprivatekeys).toBe(false);
  });

  it('describes a wallet address descriptor as solvable', async () => {
    const { desc } = await client.getAddressInfo(address);
    if (!desc) return;
    const info = await client.getDescriptorInfo(desc);
    expect(info.issolvable).toBe(true);
    expect(info.isrange).toBe(false);
  });

  it('rejects an invalid descriptor', async () => {
    await expect(
      client.getDescriptorInfo('not-a-descriptor'),
    ).rejects.toMatchObject({ name: 'RpcCallError' });
  });
});

describe('deriveAddresses', () => {
  it('derives the original address from its addr() descriptor', async () => {
    const addresses = await client.deriveAddresses(addrDescriptor);
    expect(addresses).toEqual([address]);
  });

  it('rejects a descriptor without a checksum', async () => {
    await expect(
      client.deriveAddresses(`addr(${address})`),
    ).rejects.toMatchObject({ name: 'RpcCallError' });
  });

  it('rejects a range on a non-ranged descriptor', async () => {
    await expect(
      client.deriveAddresses(addrDescriptor, [0, 2]),
    ).rejects.toMatchObject({ name: 'RpcCallError' });
  });
});
