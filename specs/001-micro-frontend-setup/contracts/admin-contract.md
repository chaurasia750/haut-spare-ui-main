# Module Federation Contract: Admin Remote Application

**Role**: Remote application (loaded by Shell)  
**Purpose**: Admin domain features (dashboard, user management, reports)  
**Module Federation**: Exposes `AdminModule` via remoteEntry.js  
**Port**: 4201 (development)  
**Deployed Path**: `/admin` (accessed via Shell router)  

---

## Exposed Modules

Admin remote exposes the following modules via Module Federation:

| Module | Export | Consumers | Usage |
|--------|--------|-----------|-------|
| `@admin/feature-shell` | `ADMIN_ROUTES` | Shell routing | Routes for admin features |
| `@admin/feature-dashboard` | `DashboardComponent` | Admin app | Dashboard page component |
| `@admin/feature-users` | `UsersListComponent` | Admin app | Users management page |
| `@admin/feature-reports` | `ReportsComponent` | Admin app | Reports viewer page |

---

## Module Federation Configuration

```javascript
// apps/admin/module-federation.config.js
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.base.json'),
  [
    '@haut-spare/shared-ui',
    '@haut-spare/shared-auth',
    '@haut-spare/data-access-api'
  ]
);

module.exports = {
  output: {
    uniqueName: "admin",
    publicPath: "auto",
    scriptType: "text/javascript"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "admin",
      filename: "remoteEntry.js",
      exposes: {
        './feature-shell': './src/app/app-routing.module.ts',
        './feature-dashboard': './src/app/feature-dashboard/dashboard.component.ts',
        './feature-users': './src/app/feature-users/users-list.component.ts',
        './feature-reports': './src/app/feature-reports/reports.component.ts'
      },
      shared: share({
        "@angular/core": { singleton: true, strictVersion: false },
        "@angular/router": { singleton: true, strictVersion: false },
        "@angular/common": { singleton: true, strictVersion: false },
        "@angular/forms": { singleton: true, strictVersion: false },
        "rxjs": { singleton: true, strictVersion: false },
        "@haut-spare/shared-ui": { 
          singleton: false, 
          strictVersion: true,
          requiredVersion: "^1.0.0"
        },
        "@haut-spare/shared-auth": { 
          singleton: false, 
          strictVersion: true,
          requiredVersion: "^1.0.0"
        },
        "@haut-spare/data-access-api": {
          singleton: false,
          strictVersion: true,
          requiredVersion: "^1.0.0"
        },
        ...sharedMappings.getDescriptors()
      })
    })
  ]
};
```

---

## Routes Contract

Admin exposes routing module with these routes:

```typescript
// apps/admin/src/app/app-routing.module.ts
export const ADMIN_ROUTES: Routes = [
  { path: '', component: DashboardComponent }, // /admin → dashboard
  { path: 'users', component: UsersListComponent }, // /admin/users
  { path: 'reports', component: ReportsComponent }, // /admin/reports
  { path: '**', redirectTo: '' }
];
```

---

## API Contracts

Admin remote consumes these APIs:

| Service | Endpoint | Method | Purpose |
|---------|----------|--------|---------|
| **Dashboard API** | `/api/v1/dashboard/metrics` | GET | Fetch dashboard metrics |
| **Users API** | `/api/v1/users` | GET | List users with pagination |
| **Users API** | `/api/v1/users/:id` | GET | Fetch single user |
| **Users API** | `/api/v1/users` | POST | Create new user |
| **Users API** | `/api/v1/users/:id` | PUT | Update user |
| **Users API** | `/api/v1/users/:id` | DELETE | Delete user |
| **Reports API** | `/api/v1/reports` | GET | List reports |
| **Reports API** | `/api/v1/reports/:id` | GET | Fetch report details |

All API calls use:
- **Authentication**: JWT from httpOnly cookies (automatic via interceptor)
- **Error Handling**: Centralized via shared `HttpInterceptor`
- **Caching**: Per HTTP response headers and optional in-memory cache

---

## Service Dependencies

Admin remote depends on these shared libraries:

```typescript
// Shared UI Components
import { Button, Table, Form, Modal } from '@haut-spare/shared-ui';

// Shared Authentication
import { AuthGuard, AuthInterceptor } from '@haut-spare/shared-auth';

// Shared API Services
import { HttpService, UserService, DashboardService } from '@haut-spare/data-access-api';

// Shared Utilities
import { formatCurrency, formatDate } from '@haut-spare/util-helpers';
```

---

## State Management

Admin remote manages its own state independently:

```typescript
// Option 1: NgRx (if complex state management needed)
export interface AdminState {
  dashboard: {
    metrics: DashboardMetric[];
    loading: boolean;
    error: string | null;
  };
  users: {
    list: User[];
    selected: User | null;
    filters: UserFilter;
    pagination: Pagination;
    loading: boolean;
    error: string | null;
  };
  reports: {
    list: Report[];
    selected: Report | null;
    loading: boolean;
  };
}

// Option 2: Local Component State (for simpler features)
@Component({
  selector: 'app-users-list',
  template: `
    <table [dataSource]="users$ | async">
      <tr *ngFor="let user of (users$ | async)">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td><button (click)="editUser(user)">Edit</button></td>
      </tr>
    </table>
  `
})
export class UsersListComponent {
  users$ = this.userService.getUsers();
  
  constructor(private userService: UserService) {}
  
  editUser(user: User) { /* ... */ }
}
```

**State Communication**: 
- Admin state remains internal
- Shell and Member cannot directly access Admin state
- Cross-app notifications via optional `InterAppEventService` for critical updates (e.g., user created)

---

## Error Handling

Admin remote must handle:

1. **Remote Loading Failure**: Shell shows error UI; user can retry
2. **API Errors**: Display user-friendly error messages; provide retry for transient errors
3. **Validation Errors**: Show inline form errors; allow user to correct
4. **Auth Errors (401/403)**: Redirect to login (Shell handles); show forbidden message

---

## Performance Requirements

- **Bundle Size**: < 500KB (gzipped)
- **Load Time**: < 3 seconds on 4G
- **Feature Responsiveness**: All interactions < 500ms

---

## Testing Contract

Admin remote is tested for:
- ✅ Module loads when called by Shell
- ✅ Dashboard displays metrics
- ✅ Users list loads with pagination
- ✅ User CRUD operations work
- ✅ Reports render correctly
- ✅ API errors handled gracefully
- ✅ State persists during navigation within Admin

---

## Logging & Monitoring

Admin remote logs:
- All API requests/responses
- User interactions (for analytics)
- Errors (with stack traces)
- Performance metrics (load times, render times)

All logs include correlation ID (from shared `LoggingInterceptor`) for end-to-end tracing.

---

## Versioning

Admin remote versioning:
- Independent semantic versioning
- Breaking changes require migration guide
- Users of Admin APIs must handle version compatibility
