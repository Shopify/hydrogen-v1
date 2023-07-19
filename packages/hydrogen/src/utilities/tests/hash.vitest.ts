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
    expect(hashKey(['hello', {world: true}])).toEqual(
      'hello%7B%22world%22%3Atrue%7D'
    );
  });

  it('supports useShopQuery-like keys', () => {
    expect(
      hashKey(['hello', 'world', {body: 'longquery', headers: {}}])
    ).toEqual('helloworldlongquery');
  });

  it('does not include any buyer-specific information in hashes', () => {
    expect(
      hashKey([
        'hello',
        'world',
        {body: 'longquery', headers: {[STOREFRONT_API_BUYER_IP_HEADER]: '42'}},
      ])
    ).toEqual('helloworldlongquery');
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
    ).toEqual(
      'hello()%20%3D%3E%20%22world%2211Infinity%7B%7DNaN%5B%22subarray%22%5D'
    );
  });
});
