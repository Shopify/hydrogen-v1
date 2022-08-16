import {Plugin} from 'vite';

export default function assetsVersion(version?: string): Plugin {
  return {
    name: 'hydrogen:augment-with-version',
    augmentChunkHash() {
      return version ?? '';
    },
  };
}
