import {Plugin} from 'vite';

export default function assetsVersion(version?: string): Plugin {
  return {
    name: 'augment-with-version',
    augmentChunkHash() {
      return version ?? '';
    },
  };
}
