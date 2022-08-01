/// <reference types="vite/client" />

// adds support for Vite's import.meta.env.{stuff} in Typescript
// see https://vitejs.dev/guide/env-and-mode.html#env-files

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
