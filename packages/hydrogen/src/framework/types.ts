export interface HydrogenVitePluginOptions {
  devCache?: boolean;
  purgeQueryCacheOnBuild?: boolean;
  configPath?: string;
  optimizeBoundaries?: boolean | 'build';
}
