import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorResponse } from '../models/api-error.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError = this.transformError(error);
        console.error('API Error:', apiError);
        return throwError(() => apiError);
      })
    );
  }

  private transformError(error: HttpErrorResponse): ApiErrorResponse {
    const code = error.error?.code || `HTTP_${error.status}`;
    const message =
      error.error?.message ||
      error.statusText ||
      'An error occurred while processing your request';
    const timestamp = new Date().toISOString();
    const details = error.error?.details || { originalStatus: error.status };

    return new ApiErrorResponse(code, message, error.status, timestamp, details);
  }
}
