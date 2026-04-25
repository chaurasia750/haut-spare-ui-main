# Module Federation Contract: Shell Application

**Role**: Host application (Shell)  
**Module Federation**: Exposes remotes and loads them dynamically  
**Module Count**: 0 (loads remotes, not exposed as remote itself)  

---

## Shell Configuration

**Port**: 4200 (development)  
**Deployed Path**: `/` (root)  
**Remote Entry**: Not applicable (Shell is host, not remote)

---

## Loaded Remotes

Shell loads the following remotes dynamically via Module Federation:

| Remote | Module Entry | Exposed As | Config Path | Deployment Path |
|--------|--------------|-----------|-------------|-----------------|
| **Admin** | `AdminModule` | `@admin/feature-shell` | `apps/admin/module-federation.config.js` | `/admin` |
| **Member** | `MemberModule` | `@member/feature-shell` | `apps/member/module-federation.config.js` | `/member` |

---

## Shared Dependencies

Shell declares the following shared dependencies for all remotes:

```javascript
// webpack.config.js - shared configuration
shared: {
  "@angular/core": { 
    singleton: true, 
    strictVersion: false 
  },
  "@angular/router": { 
    singleton: true, 
    strictVersion: false 
  },
  "@angular/common": { 
    singleton: true, 
    strictVersion: false 
  },
  "@angular/platform-browser": { 
    singleton: true, 
    strictVersion: false 
  },
  "@angular/forms": { 
    singleton: true, 
    strictVersion: false 
  },
  "rxjs": { 
    singleton: true, 
    strictVersion: false 
  },
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
  }
}
```

---

## Shell Responsibilities

### Layout & Navigation
- Persistent header with logo and global navigation
- Sidebar with links to remotes (Admin, Member, etc.)
- Footer with copyright and links
- Navigation state management (sidebar open/closed, current route)

### Authentication Bootstrap
- Check if user is authenticated (read httpOnly cookie)
- If not authenticated, show login page or redirect to auth service
- Display current user info in header
- Provide logout functionality

### Remote Loading Orchestrator
- Detect which remote to load based on URL route
- Show loading indicator while remote bundles are fetched
- Handle remote loading failures gracefully (error UI with retry)
- Manage Module Federation configuration

### Error Boundaries
- Catch errors from remotes
- Display error UI without crashing entire app
- Provide retry mechanism for users
- Log errors for monitoring

---

## No Business Logic in Shell

Shell MUST NOT contain:
- ❌ Dashboard logic
- ❌ User management logic
- ❌ Admin-specific features
- ❌ Member profile management
- ❌ Wallet/transaction logic
- ❌ Report generation
- ❌ Any domain-specific state management

---

## API Calls

Shell itself makes NO direct API calls. It only:
1. Loads authentication state from httpOnly cookies (automatically)
2. Delegates all business API calls to remotes
3. Remotes call backend via shared `@haut-spare/data-access-api`

---

## Routing Configuration

Shell routes:
```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => 
      import('@admin/feature-shell').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'member',
    loadChildren: () => 
      import('@member/feature-shell').then(m => m.MEMBER_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
```

Each remote is responsible for its own routes within its namespace:
- Admin routes start with `/admin/*`
- Member routes start with `/member/*`

---

## Event Bus (Inter-App Communication)

Shell provides an optional event bus for cross-remote notifications:

```typescript
// Exposed service
export class InterAppEventService {
  userUpdated$ = new Subject<User>();
  notificationAdded$ = new Subject<Notification>();
  
  emitUserUpdated(user: User) { this.userUpdated$.next(user); }
  emitNotification(notification: Notification) { this.notificationAdded$.next(notification); }
}
```

---

## Testing Contract

Shell is tested for:
- ✅ Loads without errors (module federation available)
- ✅ Header and sidebar render correctly
- ✅ Routes to `/admin` load Admin remote
- ✅ Routes to `/member` load Member remote
- ✅ Gracefully handles Admin remote failure (shows error UI, retry works)
- ✅ Gracefully handles Member remote failure
- ✅ Logout clears user state
- ✅ Remote switching doesn't lose navigation context

---

## Configuration Example

```javascript
// webpack.config.js (Shell)
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
    uniqueName: "shell",
    publicPath: "auto",
    scriptType: "text/javascript"
  },
  optimization: {
    runtimeChunk: false
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      remotes: {
        admin: "admin@http://localhost:4201/remoteEntry.js",
        member: "member@http://localhost:4202/remoteEntry.js"
      },
      shared: share({
        "@angular/core": { singleton: true, strictVersion: false },
        "@angular/router": { singleton: true, strictVersion: false },
        "@angular/common": { singleton: true, strictVersion: false },
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

## Versioning

Shell versioning:
- Independent semantic versioning
- Breaking changes trigger major version bump
- Shell updates don't require remote redeployment (backward compatible remotes continue working)
