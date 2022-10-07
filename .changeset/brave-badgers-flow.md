---
'@shopify/hydrogen': minor
---

Special thank you to @kcarra for adding new mocked Providers for making testing easier!

1. Add `ServerRequestProvider` mock for testing server components:

```ts
import useServerHook from './useServerHook.server'; // Server hook to test
import {test, vi} from 'vitest';
import {renderHook} from '@testing-library/react-hooks';
import {ShopifyProvider} from '@shopify/hydrogen';
import {MockedServerRequestProvider} from '@shopify/hydrogen/testing';

describe('useServerHook', () => {
  test('mocked ServerRequest Context', () => {
    const wrapper = ({children}: {children: React.ReactElement}) => (
      <MockedServerRequestProvider>
        <ShopifyProvider shopifyConfig={mockShopifyConfig}>
          {children}
        </ShopifyProvider>
      </MockedServerRequestProvider>
    );
    const {result} = renderHook(() => useServerHook(), {wrapper});
    expect(result.current).toEqual({status: 'active'});
  });
});
```

2. Add `ShopifyTestProviders` mock for easier testing client components and using client components in other contexts, like Storybook:

```ts
import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import BoxCardUI from './BoxCard.ui';
import {ShopifyTestProviders} from '@shopify/hydrogen/testing';

export default {
  title: 'Components/BoxCard',
  component: BoxCardUI,
  decorators: [],
} as ComponentMeta<typeof BoxCardUI>;

const Template: ComponentStory<typeof BoxCardUI> = (args) => {
  return (
    <ShopifyTestProviders>
      <BoxCardUI {...args} /> // This component imports import{' '}
      {(Image, Link, Money)} from '@shopify/hydrogen'
    </ShopifyTestProviders>
  );
};

export const BoxCard = Template.bind({});
BoxCard.args = mockShopifyProduct;
```
