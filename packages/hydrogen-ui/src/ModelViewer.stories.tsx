import * as React from 'react';
import type {Story} from '@ladle/react';
import {ModelViewer} from './ModelViewer.js';

type ModelViewerProps = React.ComponentPropsWithoutRef<typeof ModelViewer>;

const Template: Story<ModelViewerProps> = (props) => <ModelViewer {...props} />;

export const Default = Template.bind({});
Default.args = {
  data: {
    sources: [
      {
        url: 'https://model3d.shopifycdn.com/models/o/eea3c66a77368d9a/snowboard.glb',
      },
    ],
    previewImage: {
      url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/Main.jpg?v=1655932274&width=1600&height=1600&crop=center',
    },
  },
  style: {
    width: '100%',
    height: '100%',
  },
};
