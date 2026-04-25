/**
 * API Constants
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    REGISTER: '/auth/register',
  },
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    REPORTS: '/dashboard/reports',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
  WALLET: {
    BALANCE: '/wallet/balance',
    TRANSACTIONS: '/wallet/transactions',
    TRANSFER: '/wallet/transfer',
  },
};

/**
 * HTTP Timeout in milliseconds
 */
export const HTTP_TIMEOUT = 30000;

/**
 * Token refresh threshold (in seconds)
 * Refresh token when it has less than this time remaining
 */
export const TOKEN_REFRESH_THRESHOLD = 60;

/**
 * Maximum retry attempts for failed requests
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Retry backoff strategy (milliseconds)
 */
export const RETRY_BACKOFF_MS = [1000, 2000, 4000];
