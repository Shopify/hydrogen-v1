import React from 'react';
import {mount} from '@shopify/react-testing';

import {useCurrentUrl} from '../useCurrentUrl';

jest.mock('../../ServerRequestProvider', () => ({
  useServerRequest: jest.fn(),
}));

const useServerRequestMock = jest.requireMock(
  '../../ServerRequestProvider'
).useServerRequest;

function FakeComponent({callbackSpy}: {callbackSpy: jest.Mock<any, any>}) {
  const url = useCurrentUrl();
  callbackSpy(url);
  return null;
}

describe('useCurrentUrl()', () => {
  beforeEach(() => {
    useServerRequestMock.mockReset();
  });

  describe('SSR', () => {
    beforeAll(() => {
      jest.doMock('../../../utilities/meta-env-ssr', () => ({
        META_ENV_SSR: true,
      }));
    });

    it('returns url object using useServerRequest url', () => {
      const mockUrl =
        'https://hydrogen-preview.myshopify.com/collections/freestyle-collection';

      useServerRequestMock.mockReturnValue({url: mockUrl});

      const callbackSpy = jest.fn();

      mount(<FakeComponent callbackSpy={callbackSpy} />);
      expect(callbackSpy).toHaveBeenCalledWith(new URL(mockUrl));
    });

    it('returns url object using a parsed url from state param when the pathname is /react', () => {
      const mockUrl =
        'https://hydrogen-preview.myshopify.com/react?state=%7B%22pathname%22%3A%22%2Fproducts%2Fmail-it-in-freestyle-snowboard%3Ftest%3D123%26something-else%3Danother';

      useServerRequestMock.mockReturnValue({url: mockUrl});

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
    beforeAll(() => {
      jest.doMock('../../../utilities/meta-env-ssr', () => ({
        META_ENV_SSR: false,
      }));
    });

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
