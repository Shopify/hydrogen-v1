import {htmlDecode, htmlEncode} from '../html';

describe('html', () => {
  describe('htmlEncode', () => {
    it('encodes things properly', () => {
      expect(htmlEncode('<div>')).toBe('&lt;div&gt;');
      expect(
        htmlEncode(`S1:"react.suspense"
M2:{"id":"ShopifyProvider-MTY2NjM5NzU1NQ","name":"ShopifyProviderClient"}`)
      ).toBe(`S1:&quot;react.suspense&quot;
M2:{&quot;id&quot;:&quot;ShopifyProvider-MTY2NjM5NzU1NQ&quot;,&quot;name&quot;:&quot;ShopifyProviderClient&quot;}`);
      expect(htmlEncode(`how's it going?`)).toBe(`how&#39;s it going?`);
    });
  });

  describe('htmlDecode', () => {
    it('decodes things properly', () => {
      expect(htmlDecode('&lt;div&gt;')).toBe('<div>');
      expect(
        htmlDecode(`S1:&quot;react.suspense&quot;
M2:{&quot;id&quot;:&quot;ShopifyProvider-MTY2NjM5NzU1NQ&quot;,&quot;name&quot;:&quot;ShopifyProviderClient&quot;}`)
      ).toBe(`S1:"react.suspense"
M2:{"id":"ShopifyProvider-MTY2NjM5NzU1NQ","name":"ShopifyProviderClient"}`);
    });
  });
});
