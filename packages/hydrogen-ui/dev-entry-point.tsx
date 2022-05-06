import {createRoot} from 'react-dom/client';
import * as Shared from './src/index.shared';

const container = document.getElementById('app');
const root = createRoot(container);

// change what's rendered here to test out a component in isolation
root.render(<div>Change me in 'dev-entry-point.tsx'</div>);
// for example:
// root.render(
//   <Shared.Video
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
