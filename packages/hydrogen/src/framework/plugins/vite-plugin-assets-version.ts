import {Plugin} from 'vite';

/* -- Plugin notes:
 * Used to manually change the hash of output chunks (`index.k12dw5q.js`)
 * when their content have not been updated.
 */

export default function assetsVersion(version?: string): Plugin {
  return {
    name: 'hydrogen:augment-with-version',
    augmentChunkHash() {
      return version ?? '';
    },
  };
}
