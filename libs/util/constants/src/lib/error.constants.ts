/**
 * Error Constants
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You are not authorized. Please log in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  NETWORK_ERROR: 'A network error occurred. Please check your connection.',
  TIMEOUT: 'The request timed out. Please try again.',
  UNKNOWN: 'An unexpected error occurred.',
};
