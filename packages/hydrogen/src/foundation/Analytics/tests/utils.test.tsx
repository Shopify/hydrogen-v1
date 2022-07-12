import {getNamedspacedEventname} from '../utils.js';

describe('Analytics - utils', () => {
  it('should return not namespaced event name when it is part of reserve name list', () => {
    expect(getNamedspacedEventname('page-view')).toEqual('page-view');
    expect(getNamedspacedEventname('viewed-product')).toEqual('viewed-product');
    expect(getNamedspacedEventname('add-to-cart')).toEqual('add-to-cart');
    expect(getNamedspacedEventname('remove-from-cart')).toEqual(
      'remove-from-cart'
    );
    expect(getNamedspacedEventname('update-cart')).toEqual('update-cart');
    expect(getNamedspacedEventname('discount-code-updated')).toEqual(
      'discount-code-updated'
    );
    expect(getNamedspacedEventname('performance')).toEqual('performance');
  });

  it('should return namespaced event name when it is not part of reserve name list', () => {
    expect(getNamedspacedEventname('accept-marketing')).toEqual(
      'c-accept-marketing'
    );
    expect(getNamedspacedEventname('my-add-to-cart')).toEqual(
      'c-my-add-to-cart'
    );
  });
});
