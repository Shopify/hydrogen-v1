import {compose, padBreak} from '../markdown';

describe('markdown', () => {
  describe('compose()', () => {
    it('composes functions', () => {
      const fn1 = (val: string) => `fn1(${val})`;
      const fn2 = (val: string) => `fn2(${val})`;
      const fn3 = (val: string) => `fn3(${val})`;
      const composedFunction = compose(fn1, fn2, fn3);
      expect(composedFunction('inner')).toBe('fn1(fn2(fn3(inner)))');
    });
  });

  describe('padBreak()', () => {
    it('adds a single line break to an array of a single string by default', () => {
      expect(padBreak(['one'])).toEqual([`one\n`]);
    });
    it('adds a multiple line breaks to an array of a single string', () => {
      expect(padBreak(['one'], 3)).toEqual([`one\n\n\n`]);
    });
    it('supports an array of multiple strings', () => {
      expect(padBreak(['one', 'two'], 2)).toEqual([`one\n\n`, `two\n\n`]);
    });
  });
});
