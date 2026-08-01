/**
 * Environment variable helper — reads Vite-exposed env vars with type-safe defaults.
 * All keys must be prefixed with VITE_ to be available at runtime.
 */

export const env = {
  /** App display name */
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'FoodExpress',
  /** App meta description */
  APP_DESCRIPTION:
    import.meta.env.VITE_APP_DESCRIPTION ??
    'FoodExpress - Your favorite food, delivered fast.',
  /** Support email shown in the footer and contact pages */
  SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@foodexpress.com',
  /** Support phone number shown in the footer */
  SUPPORT_PHONE: import.meta.env.VITE_SUPPORT_PHONE ?? '+1 (555) 000-0000',

  /** Dev server port */
  PORT: import.meta.env.VITE_PORT ?? '5173',
  /** Whether to allow all hosts in dev */
  ALLOWED_HOSTS: import.meta.env.VITE_ALLOWED_HOSTS === 'true',

  /** Base URL for the avatar generation API */
  AVATAR_API_URL:
    import.meta.env.VITE_AVATAR_API_URL ?? 'https://ui-avatars.com/api',
  /** Base URL for the Spring Boot authentication service */
  AUTH_API_URL:
    import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8081/api/auth',
  /** Google Fonts CSS URL */
  GOOGLE_FONTS_URL:
    import.meta.env.VITE_GOOGLE_FONTS_URL ?? 'https://fonts.googleapis.com',
  /** Google Fonts static asset CDN */
  GOOGLE_FONTS_STATIC_URL:
    import.meta.env.VITE_GOOGLE_FONTS_STATIC_URL ?? 'https://fonts.gstatic.com',

  /** Default delivery fee in pesos */
  DELIVERY_FEE: Number(import.meta.env.VITE_DELIVERY_FEE ?? 25),
  /** Orders above this amount get free delivery */
  FREE_DELIVERY_THRESHOLD: Number(
    import.meta.env.VITE_FREE_DELIVERY_THRESHOLD ?? 500,
  ),
} as const;