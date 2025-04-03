interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  // add other env variables here...
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
