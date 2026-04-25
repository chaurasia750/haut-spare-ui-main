/**
 * Application Constants
 */
export const APP_NAME = 'Haut Spare';
export const APP_VERSION = '1.0.0';

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  MEMBER: '/member',
  LOGOUT: '/logout',
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
};

/**
 * Session Storage Keys
 */
export const SESSION_KEYS = {
  NAVIGATION_STATE: 'navigation_state',
  CURRENT_REMOTE: 'current_remote',
};

/**
 * Theme Constants
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * User Roles
 */
export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}
