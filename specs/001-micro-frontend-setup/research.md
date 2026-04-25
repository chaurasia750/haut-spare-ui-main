# Research & Best Practices: NX Angular Micro Frontend Architecture

**Date**: April 25, 2026  
**Purpose**: Document technology choices, best practices, and rationale for key architectural decisions

---

## 1. NX Monorepo + Module Federation

### Decision
Use NX 15+ monorepo with Webpack Module Federation for micro frontend integration.

### Rationale
- **Unified Build Pipeline**: Single `nx.json` configuration manages all apps and libraries
- **Dependency Graph**: NX generates accurate dependency graphs; prevents circular imports across remotes
- **Code Generation**: NX plugins generate boilerplate for new apps/libraries, reducing setup time
- **Affected Commands**: `nx affected:build` enables incremental builds (faster CI/CD)
- **Workspace Libraries**: Shared code referenced directly in source; no npm publish for internal libraries
- **Module Federation**: Webpack 5+ Module Federation enables true remotes without sharing runtime

### Best Practice
- Use `@nx/angular` plugin for scaffolding
- Keep `workspaceLayout` in `nx.json` to enforce consistent directory structure
- Configure Module Federation in each app's `module-federation.config.js`
- Use `shared` config to prevent version conflicts for common dependencies (Angular, RxJS)

### Risk Mitigation
- Version lock all dependencies in `package.json` to avoid unexpected breaking changes
- Set up branch protection rules requiring passing NX build/test gates
- Document Module Federation shared library version matrix in README

---

## 2. Module Federation: Shared Dependencies Strategy

### Decision
Define shared dependencies at both NX and Webpack level to prevent duplicate bundles.

### Rationale
- **Angular Framework**: Should be shared (only one Angular instance per page)
- **RxJS**: Single version across all apps prevents observable interoperability issues
- **Shared UI Library**: Versioned separately; remotes specify compatible version range
- **Core Libraries**: @angular/common, @angular/router, etc. must be shared

### Best Practice
Configure `shared` in Module Federation:
```javascript
shared: {
  "@angular/core": { singleton: true, strictVersion: false },
  "@angular/router": { singleton: true, strictVersion: false },
  "@angular/common": { singleton: true, strictVersion: false },
  "rxjs": { singleton: true, strictVersion: false },
  "@haut-spare/shared-ui": { singleton: false, strictVersion: true }
}
```

### Risk Mitigation
- Use `singleton: true` for framework dependencies (ensure only one copy)
- Use `singleton: false` for business logic libraries (allow multiple versions if needed)
- Test with version mismatches; ensure graceful degradation if versions conflict
- Monitor bundle size impact; Module Federation adds ~50-100KB overhead

---

## 3. JWT Authentication with httpOnly Cookies

### Decision
Store JWT in secure httpOnly cookies; no JavaScript access.

### Rationale
- **XSS Immunity**: JavaScript cannot access httpOnly cookies; XSS attacks cannot steal tokens
- **CSRF Protection**: Automatic cookie transmission on every request; combine with CSRF tokens
- **Cross-Domain**: Shared domain (e.g., `domain.com`) means all subpaths share same cookies
- **Interceptor Coordination**: HttpInterceptor automatically includes cookies; no manual token injection needed
- **Token Refresh**: Refresh token also in httpOnly cookie; 401 responses trigger automatic refresh

### Best Practice
Implement global HTTP interceptor:
```typescript
// auth.interceptor.ts
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpResponse<any>> {
    // Browser automatically includes httpOnly cookies
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired; refresh endpoint will use refresh token from cookie
          return this.authService.refreshToken().pipe(
            switchMap(() => next.handle(req))
          );
        }
        return throwError(() => error);
      })
    );
  }
}
```

### Risk Mitigation
- **Backend Must Set Correct Headers**:
  - `Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict; Path=/`
  - `Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth`
- Test token expiration and refresh flow across all remotes
- Implement logout that clears both access and refresh token cookies
- Monitor for unauthorized 401 responses; log them for security auditing

---

## 4. Graceful Degradation & Error Recovery

### Decision
Implement remote-level error boundaries; one failed remote does not crash Shell or other remotes.

### Rationale
- **Resilience**: Network glitches or slow remote loading should not block user interaction
- **User Experience**: Retry UI provides control; users not forced to full page reload
- **Monitoring**: Errors logged with context for debugging and alerting
- **Progressive Enhancement**: Shell remains functional even if remotes fail

### Best Practice
Implement error boundary component:
```typescript
// remote-error-boundary.component.ts
@Component({
  selector: 'app-remote-error-boundary',
  template: `
    <div class="error-container" *ngIf="errorState$ | async as error">
      <p>{{ error.message }}</p>
      <button (click)="retry()">Retry Loading</button>
    </div>
  `
})
export class RemoteErrorBoundaryComponent implements OnInit {
  errorState$ = this.errorService.remoteErrors$;
  
  retry() {
    this.remoteLoaderService.reloadRemote(this.remoteName);
  }
}
```

### Configuration
- **Module Federation Timeout**: `timeout: 20000` (20 seconds for remote to load)
- **Automatic Retry**: Exponential backoff: 1s, 2s, 4s, 8s (max 3 attempts)
- **User-Triggered Retry**: No limit; user clicks "Retry" button as needed

### Risk Mitigation
- Test remote loading failure scenarios (network down, 404, timeout)
- Test partial failures (Shell loads, Admin fails, Member loads)
- Monitor error logs; set up alerts for repeated failures on same remote
- Document troubleshooting guide linked in error UI

---

## 5. Shared Library Versioning & Semantic Versioning

### Decision
Use Semantic Versioning (MAJOR.MINOR.PATCH) with deprecation periods for breaking changes.

### Rationale
- **Predictability**: Consumers know when updates are safe (PATCH), when new features available (MINOR), when breaking (MAJOR)
- **Transition Period**: Deprecation period (2+ releases) allows consumers to plan upgrades
- **Rollback Safety**: Clear versioning enables safe rollback if issues discovered post-update
- **Migration Clarity**: Deprecation messages and migration guides reduce upgrade friction

### Best Practice
### Release Process
1. **Planning**: Announce breaking changes 1-2 sprints before implementation
2. **Implementation**: 
   - Add `@deprecated` annotations to old APIs
   - Implement new APIs in parallel
   - Update JSDoc with migration guidance
3. **Release**: Increment MINOR version (still 1.x); include deprecation notice in CHANGELOG
4. **Grace Period**: Maintain deprecated code for 2+ minor releases (e.g., 1.5 to 1.8)
5. **Breaking Change**: Increment MAJOR version (2.0); remove deprecated code; include migration guide
6. **Communication**: Email team with migration timeline and step-by-step guide

### Example: Deprecation Process
```typescript
// Version 1.5.0 - Introduce deprecation
/**
 * @deprecated Use `buttonNew()` instead. Migration: Replace `button('label')` with `buttonNew({label})`.
 * Will be removed in v2.0.0 (approximately 3 months from v1.5.0)
 */
export function button(label: string): ButtonComponent { }

export function buttonNew(config: ButtonConfig): ButtonComponent { }

// Version 1.6.0 - Consumers upgrade at their pace
// Version 1.7.0 - Prepare v2.0 documentation
// Version 1.8.0 - Final warning version
// Version 2.0.0 - Remove deprecated code
export function buttonNew(config: ButtonConfig): ButtonComponent { }
```

### Risk Mitigation
- **Automated Deprecation Checks**: CI/CD linter warns on use of deprecated APIs
- **Changelog Clarity**: Explicitly list breaking changes with before/after code
- **Coordinated Releases**: If multiple libraries have breaking changes, release same MAJOR version in same sprint
- **Documentation**: Maintain MIGRATION.md for each major version

---

## 6. Lazy Loading & Code Splitting

### Decision
Implement lazy loading for all remote applications and feature modules within remotes.

### Rationale
- **Initial Load Speed**: Shell loads minimal code; remotes loaded on-demand
- **User Experience**: Faster time-to-interactive for Shell (critical path)
- **Scalability**: Adding 5th, 10th remote does not impact Shell load time
- **Memory**: Only loaded remotes consume memory; unloaded remotes have zero footprint

### Best Practice
Configure Angular routing for lazy loading:
```typescript
// shell app.routes.ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('@admin/feature-shell').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'member',
    loadChildren: () => import('@member/feature-shell').then(m => m.MEMBER_ROUTES)
  }
];
```

Within remotes, lazy load features:
```typescript
// admin app.routes.ts
export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminShellComponent },
  {
    path: 'users',
    loadComponent: () => import('./feature-users').then(m => m.UserListComponent)
  },
  {
    path: 'reports',
    loadChildren: () => import('./feature-reports').then(m => m.REPORT_ROUTES)
  }
];
```

### Monitoring
- Measure bundle sizes for each app with `nx build --prod --analyze`
- Track module load times with performance observers
- Alert if Shell > 250KB or Remotes > 500KB (gzipped)

### Risk Mitigation
- Use `preloadAllModules: false` in routing strategy (only load on-demand)
- Test loading indicators and error states during slow network (Chrome DevTools throttling)
- Monitor for circular dependency errors; NX dependency graph helps identify issues

---

## 7. HTTP Interceptors for Cross-Cutting Concerns

### Decision
Implement global HTTP interceptors for authentication, error handling, and request tracking.

### Rationale
- **Single Responsibility**: Auth logic centralized; each service doesn't duplicate auth logic
- **Consistency**: All API calls get same error handling, logging, retry logic
- **Maintainability**: Update interceptor logic once; all remotes benefit
- **Observability**: Correlation IDs enable end-to-end request tracing

### Best Practice
Stack of interceptors (loaded via HTTP_INTERCEPTORS):
```typescript
// 1. Auth Interceptor - Add tokens, handle 401
// 2. Error Interceptor - Transform errors, retry on transient failures
// 3. Logging Interceptor - Add correlation ID, log requests/responses
// 4. Cache Interceptor (optional) - Cache GET responses per configuration
```

Example error interceptor with retry:
```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpResponse<any>> {
    return next.handle(req).pipe(
      retry({ count: 2, delay: 1000 }), // Retry transient failures
      catchError((error: HttpErrorResponse) => {
        const mappedError = this.errorService.mapError(error);
        return throwError(() => mappedError);
      })
    );
  }
}
```

---

## 8. State Management: Decoupled Per-Remote

### Decision
Each remote manages its own state independently; Shell maintains only layout state.

### Rationale
- **True Independence**: Remotes can upgrade state library independently (NgRx vs. Akita vs. local state)
- **Isolation**: State changes in one remote don't cascade to others
- **Scaling**: Large app with complex state doesn't impact Shell performance
- **Flexibility**: Simple features use local component state; complex features use NgRx

### Best Practice
- **Shell State**: Layout only
  - Sidebar expanded/collapsed
  - Theme (light/dark)
  - Global notifications
- **Remote State**: Independent
  - Admin: Dashboard data, user filters, report state
  - Member: Profile form state, wallet transactions, wallet filters
- **Communication**: 
  - Remotes call APIs for data
  - Event-based notification for cross-remote alerts (e.g., "user updated")
  - Shared authentication state (read-only from Shell)

### Implementation Options
1. **NgRx per app** (if complex state)
   ```
   Shell: @ngrx/store with layout facade
   Admin: Separate NgRx store for dashboard, users, reports
   Member: Separate NgRx store for profile, wallet
   ```
2. **Local component state** (if simple features)
   ```
   Member profile: Local component @State decorator (simplified)
   Admin users: Table with local filtering state
   ```
3. **Hybrid**: Mix NgRx and local state based on complexity

---

## 9. API Design for Micro Frontends

### Decision
RESTful APIs with standard HTTP methods and JSON payloads; strong typed models.

### Rationale
- **Simplicity**: REST is industry standard; engineers don't need special tooling
- **Caching**: HTTP caching headers enable browser/CDN caching
- **Monitoring**: Standard HTTP semantics enable monitoring tools to understand requests
- **Versioning**: API versioning via URL path (`/api/v1/users` vs `/api/v2/users`)

### Best Practice
Structure API service layer:
```typescript
// data-access/api/src/lib/services/http.service.ts
export class HttpService {
  constructor(private http: HttpClient, private config: AppConfig) {}
  
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.config.apiBaseUrl}${url}`);
  }
  
  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.config.apiBaseUrl}${url}`, body);
  }
}

// Usage in remotes
export class UserService {
  constructor(private http: HttpService) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/v1/users');
  }
  
  updateUser(id: string, user: User): Observable<User> {
    return this.http.post<User>(`/api/v1/users/${id}`, user);
  }
}
```

### Configuration Management
Externalize API base URL and other config:
```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3333'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.domain.com'
};
```

---

## 10. Testing Strategy for Micro Frontends

### Decision
Three-layer testing: unit (Jasmine), integration (Jasmine), E2E (Cypress).

### Rationale
- **Unit Tests**: Fast feedback; test business logic in isolation
- **Integration Tests**: Verify services work with dependencies (HttpClientTestingModule)
- **E2E Tests**: Full user journey across Shell + Remotes

### Best Practice
- **Unit Test**: Components, services, pipes (target 80%+ coverage per library)
- **Integration Test**: Remote loading, error scenarios, authentication flow
- **E2E Test**: Critical user paths (login → view dashboard → navigate to member → view profile)

Example Module Federation E2E test:
```typescript
// cypress/e2e/shell-to-remotes.cy.ts
describe('Shell to Remotes Navigation', () => {
  it('should load Admin remote and display dashboard', () => {
    cy.visit('/');
    cy.get('[data-testid="nav-admin"]').click();
    cy.get('[data-testid="admin-dashboard"]').should('be.visible');
  });
  
  it('should handle Admin loading failure gracefully', () => {
    // Mock remote load failure
    cy.intercept('/admin/remoteEntry.js', { statusCode: 404 });
    cy.visit('/#/admin');
    cy.get('[data-testid="error-message"]').should('contain', 'Failed to load');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });
});
```

---

## Summary: Key Technology Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Monorepo** | NX 15+ | Unified build, dependency graph, incremental builds |
| **Module Federation** | Webpack 5+ | True remotes, independent deployments, version management |
| **Authentication** | JWT in httpOnly cookies | XSS immunity, cross-domain sharing, interceptor integration |
| **Error Handling** | Graceful degradation + user retry | Resilience, UX, monitoring |
| **Versioning** | Semantic + deprecation period | Predictability, smooth upgrades |
| **Lazy Loading** | Per-remote + per-feature | Fast initial load, scalability |
| **State** | Decoupled per remote | Independence, flexibility, scaling |
| **API** | REST + HTTP interceptors | Standard, simple, cacheable, monitorable |
| **Testing** | Unit + Integration + E2E | Fast feedback + confidence |

---

## Next Steps

1. **Phase 1 (Design)**: Create `data-model.md`, `contracts/`, `quickstart.md`
2. **Phase 2 (Tasks)**: Generate `tasks.md` with implementation tasks in dependency order
3. **Implementation**: Follow tasks in sequence; each task should be independently testable
