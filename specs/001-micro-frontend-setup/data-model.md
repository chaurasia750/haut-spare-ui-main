# Data Model & Architecture Design

**Date**: April 25, 2026  
**Purpose**: Define system architecture, data entities, services, and integration patterns

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Shell Application (Host)                │  │
│  │  - Header, Sidebar, Footer (persistent)             │  │
│  │  - Central Router (delegates to remotes)            │  │
│  │  - Authentication Bootstrap                         │  │
│  │  - Error Boundary (for remote failures)            │  │
│  │  - Layout State Management                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Admin     │  │   Member    │  │  [Future Remote]    │ │
│  │  Remote     │  │   Remote    │  │  (Dynamically)      │ │
│  │             │  │             │  │                     │ │
│  │ Dashboard   │  │  Profile    │  │  Lazy loaded via    │ │
│  │ Users       │  │  Wallet     │  │  Module Federation  │ │
│  │ Reports     │  │  History    │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Shared Libraries (npm/monorepo)          │  │
│  │  - shared/ui (components)                           │  │
│  │  - shared/auth (guards, interceptors)               │  │
│  │  - data-access/api (HTTP services)                  │  │
│  │  - util/* (helpers, constants)                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
              ↓ (API calls, shared state)
┌─────────────────────────────────────────────────────────────┐
│                     Backend Services                         │
│  - Auth Service (JWT validation, token refresh)             │
│  - Admin API (/api/v1/users, /api/v1/reports, etc.)        │
│  - Member API (/api/v1/profile, /api/v1/wallet, etc.)      │
│  - Database (persistent storage)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Entities & Data Models

### 2.1 Application Layer

**Entity: Shell Application**
- **Responsibility**: Orchestration, layout, global routing
- **Data Owned**: 
  - `layoutState`: { sidebarOpen: boolean, theme: 'light' | 'dark', notifications: Notification[] }
  - `authState`: { isAuthenticated: boolean, user: User | null } (read-only from interceptor)
- **Routes**: 
  - `/` → Home
  - `/admin` → Admin Remote (lazy loaded)
  - `/member` → Member Remote (lazy loaded)
  - `/login` → Auth page (if needed)
- **No Business Logic**: Shell MUST NOT contain dashboard logic, user management, wallet logic, etc.

**Entity: Admin Remote Application**
- **Responsibility**: Admin domain features
- **Data Owned**:
  - `dashboardState`: { metrics: DashboardMetric[], loading: boolean, error: string | null }
  - `usersState`: { users: User[], filters: UserFilter, pagination: Pagination }
  - `reportsState`: { reports: Report[], selectedReport: Report | null }
- **Routes**:
  - `/admin` → Dashboard (entry point)
  - `/admin/users` → User management
  - `/admin/reports` → Report viewer
- **Exposed to Shell**: Via Module Federation as `AdminModule`

**Entity: Member Remote Application**
- **Responsibility**: Member domain features
- **Data Owned**:
  - `profileState`: { profile: MemberProfile, editing: boolean, errors: ValidationError[] }
  - `walletState`: { balance: number, transactions: Transaction[], filters: TxFilter }
  - `historyState`: { transactions: Transaction[], pagination: Pagination }
- **Routes**:
  - `/member` → Profile (entry point)
  - `/member/wallet` → Wallet management
  - `/member/history` → Transaction history
- **Exposed to Shell**: Via Module Federation as `MemberModule`

---

### 2.2 Shared Data Models

**User (Authentication)**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'superuser';
  createdAt: ISO8601;
  lastLogin: ISO8601;
  isActive: boolean;
}
```

**Dashboard Metric**
```typescript
interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  unit?: string; // e.g., '$', '%', 'users'
}
```

**Member Profile**
```typescript
interface MemberProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  preferences: UserPreferences;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}
```

**Wallet Transaction**
```typescript
interface Transaction {
  id: string;
  memberId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: ISO8601;
  relatedTransactionId?: string; // For refunds, corrections
}
```

---

### 2.3 Service Layer Architecture

**Authentication Service** (`shared/auth`)
```typescript
interface AuthService {
  login(email: string, password: string): Observable<LoginResponse>;
  logout(): Observable<void>;
  refreshToken(): Observable<TokenResponse>;
  getCurrentUser(): Observable<User>;
  isAuthenticated$: Observable<boolean>;
}
```

**HTTP Service** (`data-access/api`)
```typescript
interface HttpService {
  get<T>(url: string, options?: HttpOptions): Observable<T>;
  post<T>(url: string, body: any, options?: HttpOptions): Observable<T>;
  put<T>(url: string, body: any): Observable<T>;
  delete<T>(url: string): Observable<T>;
}
```

**User Service** (`data-access/api`)
```typescript
interface UserService extends HttpService {
  getUsers(filters?: UserFilter): Observable<PaginatedResponse<User>>;
  getUserById(id: string): Observable<User>;
  updateUser(id: string, user: Partial<User>): Observable<User>;
  deleteUser(id: string): Observable<void>;
  createUser(user: CreateUserRequest): Observable<User>;
}
```

**Admin Dashboard Service** (`data-access/api`)
```typescript
interface DashboardService extends HttpService {
  getDashboardMetrics(): Observable<DashboardMetric[]>;
  getMetricDetails(metricId: string): Observable<MetricDetails>;
}
```

**Member Profile Service** (`data-access/api`)
```typescript
interface ProfileService extends HttpService {
  getProfile(): Observable<MemberProfile>;
  updateProfile(profile: Partial<MemberProfile>): Observable<MemberProfile>;
}
```

**Wallet Service** (`data-access/api`)
```typescript
interface WalletService extends HttpService {
  getBalance(): Observable<WalletBalance>;
  getTransactions(filters?: TransactionFilter): Observable<PaginatedResponse<Transaction>>;
  getTransactionById(id: string): Observable<Transaction>;
}
```

---

## 3. Module Federation Contracts

See `contracts/` directory for detailed contracts:
- `shell-contract.md` - Shell's exposed and required modules
- `admin-contract.md` - Admin remote's exposed modules
- `member-contract.md` - Member remote's exposed modules
- `shared-libraries-contract.md` - All shared library APIs

---

## 4. Authentication & Authorization Flow

```
User Login Flow:
1. User accesses Shell (/)
2. Shell bootstrap loads AuthService
3. Shell checks if user is authenticated (reads httpOnly cookie)
4. If not authenticated, redirect to /login or show login form
5. User submits credentials
6. Backend validates and returns JWT + refresh token (both in httpOnly cookies)
7. Shell stores user info in layout state
8. Shell navigates to requested route (Admin or Member remote)

User Logout Flow:
1. User clicks logout
2. AuthService calls backend logout endpoint
3. Backend clears httpOnly cookies (access_token, refresh_token)
4. AuthService clears layout state
5. Shell redirects to login page

Token Refresh Flow:
1. User makes API request
2. HttpInterceptor adds request (browser automatically includes httpOnly cookie)
3. Backend receives request with JWT
4. If JWT valid, respond with data
5. If JWT expired (401 response), HttpInterceptor catches error
6. Interceptor calls backend refresh endpoint (with refresh token in cookie)
7. Backend returns new JWT (in httpOnly cookie)
8. Interceptor retries original request
9. Request succeeds with new JWT

Cross-Remote Coordination:
- All remotes use same httpOnly cookie scope (domain.com)
- All remotes use same HttpInterceptor (from shared/auth)
- Token refresh happens seamlessly; no coordination needed between remotes
```

---

## 5. State Management Patterns

### Shell State (Minimal)
```typescript
// Shell layout state (stored in service, not persisted)
interface ShellLayoutState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  currentUser: User | null; // Read-only copy
}

// Implementation: Can use NgRx or simple service
export class ShellStateService {
  private layout$ = new BehaviorSubject<ShellLayoutState>({...});
  
  toggleSidebar() { /* ... */ }
  setTheme(theme: 'light' | 'dark') { /* ... */ }
  addNotification(notification: Notification) { /* ... */ }
}
```

### Admin Remote State (Independent)
```typescript
// Option 1: Local component state (simple)
@Component({
  selector: 'app-users-list',
  template: `<table [dataSource]="users$ | async"></table>`
})
export class UsersListComponent {
  users$ = this.userService.getUsers();
}

// Option 2: NgRx (complex)
export interface AdminState {
  dashboard: DashboardFeatureState;
  users: UsersFeatureState;
  reports: ReportsFeatureState;
}
```

### Cross-Remote Communication
```typescript
// Method 1: Event-based (via service)
export class InterAppEventService {
  userUpdated$ = new Subject<User>();
  notificationAdded$ = new Subject<Notification>();
  
  emitUserUpdated(user: User) { this.userUpdated$.next(user); }
  emitNotification(notification: Notification) { this.notificationAdded$.next(notification); }
}

// Usage in Admin Remote:
@Injectable()
export class UserEffects {
  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType('[User] Update User'),
    switchMap((action) =>
      this.userService.updateUser(action.payload).pipe(
        tap((updatedUser) => this.interAppService.emitUserUpdated(updatedUser))
      )
    )
  );
}

// Usage in Shell:
constructor(private interAppService: InterAppEventService) {
  this.interAppService.userUpdated$.subscribe((user) => {
    console.log('User updated:', user); // Could refresh notifications, etc.
  });
}
```

---

## 6. Error Handling & Resilience

**Error Hierarchy**
```typescript
interface ApiError {
  code: string;        // e.g., 'USER_NOT_FOUND', 'UNAUTHORIZED'
  message: string;     // User-friendly message
  details?: any;       // Additional context
  statusCode: number;  // HTTP status code
}

interface ValidationError extends ApiError {
  field: string;
  value: any;
}

interface NetworkError extends ApiError {
  isNetworkError: true;
  originalError: Error;
}
```

**Error Recovery Strategy**
- **Transient Errors (network timeouts, 5xx)**: Retry with exponential backoff
- **Validation Errors (4xx except 401/403)**: Display to user; allow retry after correction
- **Auth Errors (401/403)**: Redirect to login (if 401), show forbidden message (if 403)
- **Unknown Errors**: Log to monitoring service; show generic error message

**Remote Loading Failures**
- **404 / Network Error**: Show "Failed to load" UI with retry button
- **Timeout**: Show "Loading..." → "Timeout" → Retry button
- **Other**: Show error message with error code; user can retry or contact support

---

## 7. Performance & Scalability Targets

**Bundle Size Targets**
- Shell: < 250KB (gzipped)
- Admin Remote: < 500KB (gzipped)
- Member Remote: < 500KB (gzipped)
- Shared Libraries: < 100KB total (gzipped)

**Load Time Targets**
- Initial page load (Shell + first remote): < 3 seconds on 4G
- Remote switch (Shell already loaded): < 1 second
- API response time: 95% < 2 seconds

**Scalability**
- Support 10,000 concurrent users
- Support sub-100ms routing latency between remotes
- Support adding 10+ new remotes without Shell redesign

---

## 8. Database Considerations (Backend Reference)

While not part of frontend architecture, backend should design for micro frontend patterns:

```
User Table:
  id, email, password_hash, name, role, created_at, last_login

Admin Domain:
  Users Table (id, name, email, role, created_at)
  Reports Table (id, title, data, created_by, created_at)
  Metrics Table (id, label, value, trend, updated_at)

Member Domain:
  Profiles Table (id, user_id, first_name, last_name, preferences)
  Wallets Table (id, member_id, balance, currency)
  Transactions Table (id, wallet_id, type, amount, status, timestamp)
```

---

## 9. Integration Points

**Shell ↔ Admin Remote**
- Navigation: Shell router delegates to Admin router
- Error handling: Admin failures don't crash Shell
- Shared auth: Both read user from httpOnly cookie

**Shell ↔ Member Remote**
- Same as above

**Admin ↔ Member Remote**
- No direct imports (enforced by lint rules)
- Communication via API calls to backend
- Cross-remote notifications via InterAppEventService (optional)

**All Remotes ↔ Backend API**
- RESTful HTTP APIs
- JWT authentication (httpOnly cookies)
- Standard error responses

---

## 10. Deployment Architecture

```
CDN / Web Server:
├── / → shell/index.html (main entry point)
├── /shell/main.js → Shell bundle
├── /shell/remoteEntry.js → Module Federation manifest
├── /admin/main.js → Admin bundle
├── /admin/remoteEntry.js → Module Federation manifest
├── /member/main.js → Member bundle
├── /member/remoteEntry.js → Module Federation manifest
├── /shared/ui.js → Shared UI library
└── /assets/* → Static assets (images, fonts, etc.)

Deployment Process:
1. Build Shell independently: npm run build:shell
2. Build Admin independently: npm run build:admin
3. Build Member independently: npm run build:member
4. Upload each to CDN/server under respective path
5. Shell and remotes can be deployed independently
6. No coordination needed (except shared library version coordination)
```

---

## Next Steps

1. Create API contracts in `contracts/` directory
2. Create developer quickstart in `quickstart.md`
3. Generate implementation tasks in `tasks.md` (Phase 2)
