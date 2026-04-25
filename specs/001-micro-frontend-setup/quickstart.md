# Developer Quickstart Guide

**Purpose**: Help new developers set up, understand, and contribute to the NX Angular Micro Frontend architecture  
**Target Audience**: Developers with Angular experience who are new to the micro frontend architecture  
**Time to Complete**: 30 minutes (setup) + 1 hour (understanding architecture)  

---

## 1. Prerequisites

Before starting, ensure you have:
- **Node.js**: 18+ (verify with `node --version`)
- **npm**: 8+ (verify with `npm --version`)
- **Git**: (verify with `git --version`)
- **Angular CLI**: 15+ (install with `npm install -g @angular/cli@latest`)
- **Code Editor**: VS Code recommended (with Angular Language Service extension)

---

## 2. Initial Setup (15 minutes)

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd haut-spare-ui
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all dependencies for all applications and shared libraries.

### Step 3: Generate NX Configuration
```bash
npx nx --version  # Verify NX is installed
```

### Step 4: Verify Setup
```bash
npm run build  # Build all apps and libraries
npm run lint   # Lint all code
npm run test   # Run all tests
```

Expected output: All builds, lints, and tests pass.

---

## 3. Understanding the Project Structure

```
haut-spare-ui/
├── apps/
│   ├── shell/              # Host application
│   ├── admin/              # Admin remote (user management, reports)
│   └── member/             # Member remote (profile, wallet)
│
├── libs/
│   ├── shared/
│   │   ├── ui/             # Reusable UI components
│   │   ├── auth/           # Authentication (guards, interceptors)
│   │   └── layout/         # Shared layout components
│   │
│   ├── data-access/
│   │   ├── api/            # HTTP services
│   │   └── state/          # State management (NgRx)
│   │
│   ├── feature/            # Feature libraries (optional)
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   └── util/               # Utilities & helpers
│       ├── helpers/
│       ├── constants/
│       └── types/
│
├── tools/
│   └── scripts/
│
├── nx.json                 # NX configuration
├── package.json            # Dependencies
└── README.md
```

### Key Principles
1. **Shell**: Only layout and routing; no business logic
2. **Remotes**: Independent deployments; manage their own state
3. **Shared Libraries**: Available to all apps; versioned separately
4. **Module Federation**: Enables independent loading and scaling

---

## 4. Running the Application

### Development Mode

#### Terminal 1: Shell (Port 4200)
```bash
npm run serve:shell
```

#### Terminal 2: Admin Remote (Port 4201)
```bash
npm run serve:admin
```

#### Terminal 3: Member Remote (Port 4202)
```bash
npm run serve:member
```

#### Open Browser
Navigate to `http://localhost:4200` to see the Shell with remotes loaded.

**Expected Behavior:**
- Shell loads with header, sidebar, footer
- Click "Admin" in sidebar → Admin remote loads
- Click "Member" in sidebar → Member remote loads
- Navigation between remotes is seamless

### Production Build
```bash
npm run build  # Builds all apps and libraries
npm run build:prod  # Production build with optimizations
```

Output is in `dist/` directory.

---

## 5. Adding a New Feature to Shell

**Example**: Add a "Home" dashboard to Shell

### Step 1: Generate Component
```bash
nx g @nx/angular:component shell/home --skip-tests
```

### Step 2: Add Route
Edit `apps/shell/src/app/app-routing.module.ts`:
```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },  // Add this
  { path: 'admin', loadChildren: ... },
  ...
];
```

### Step 3: Add Navigation Link
Edit `apps/shell/src/app/layout/sidebar/sidebar.component.ts`:
```html
<nav>
  <a routerLink="/">Home</a>  <!-- Add this -->
  <a routerLink="/admin">Admin</a>
  <a routerLink="/member">Member</a>
</nav>
```

### Step 4: Test
```bash
npm run serve:shell
```

Navigate to `http://localhost:4200` and verify.

---

## 6. Using Shared UI Components

**Example**: Use a Button component from `shared/ui` library

### Step 1: Import Button Component
```typescript
// In your component
import { Button } from '@haut-spare/shared-ui';

@Component({
  selector: 'app-my-feature',
  template: `
    <app-button (click)="onClick()">Click Me</app-button>
  `,
  imports: [Button]
})
export class MyFeatureComponent {
  onClick() { console.log('Clicked!'); }
}
```

### Step 2: Build & Test
```bash
npm run serve
```

---

## 7. Creating a New Shared Library

**Example**: Create a utility library for date formatting

### Step 1: Generate Library
```bash
nx g @nx/angular:lib util/date --directory libs/util
```

### Step 2: Add Utility Function
Edit `libs/util/date/src/lib/format-date.ts`:
```typescript
export function formatDate(date: Date, format: string): string {
  // Implementation
  return formatted;
}
```

### Step 3: Export from Index
Edit `libs/util/date/src/index.ts`:
```typescript
export * from './lib/format-date';
```

### Step 4: Use in Apps
```typescript
import { formatDate } from '@haut-spare/util-date';

export class MyComponent {
  formatted = formatDate(new Date(), 'MM/dd/yyyy');
}
```

---

## 8. Understanding Module Federation

### What is Module Federation?
Module Federation allows loading remote applications dynamically at runtime, without bundling them together.

```
┌─────────────────────┐
│  Shell (Host)       │
│  - Loads Admin      │
│  - Loads Member     │
│  - Shared deps      │
└─────────────────────┘
    ↓ (loads at runtime)
┌─────────────────────┐
│  Admin Remote       │
│  (independent build)│
└─────────────────────┘

┌─────────────────────┐
│  Member Remote      │
│  (independent build)│
└─────────────────────┘
```

### Configuration
Each app has `module-federation.config.js`:

**Shell Configuration:**
- Declares which remotes it loads (Admin, Member)
- Declares shared dependencies

**Remote Configuration (Admin/Member):**
- Declares which modules it exposes
- Declares shared dependencies

---

## 9. Common Development Tasks

### Running Tests
```bash
npm run test                    # Run all tests
npm run test:shell              # Test only Shell
npm run test:admin              # Test only Admin
nx test --affected              # Test only affected apps
```

### Linting
```bash
npm run lint                    # Lint all code
npm run lint:fix                # Auto-fix lint errors
```

### Building
```bash
npm run build                   # Build all apps
nx build shell                  # Build only Shell
nx build --affected             # Build only affected apps
nx build --prod                 # Production build
```

### Serving
```bash
npm run serve                   # Serve Shell + all remotes
npm run serve:shell             # Serve only Shell
npm run serve:admin             # Serve only Admin
```

### Generate Code
```bash
nx g @nx/angular:component admin/feature-dashboard/my-component --skip-tests
nx g @nx/angular:service data-access/api/services/user
nx g @nx/angular:lib shared/ui/button
```

---

## 10. Authentication Flow

### How Auth Works

1. **Login**
   ```
   User → Shell → Backend (POST /login)
   Backend → Shell: { accessToken, refreshToken } (in httpOnly cookies)
   ```

2. **API Calls**
   ```
   Remote → HttpClient (with interceptor)
   Interceptor → Backend (with httpOnly cookie)
   Backend → Interceptor: 200 OK (data)
   ```

3. **Token Expiration**
   ```
   Remote → HttpClient
   Interceptor → Backend: 401 Unauthorized
   Interceptor → Backend: POST /refresh (with refresh token)
   Backend → Interceptor: new accessToken (in cookie)
   Interceptor → Original Request (retried)
   ```

4. **Logout**
   ```
   User → Shell: Click Logout
   Shell → Backend: POST /logout (clears cookies)
   Backend → Shell: { success }
   Shell → Redirect to login
   ```

---

## 11. API Communication

### Making API Calls

Use the shared `HttpService` or domain-specific services:

```typescript
import { UserService } from '@haut-spare/data-access-api';

@Injectable()
export class AdminFacade {
  constructor(private userService: UserService) {}
  
  getUsers() {
    return this.userService.getUsers();  // Returns Observable<User[]>
  }
}

// In component
export class UsersComponent {
  users$ = this.facade.getUsers();
  
  constructor(private facade: AdminFacade) {}
}

// In template
<table *ngFor="let user of (users$ | async)">
  <tr><td>{{ user.name }}</td></tr>
</table>
```

### Error Handling

```typescript
import { HttpErrorResponse } from '@angular/common/http';

this.userService.getUsers().subscribe({
  next: (users) => this.users = users,
  error: (error: HttpErrorResponse) => {
    if (error.status === 404) {
      this.error = 'Users not found';
    } else if (error.status === 401) {
      // Auth interceptor handles this
    } else {
      this.error = 'Unknown error';
    }
  }
});
```

---

## 12. Troubleshooting

### Issue: "Cannot find module '@admin/feature-shell'"
**Solution**: Ensure Admin remote is running on port 4201
```bash
npm run serve:admin  # In separate terminal
```

### Issue: Build fails with "Module Federation conflict"
**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: Hot Module Replacement (HMR) not working
**Solution**: Restart all dev servers
```bash
# Kill all terminals (Ctrl+C)
npm run serve  # Restart all servers
```

### Issue: Tests fail with "Cannot find shared module"
**Solution**: Shared libraries must be built first
```bash
nx build shared-ui
npm run test
```

---

## 13. Debugging

### Debug in VS Code

1. Add breakpoint in code
2. Run with debugger:
   ```bash
   npm run serve:shell -- --inspect
   ```
3. Open Chrome DevTools (F12)
4. Sources tab → find file → breakpoint hits

### Debug Network Issues

Chrome DevTools → Network tab:
- Check `remoteEntry.js` loads (Module Federation manifest)
- Check API calls include `Authorization` header
- Check response headers include `Set-Cookie: httpOnly`

### Debug State Issues

Install Redux DevTools extension and check state:
```
DevTools → Redux → Actions timeline → State changes
```

---

## 14. Next Steps

After completing this quickstart:

1. **Read the full architecture**: See [data-model.md](data-model.md)
2. **Review API contracts**: See `contracts/` directory
3. **Read implementation plan**: See [plan.md](plan.md)
4. **Pick a feature**: Create a new component in Shell or a Remote
5. **Write tests**: Add unit tests for your component
6. **Deploy**: Build for production and deploy to staging

---

## 15. Useful Links

- **NX Documentation**: https://nx.dev/
- **Angular Documentation**: https://angular.io/docs
- **Module Federation**: https://webpack.js.org/concepts/module-federation/
- **RxJS Documentation**: https://rxjs.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Support

- **Questions?**: Check existing docs in `specs/001-micro-frontend-setup/`
- **Issues?**: See troubleshooting section above
- **Want to contribute?**: Follow development guidelines in README.md
