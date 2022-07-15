import {STOREFRONT_API_BUYER_IP_HEADER} from '../../constants.js';
import {hashKey} from '../hash.js';

describe('Hash key for subrequests', () => {
  it('supports strings', () => {
    expect(hashKey('hello')).toEqual('hello');
  });

  it('supports arrays of strings', () => {
    expect(hashKey(['hello', 'world'])).toEqual('helloworld');
  });

  it('supports arrays of strings and objects', () => {
    expect(hashKey(['hello', {world: true}])).toEqual('hello{"world":true}');
  });

  it('supports useShopQuery-like keys', () => {
    expect(
      hashKey(['hello', 'world', {body: 'longquery', headers: {}}])
    ).toEqual('helloworldlongquery');

    expect(
      hashKey([
        'hello',
        'world',
        {body: 'longquery', headers: {[STOREFRONT_API_BUYER_IP_HEADER]: '42'}},
      ])
    ).toEqual('helloworldlongquery42');
  });

  it('does not choke on other types', () => {
    expect(
      hashKey([
        'hello',
        null,
        undefined,
        () => 'world',
        11,
        Infinity,
        new Map(),
        NaN,
        ['subarray'],
      ])
    ).toEqual('hello() => \'world\'11Infinity{}NaN["subarray"]');
  });
});
