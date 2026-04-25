import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, filter, map } from 'rxjs/operators';
import { ApiErrorResponse } from '../models/api-error.model';
import { ApiConfigService } from './api-config.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService,
    private errorService: ErrorService
  ) {}

  /**
   * Perform GET request
   */
  get<T>(url: string, options?: any): Observable<T> {
    const fullUrl = this.apiConfig.getEndpoint(url);
    return this.http
      .get<T>(fullUrl, { ...this.buildRequestOptions(options), reportProgress: true })
      .pipe(
        filter((event: HttpEvent<T>) => event.type === 4), // HttpResponse = 4
        map((event: HttpEvent<T>) => (event as any).body),
        timeout(this.apiConfig.getTimeout()),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Perform POST request
   */
  post<T>(url: string, body: any, options?: any): Observable<T> {
    const fullUrl = this.apiConfig.getEndpoint(url);
    return this.http
      .post<T>(fullUrl, body, { ...this.buildRequestOptions(options), reportProgress: true })
      .pipe(
        filter((event: HttpEvent<T>) => event.type === 4), // HttpResponse = 4
        map((event: HttpEvent<T>) => (event as any).body),
        timeout(this.apiConfig.getTimeout()),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Perform PUT request
   */
  put<T>(url: string, body: any, options?: any): Observable<T> {
    const fullUrl = this.apiConfig.getEndpoint(url);
    return this.http
      .put<T>(fullUrl, body, { ...this.buildRequestOptions(options), reportProgress: true })
      .pipe(
        filter((event: HttpEvent<T>) => event.type === 4), // HttpResponse = 4
        map((event: HttpEvent<T>) => (event as any).body),
        timeout(this.apiConfig.getTimeout()),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Perform PATCH request
   */
  patch<T>(url: string, body: any, options?: any): Observable<T> {
    const fullUrl = this.apiConfig.getEndpoint(url);
    return this.http
      .patch<T>(fullUrl, body, { ...this.buildRequestOptions(options), reportProgress: true })
      .pipe(
        filter((event: HttpEvent<T>) => event.type === 4), // HttpResponse = 4
        map((event: HttpEvent<T>) => (event as any).body),
        timeout(this.apiConfig.getTimeout()),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Perform DELETE request
   */
  delete<T>(url: string, options?: any): Observable<T> {
    const fullUrl = this.apiConfig.getEndpoint(url);
    return this.http
      .delete<T>(fullUrl, { ...this.buildRequestOptions(options), reportProgress: true })
      .pipe(
        filter((event: HttpEvent<T>) => event.type === 4), // HttpResponse = 4
        map((event: HttpEvent<T>) => (event as any).body),
        timeout(this.apiConfig.getTimeout()),
        catchError((error) => this.handleError(error))
      );
  }

  /**
   * Build request options with default headers and params
   */
  private buildRequestOptions(options?: any): any {
    const requestOptions: any = { ...options };

    // Convert params object to HttpParams
    if (options?.params && !(options.params instanceof HttpParams)) {
      const params = new HttpParams();
      Object.keys(options.params).forEach((key) => {
        if (options.params[key] !== null && options.params[key] !== undefined) {
          requestOptions.params = params.set(key, options.params[key].toString());
        }
      });
    }

    return requestOptions;
  }

  /**
   * Handle HTTP errors and transform to standard format
   */
  private handleError(error: HttpErrorResponse | any) {
    let apiError: ApiErrorResponse;

    if (error instanceof HttpErrorResponse) {
      const transformedError = this.errorService.transformError(error);
      apiError = new ApiErrorResponse(
        transformedError.code,
        transformedError.message,
        error.status || 0,
        transformedError.timestamp,
        transformedError.details
      );
    } else {
      apiError = new ApiErrorResponse(
        'UNKNOWN_ERROR',
        error?.message || 'An unexpected error occurred',
        0,
        new Date().toISOString()
      );
    }

    if (this.apiConfig.isLoggingEnabled()) {
      console.error('HTTP Error:', apiError);
    }

    return throwError(() => apiError);
  }
}

