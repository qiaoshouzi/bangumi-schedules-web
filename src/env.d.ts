interface ImportMetaEnv {
  readonly PUBLIC_MAIN_GIT_HASH: string
  readonly PUBLIC_DB_GIT_HASH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
