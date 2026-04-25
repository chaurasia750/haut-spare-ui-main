import { Injectable } from '@angular/core';

/**
 * Configuration interface for API settings
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  defaultPageSize: number;
  apiVersion: string;
  enableCaching: boolean;
  cacheDuration: number;
  enableLogging: boolean;
  enableRetry: boolean;
  maxRetries: number;
}

/**
 * Service to manage API configuration and environment-specific settings
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private config: ApiConfig;

  constructor() {
    // Initialize with default configuration
    this.config = this.getDefaultConfig();

    // Override with environment-specific settings if available
    this.initializeFromEnvironment();
  }

  /**
   * Get the complete API configuration
   */
  getConfig(): ApiConfig {
    return { ...this.config };
  }

  /**
   * Get API base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Set API base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl;
  }

  /**
   * Get request timeout in milliseconds
   */
  getTimeout(): number {
    return this.config.timeout;
  }

  /**
   * Get default page size for paginated requests
   */
  getDefaultPageSize(): number {
    return this.config.defaultPageSize;
  }

  /**
   * Get API version
   */
  getApiVersion(): string {
    return this.config.apiVersion;
  }

  /**
   * Check if caching is enabled
   */
  isCachingEnabled(): boolean {
    return this.config.enableCaching;
  }

  /**
   * Get cache duration in milliseconds
   */
  getCacheDuration(): number {
    return this.config.cacheDuration;
  }

  /**
   * Check if logging is enabled
   */
  isLoggingEnabled(): boolean {
    return this.config.enableLogging;
  }

  /**
   * Check if retry is enabled
   */
  isRetryEnabled(): boolean {
    return this.config.enableRetry;
  }

  /**
   * Get maximum number of retries
   */
  getMaxRetries(): number {
    return this.config.maxRetries;
  }

  /**
   * Get the full API endpoint URL
   */
  getEndpoint(path: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/api/${this.config.apiVersion}${normalizedPath}`;
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(partial: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): ApiConfig {
    return {
      baseUrl: 'http://localhost:3000',
      timeout: 30000, // 30 seconds
      defaultPageSize: 10,
      apiVersion: 'v1',
      enableCaching: true,
      cacheDuration: 300000, // 5 minutes
      enableLogging: true,
      enableRetry: true,
      maxRetries: 3,
    };
  }

  /**
   * Initialize configuration from environment or localStorage
   */
  private initializeFromEnvironment(): void {
    // Check if running in development
    const isDevelopment = !this.isProd();

    if (isDevelopment) {
      // Development settings
      this.config.baseUrl = 'http://localhost:3000';
      this.config.enableLogging = true;
      this.config.enableCaching = true;
    } else {
      // Production settings
      this.config.baseUrl = this.getProductionBaseUrl();
      this.config.enableLogging = false;
      this.config.enableCaching = true;
      this.config.cacheDuration = 600000; // 10 minutes
    }

    // Allow localStorage override
    const storedConfig = this.loadFromLocalStorage();
    if (storedConfig) {
      this.config = { ...this.config, ...storedConfig };
    }
  }

  /**
   * Get production base URL
   */
  private getProductionBaseUrl(): string {
    // This would typically be set from environment variables
    // For now, using window.location.origin
    return typeof window !== 'undefined' ? window.location.origin : 'https://api.example.com';
  }

  /**
   * Check if running in production
   */
  private isProd(): boolean {
    // This would typically check from @angular/common/http environment
    return typeof window !== 'undefined' && window.location.protocol === 'https:';
  }

  /**
   * Load configuration from localStorage
   */
  private loadFromLocalStorage(): ApiConfig | null {
    try {
      const stored = localStorage.getItem('api-config');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Save configuration to localStorage
   */
  saveToLocalStorage(): void {
    try {
      localStorage.setItem('api-config', JSON.stringify(this.config));
    } catch {
      console.warn('Failed to save API config to localStorage');
    }
  }

  /**
   * Clear stored configuration
   */
  clearLocalStorage(): void {
    try {
      localStorage.removeItem('api-config');
    } catch {
      console.warn('Failed to clear API config from localStorage');
    }
  }
}
