/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * Analytics project token. Public and write-only by design — it is inlined
   * into the built JS and is readable by anyone who views the deployed site.
   * Kept out of git for hygiene and easy rotation, not as a secret.
   * Unset (the default for local dev and CI) compiles analytics out entirely.
   */
  readonly PUBLIC_ANALYTICS_KEY?: string;
  /** Ingestion host. Defaults to EU when unset. */
  readonly PUBLIC_ANALYTICS_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
