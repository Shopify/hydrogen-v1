import React from 'react';
import * as hooks from '../useParsedMetafields';
import {mount} from '@shopify/react-testing';
import {
  getParsedMetafield,
  getRawMetafield,
} from '../../../utilities/tests/metafields';
import type {MetafieldConnection} from '../../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

describe('useParsedMetafields', () => {
  it('returns an array of parsed metafields', () => {
    const hookSpy = jest.spyOn(hooks, 'useParsedMetafields');
    const metafields = [
      getRawMetafield({type: 'weight'}),
      getRawMetafield({type: 'volume'}),
      getRawMetafield({type: 'dimension'}),
      getRawMetafield({type: 'number_integer'}),
      getRawMetafield({type: 'number_decimal'}),
      getRawMetafield({type: 'json'}),
      getRawMetafield({type: 'date'}),
      getRawMetafield({type: 'date_time'}),
      getRawMetafield({type: 'color'}),
      getRawMetafield({type: 'rating'}),
    ];
    const parsedMetafields = [
      getParsedMetafield(metafields[0] as any),
      getParsedMetafield(metafields[1] as any),
      getParsedMetafield(metafields[2] as any),
      getParsedMetafield(metafields[3] as any),
      getParsedMetafield(metafields[4] as any),
      getParsedMetafield(metafields[5] as any),
      getParsedMetafield(metafields[6] as any),
      getParsedMetafield(metafields[7] as any),
      getParsedMetafield(metafields[8] as any),
      getParsedMetafield(metafields[9] as any),
    ];
    mount(
      <MyComponent
        metafields={{
          edges: metafields.map((metafield) => {
            return {node: metafield};
          }),
        }}
      />
    );

    expect(hookSpy).toReturnWith(parsedMetafields);
  });
});

function MyComponent({
  metafields,
}: {
  metafields: PartialDeep<MetafieldConnection>;
}) {
  hooks.useParsedMetafields(metafields);
  return null;
}
