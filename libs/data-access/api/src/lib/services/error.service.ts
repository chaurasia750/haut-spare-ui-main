import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api-error.model';

/**
 * Service to transform HTTP errors to user-friendly messages
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  /**
   * Transform HTTP error response to user-friendly error message
   */
  transformError(error: HttpErrorResponse | any): ApiError {
    if (error instanceof HttpErrorResponse) {
      return this.transformHttpError(error);
    }

    // Handle other types of errors
    return {
      code: 'UNKNOWN_ERROR',
      message: error?.message || 'An unexpected error occurred',
      statusCode: 0,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Transform HTTP error response to ApiError
   */
  private transformHttpError(error: HttpErrorResponse): ApiError {
    const status = error.status;
    const errorBody = error.error;

    // Check if error has a message from server
    if (errorBody && typeof errorBody === 'object') {
      return {
        code: errorBody.code || `HTTP_${status}`,
        message: errorBody.message || this.getDefaultMessage(status),
        statusCode: status,
        details: errorBody.details,
        timestamp: errorBody.timestamp || new Date().toISOString(),
      };
    }

    // Fallback to default message
    return {
      code: `HTTP_${status}`,
      message: this.getDefaultMessage(status),
      statusCode: status,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get default error message based on HTTP status code
   */
  private getDefaultMessage(status: number): string {
    const messages: { [key: number]: string } = {
      400: 'Invalid request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'Access forbidden. You do not have permission.',
      404: 'Resource not found.',
      409: 'Conflict. The resource already exists.',
      422: 'Validation error. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Bad Gateway. Please try again later.',
      503: 'Service unavailable. Please try again later.',
      504: 'Gateway timeout. Please try again later.',
    };

    return messages[status] || 'An error occurred. Please try again.';
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(error: HttpErrorResponse): boolean {
    return error.status === 0;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(error: HttpErrorResponse): boolean {
    return error.status >= 400 && error.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(error: HttpErrorResponse): boolean {
    return error.status >= 500;
  }

  /**
   * Check if error is recoverable (can be retried)
   */
  isRecoverable(error: HttpErrorResponse): boolean {
    // Network errors, timeouts, and 5xx errors are recoverable
    if (error.status === 0 || error.status >= 500) {
      return true;
    }

    // 429 (Too Many Requests) is also recoverable
    if (error.status === 429) {
      return true;
    }

    // 408 (Request Timeout) is recoverable
    if (error.status === 408) {
      return true;
    }

    return false;
  }

  /**
   * Get retry delay in milliseconds based on error
   */
  getRetryDelay(error: HttpErrorResponse, attempt: number = 1): number {
    // For 429 errors, check for Retry-After header
    const retryAfter = error.headers?.get('Retry-After');
    if (retryAfter) {
      return parseInt(retryAfter, 10) * 1000;
    }

    // Exponential backoff: 1000ms, 2000ms, 4000ms, 8000ms, max 30s
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
    return delay;
  }

  /**
   * Check if error is a 401 Unauthorized error
   */
  isUnauthorized(error: HttpErrorResponse): boolean {
    return error.status === 401;
  }

  /**
   * Check if error is a 403 Forbidden error
   */
  isForbidden(error: HttpErrorResponse): boolean {
    return error.status === 403;
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(error: HttpErrorResponse): boolean {
    return error.status === 422 || error.status === 400;
  }
}
