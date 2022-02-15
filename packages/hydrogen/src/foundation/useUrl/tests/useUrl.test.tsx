import React from 'react';
import {mount} from '@shopify/react-testing';

import {useUrl} from '../useUrl';

function FakeComponent({callbackSpy}: {callbackSpy: jest.Mock<any, any>}) {
  const url = useUrl();
  callbackSpy(url);
  return null;
}

describe('useUrl()', () => {
  describe('SSR', () => {
    let mockUrl = '';

    beforeAll(() => {
      jest.doMock('../../ssr-interop', () => ({
        META_ENV_SSR: true,
        useEnvContext: () => ({url: mockUrl}),
      }));
    });

    it('returns url object using useServerRequest url', () => {
      mockUrl =
        'https://hydrogen-preview.myshopify.com/collections/freestyle-collection';

      const callbackSpy = jest.fn();

      mount(<FakeComponent callbackSpy={callbackSpy} />);
      expect(callbackSpy).toHaveBeenCalledWith(new URL(mockUrl));
    });

    it('returns url object using a parsed url from state param when the pathname is /react', () => {
      mockUrl =
        'https://hydrogen-preview.myshopify.com/react?state=%7B%22pathname%22%3A%22%2Fproducts%2Fmail-it-in-freestyle-snowboard%3Ftest%3D123%26something-else%3Danother';

      const callbackSpy = jest.fn();

      mount(<FakeComponent callbackSpy={callbackSpy} />);
      expect(callbackSpy).toHaveBeenCalledWith(
        new URL(
          'https://hydrogen-preview.myshopify.com/products/mail-it-in-freestyle-snowboard?test=123&something-else=another'
        )
      );
    });
  });

  describe('non SSR', () => {
    const oldLocation = window.location;

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          href: '',
        },
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', oldLocation);
    });

    it('returns url object using windows.location.href', () => {
      const mockUrl =
        'https://hydrogen-preview.myshopify.com/products/mail-it-in-freestyle-snowboard';
      window.location.href = mockUrl;
      const callbackSpy = jest.fn();

      mount(<FakeComponent callbackSpy={callbackSpy} />);
      expect(callbackSpy).toHaveBeenCalledWith(new URL(mockUrl));
    });
  });
});
