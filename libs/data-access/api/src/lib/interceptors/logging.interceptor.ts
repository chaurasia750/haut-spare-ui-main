import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private requestId = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const correlationId = `${Date.now()}-${++this.requestId}`;
    const startTime = performance.now();

    // Add correlation ID to request headers
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Correlation-ID': correlationId,
      },
    });

    console.log(`[${correlationId}] ${req.method} ${req.url}`, req);

    return next.handle(modifiedReq).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            const duration = performance.now() - startTime;
            console.log(`[${correlationId}] Response received in ${duration.toFixed(2)}ms`, event);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            const duration = performance.now() - startTime;
            console.error(`[${correlationId}] Error after ${duration.toFixed(2)}ms`, error);
          }
        }
      )
    );
  }
}
