export interface HydrogenVitePluginOptions {
  devCache?: boolean;
  purgeQueryCacheOnBuild?: boolean;
  configPath?: string;
  optimizeBoundaries?: boolean | 'build';
  assetHashVersion?: string;
  /**
   * Experimental features
   */
  experimental?: {
    /**
     * CSS compatibility with React Server Components.
     * - `global` inlines all the styles in the DOM and works for all types of CSS.
     * - `modules-only` inlines the styles in RSC responses and only works for CSS Modules.
     * @defaultValue `modules-only`
     * @experimental
     */
    css: 'global' | 'modules-only';
  };
}
