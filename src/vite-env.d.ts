/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_API_BASE_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADMIN_CONSOLE_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}