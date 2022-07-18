import {Plugin} from 'vite';

export function assetsVersion(): Plugin {
  return {
    name: 'augment-with-version',
    augmentChunkHash() {
      const version =
        process.env.HYDROGEN_ASSETS_VERSION ??
        process.env.ASSETS_VERSION ??
        '1';
      return `${version}`;
    },
  };
}
