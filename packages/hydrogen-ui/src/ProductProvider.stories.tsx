import * as React from 'react';
import type {Story} from '@ladle/react';
import {ProductProvider, useProduct} from './ProductProvider.js';
import {getProduct} from './ProductProvider.test.helpers.js';

const Template: Story = () => {
  return (
    <ProductProvider data={getProduct()}>
      <TemplateChildren />
    </ProductProvider>
  );
};

const TemplateChildren = () => {
  const prodHook = useProduct();
  return (
    <>
      {Object.keys(prodHook).map((key) => {
        return (
          <p key={key}>
            <strong>{key}: </strong>
            {typeof prodHook[key] === 'string'
              ? prodHook[key]
              : JSON.stringify(prodHook[key])}
          </p>
        );
      })}
    </>
  );
};

export const Default = Template.bind({});
