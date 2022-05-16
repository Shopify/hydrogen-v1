import {resolve} from 'path';
import {remove} from 'fs-extra';

export default async function () {
  await global.__BROWSER_SERVER__.close();
  if (!process.env.VITE_PRESERVE_BUILD_ARTIFACTS) {
    await remove(resolve(__dirname, '../temp'));
  }
}
