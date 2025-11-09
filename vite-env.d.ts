// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROOT_DIR: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}