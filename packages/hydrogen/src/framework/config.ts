/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace globalThis {
  var __config: HydrogenConfig | undefined;
}

type HydrogenConfig = {
  dev?: boolean;
};

export function setConfig(config: HydrogenConfig) {
  globalThis.__config = config;
}

export function getConfig(): HydrogenConfig {
  return globalThis.__config || {};
}
