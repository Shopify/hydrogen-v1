import * as React from 'react';
import type {Story} from '@ladle/react';
import {Image, type ShopifyImageProps} from './Image.js';

const Template: Story<{
  'data.url': ShopifyImageProps['data']['url'];
  'data.width': ShopifyImageProps['data']['width'];
  'data.height': ShopifyImageProps['data']['height'];
  width: ShopifyImageProps['width'];
  height: ShopifyImageProps['height'];
}> = (props) => {
  const finalProps: ShopifyImageProps = {
    data: {
      url: props['data.url'] ?? 'test.com',
      width: props['data.width'],
      height: props['data.height'],
    },
    width: props.width,
    height: props.height,
  };
  return <Image {...finalProps} />;
};

export const Default = Template.bind({});
Default.args = {
  'data.url':
    'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/Main.jpg',
  'data.width': 100,
  'data.height': 100,
  width: 500,
  height: 500,
};
