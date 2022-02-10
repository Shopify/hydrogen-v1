import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ShopPayButton} from '../ShopPayButton.client';

jest.mock('../../../hooks/useLoadScript/useLoadScript', () => {
  return {
    useLoadScript: () => 'done',
  };
});

describe(`ShopPayButton`, () => {
  it(`throws an error if you don't pass either variantIds or variantIdsAndQuantities`, () => {
    // @ts-expect-error Purposely not passing the correct props
    expect(() => mountWithProviders(<ShopPayButton />)).toThrowError();
  });

  it(`throws an error if you pass both variantIds and variantIdsAndQuantities`, () => {
    expect(() =>
      mountWithProviders(
        // @ts-expect-error Purposely passing in both props when they shouyldn't be
        <ShopPayButton variantIds={[]} variantIdsAndQuantities={[]} />
      )
    ).toThrowError();
  });

  it(`creates the correct attribute when using 'variantIds'`, () => {
    const fakeId = '123';

    // TODO: SFAPI has gids in 2022-01. Remove this in 2022-04
    const fakeGid = btoa('123');

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
    const fakeGid = btoa('123');

    const component = mountWithProviders(
      <ShopPayButton
        variantIdsAndQuantities={[{id: fakeGid, quantity: fakeQuantity}]}
      />
    );

    expect(component).toContainReactComponent('shop-pay-button', {
      variants: `${fakeId}:${fakeQuantity}`,
    });
  });
});
