/**
 * Application configuration
 * Centralizes environment variable access and provides type safety
 */

export const config = {
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',

  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: '모바일 부고장',
  },

  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  kakao: {
    mapAppKey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY || '',
  },

  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10),
    windowHours: parseInt(process.env.RATE_LIMIT_WINDOW_HOURS || '24', 10),
  },

  session: {
    durationDays: parseInt(process.env.SESSION_DURATION_DAYS || '30', 10),
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    naverId: process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID,
  },

  hCaptcha: {
    siteKey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    secretKey: process.env.HCAPTCHA_SECRET_KEY,
  },
} as const;

// Validate required environment variables in production
if (config.isProd) {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_KAKAO_MAP_APP_KEY',
    'NEXT_PUBLIC_APP_URL',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}
