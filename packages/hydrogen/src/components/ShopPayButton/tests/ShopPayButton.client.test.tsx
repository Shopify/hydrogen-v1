import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {
  ShopPayButton,
  getIdFromGid,
  DoublePropsErrorMessage,
  MissingPropsErrorMessage,
} from '../ShopPayButton.client';

jest.mock('../../../hooks/useLoadScript/useLoadScript', () => {
  return {
    useLoadScript: () => 'done',
  };
});

describe(`ShopPayButton`, () => {
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

    // TODO: SFAPI has gids in 2022-01. Remove this in 2022-04
    const fakeGid = window.btoa('123');

    const component = mountWithProviders(
      <ShopPayButton variantIds={[fakeGid]} />
    );

    expect(component).toContainReactComponent('shop-pay-button', {
      variants: fakeId,
    });
  });

  it(`creates the correct attribute when using 'variantIdsAndQuantities'`, () => {
    const fakeId = '123';
    const fakeQuantity = 2;

    // TODO: SFAPI has gids in 2022-01. Remove this in 2022-04
    const fakeGid = window.btoa('123');

    const component = mountWithProviders(
      <ShopPayButton
        variantIdsAndQuantities={[{id: fakeGid, quantity: fakeQuantity}]}
      />
    );

    expect(component).toContainReactComponent('shop-pay-button', {
      variants: `${fakeId}:${fakeQuantity}`,
    });
  });

  describe(`getIdFromGid`, () => {
    it(`should handle undefined`, () => {
      expect(getIdFromGid()).toBe(undefined);
    });

    it(`should handle when 'window.atob' exists, such as browsers`, () => {
      // Test can be removed when we upgrade from SFAPI 2022-01 to 2022-04
      expect(getIdFromGid(window.btoa('123'))).toBe('123');
    });

    it(`should handle when 'window.atob' doesn't exist, such as node / workers`, () => {
      // Test can be removed when we upgrade from SFAPI 2022-01 to 2022-04
      const oldAtob = window.atob;
      // @ts-ignore
      delete window.atob;
      expect(getIdFromGid(window.btoa('123'))).toBe('123');
      window.atob = oldAtob;
    });
  });
});
