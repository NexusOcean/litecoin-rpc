import { makeClient } from './setup.js';

const client = makeClient();

describe('getNetworkInfo', () => {
  it('returns network info with expected fields', async () => {
    const info = await client.getNetworkInfo();
    expect(typeof info.version).toBe('number');
    expect(typeof info.subversion).toBe('string');
    expect(typeof info.protocolversion).toBe('number');
    expect(typeof info.connections).toBe('number');
    expect(typeof info.networkactive).toBe('boolean');
    expect(typeof info.relayfee).toBe('number');
    expect(Array.isArray(info.networks)).toBe(true);
  });
});

describe('getPeerInfo', () => {
  it('returns an array of peers with expected fields', async () => {
    const peers = await client.getPeerInfo();
    expect(Array.isArray(peers)).toBe(true);
    expect(peers.length).toBeGreaterThan(0);
    const peer = peers[0]!;
    expect(typeof peer.id).toBe('number');
    expect(typeof peer.addr).toBe('string');
    expect(typeof peer.version).toBe('number');
    expect(typeof peer.inbound).toBe('boolean');
    expect(typeof peer.synced_blocks).toBe('number');
    expect(typeof peer.bytessent_per_msg).toBe('object');
    expect(typeof peer.bytesrecv_per_msg).toBe('object');
  });
});
