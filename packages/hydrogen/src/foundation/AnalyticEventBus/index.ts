import {
  pushToDatalayer,
  getDatalayer,
  subscribe,
} from './ServerAnalytics.server';
export const ServerAnalytics = {
  pushToDatalayer,
  getDatalayer,
  subscribe,
};

export * as ClientAnalytics from './ClientAnalytics.client';
