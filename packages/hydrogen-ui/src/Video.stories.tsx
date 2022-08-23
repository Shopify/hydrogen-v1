import * as React from 'react';
import type {Story} from '@ladle/react';
import {Video, type VideoProps} from './Video.js';

const Template: Story<VideoProps> = (props) => <Video {...props} />;

export const Default = Template.bind({});
Default.args = {
  data: {
    id: 'video',
    previewImage: {
      url: 'http://www.example.com/shopify.png',
    },
    sources: [
      {
        url: 'https://cdn.shopify.com/videos/c/vp/3a5f8892328346dab437721e9ff007ad/3a5f8892328346dab437721e9ff007ad.m3u8',
        mimeType: 'application/x-mpegURL',
      },
      {
        url: 'https://cdn.shopify.com/videos/c/vp/3a5f8892328346dab437721e9ff007ad/3a5f8892328346dab437721e9ff007ad.HD-1080p-7.2Mbps.mp4',
        mimeType: 'video/mp4',
      },
    ],
  },
};
