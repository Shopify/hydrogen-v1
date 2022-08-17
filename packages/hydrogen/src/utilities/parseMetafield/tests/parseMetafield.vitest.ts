import {parseMetafieldValue} from '../parseMetafield.js';
import {getRawMetafield} from '../../tests/metafields.js';

describe(`parseMetafieldValue()`, () => {
  describe(`handles the different types`, () => {
    it(`boolean`, () => {
      const metafield = getRawMetafield({type: 'boolean', value: 'true'});
      expect(parseMetafieldValue(metafield)).toBe(true);
    });

    it(`number_integer`, () => {
      const metafield = getRawMetafield({type: 'number_integer', value: '7'});
      expect(parseMetafieldValue(metafield)).toBe(7);
    });

    it(`number_decimal`, () => {
      const metafield = getRawMetafield({
        type: 'number_decimal',
        value: '7.77',
      });
      expect(parseMetafieldValue(metafield)).toBe(7.77);
    });

    it(`date`, () => {
      const metafield = getRawMetafield({type: 'date', value: '2022-02-02'});
      expect(parseMetafieldValue(metafield)).toEqual(new Date('2022-02-02'));
    });

    it(`date_time`, () => {
      const metafield = getRawMetafield({
        type: 'date',
        value: '2022-01-01T12:30:00',
      });
      expect(parseMetafieldValue(metafield)).toEqual(
        new Date('2022-01-01T12:30:00')
      );
    });

    it(`json`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({hey: 'hi'}),
      });
      expect(parseMetafieldValue(metafield)).toEqual({hey: 'hi'});
    });

    it(`weight`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: 2.5,
          unit: 'kg',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: 2.5,
        unit: 'kg',
      });
    });

    it(`dimension`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: 25.0,
          unit: 'cm',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: 25.0,
        unit: 'cm',
      });
    });

    it(`volume`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: 20.0,
          unit: 'ml',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: 20.0,
        unit: 'ml',
      });
    });

    it(`rating`, () => {
      const metafield = getRawMetafield({
        type: 'json',
        value: JSON.stringify({
          value: '3.5',
          scale_min: '1.0',
          scale_max: '5.0',
        }),
      });
      expect(parseMetafieldValue(metafield)).toEqual({
        value: '3.5',
        scale_min: '1.0',
        scale_max: '5.0',
      });
    });

    it(`default`, () => {
      const metafield = getRawMetafield({
        type: 'url',
        value: 'test',
      });

      expect(parseMetafieldValue(metafield)).toBe('test');
    });
  });

  it(`handles if null is passed`, () => {
    expect(parseMetafieldValue(null)).toBeNull();
  });
});
