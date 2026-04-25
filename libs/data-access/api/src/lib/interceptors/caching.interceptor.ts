import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<any>>();
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes
  private cacheTimestamps = new Map<string, number>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Skip cache if explicitly requested
    if (req.headers.has('X-Skip-Cache')) {
      return next.handle(req);
    }

    const cacheKey = req.url;

    // Check if cached response is still valid
    const cachedResponse = this.cache.get(cacheKey);
    const cacheTime = this.cacheTimestamps.get(cacheKey) || 0;
    const now = Date.now();

    if (cachedResponse && now - cacheTime < this.cacheDuration) {
      console.log(`[Cache] Hit for ${cacheKey}`);
      return of(cachedResponse.clone());
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Cache successful responses
          if (event.status === 200 || event.status === 201) {
            console.log(`[Cache] Storing ${cacheKey}`);
            this.cache.set(cacheKey, event.clone());
            this.cacheTimestamps.set(cacheKey, Date.now());
          }
        }
      })
    );
  }
}
