import * as React from 'react';
import {createRoot} from 'react-dom/client';
import * as HUI from './src/index.js';

const container = document.getElementById('app');
if (!container) {
  throw new Error('Could not get #app');
}
const root = createRoot(container);

// change what's rendered here to test out a component in isolation
// eslint-disable-next-line react/no-unescaped-entities
root.render(<div>Change me in 'dev-entry-point.tsx'</div>);
// for example:
// root.render(
//   <HUI.Video
//     data={{
//       id: 'video',
//       previewImage: {
//         url: 'http://www.example.com/shopify.png',
//       },
//       sources: [
//         {
//           url: 'https://cdn.shopify.com/videos/c/vp/3a5f8892328346dab437721e9ff007ad/3a5f8892328346dab437721e9ff007ad.m3u8',
//           mimeType: 'application/x-mpegURL',
//         },
//         {
//           url: 'https://cdn.shopify.com/videos/c/vp/3a5f8892328346dab437721e9ff007ad/3a5f8892328346dab437721e9ff007ad.HD-1080p-7.2Mbps.mp4',
//           mimeType: 'video/mp4',
//         },
//       ],
//     }}
//   />
// );
