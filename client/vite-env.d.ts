/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_RESTAURANT_API_URL: string;
  readonly VITE_CART_API_URL: string;

  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_SUPPORT_PHONE: string;
  readonly VITE_PORT: string;
  readonly VITE_ALLOWED_HOSTS: string;
  readonly VITE_AVATAR_API_URL: string;
  readonly VITE_GOOGLE_FONTS_URL: string;
  readonly VITE_GOOGLE_FONTS_STATIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}