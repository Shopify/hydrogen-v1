import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {
  ShopPayButton,
  getIdFromGid,
  DoublePropsErrorMessage,
  MissingPropsErrorMessage,
} from '../ShopPayButton.client.js';

jest.mock('../../../hooks/useLoadScript/useLoadScript.client', () => {
  return {
    useLoadScript: () => 'done',
  };
});

describe(`ShopPayButton`, () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error');
    consoleErrorSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it(`throws an error if you don't pass either variantIds or variantIdsAndQuantities`, () => {
    // @ts-expect-error Purposely not passing the correct props
    expect(() => mountWithProviders(<ShopPayButton />)).toThrowError(
      MissingPropsErrorMessage
    );
  });

  it(`throws an error if you pass both variantIds and variantIdsAndQuantities`, () => {
    expect(() =>
      mountWithProviders(
        // @ts-expect-error Purposely passing in both props when they shouyldn't be
        <ShopPayButton variantIds={[]} variantIdsAndQuantities={[]} />
      )
    ).toThrowError(DoublePropsErrorMessage);
  });

  it(`creates the correct attribute when using 'variantIds'`, () => {
    const fakeId = '123';

    const component = mountWithProviders(
      <ShopPayButton variantIds={[fakeId]} />
    );

    expect(component).toContainReactComponent('shop-pay-button', {
      variants: fakeId,
    });
  });

  it(`creates the correct attribute when using 'variantIdsAndQuantities'`, () => {
    const fakeId = '123';
    const fakeQuantity = 2;

    const component = mountWithProviders(
      <ShopPayButton
        variantIdsAndQuantities={[{id: fakeId, quantity: fakeQuantity}]}
      />
    );

    expect(component).toContainReactComponent('shop-pay-button', {
      variants: `${fakeId}:${fakeQuantity}`,
    });
  });

  it(`applies the css variable if 'width' exists`, () => {
    const component = mountWithProviders(
      <ShopPayButton
        width="100%"
        variantIdsAndQuantities={[{id: '123', quantity: 2}]}
      />
    );

    expect(component).toContainReactComponent('div', {
      style: {'--shop-pay-button-width': '100%'} as React.CSSProperties,
    });
  });

  describe(`getIdFromGid`, () => {
    it(`should handle undefined`, () => {
      expect(getIdFromGid()).toBe(undefined);
    });
  });
});
