// This file is modified by Vite at build time
// with user project information and re-exports it.

// @ts-ignore
// eslint-disable-next-line node/no-missing-import
import appEntry from '__HYDROGEN_ENTRY__';
import type {RequestHandler} from '../shared-types';

export const handleRequest = appEntry as RequestHandler;

// eslint-disable-next-line node/no-missing-import
export {default as indexTemplate} from '__HYDROGEN_HTML_TEMPLATE__?raw';

export const assets = ['__HYDROGEN_ASSETS__'] as string[];
export const assetPrefix = '/__HYDROGEN_ASSETS_DIR__/' as string;

export const isAsset = (pathname = '') =>
  pathname.startsWith(assetPrefix) || assets.includes(pathname);

export const relativeClientBuildPath =
  '__HYDROGEN_RELATIVE_CLIENT_BUILD__' as string;

throw new Error('This file must be overwritten in a Vite plugin');
