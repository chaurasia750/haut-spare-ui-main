# Haut Spare UI - NX Angular Micro Frontend Constitution

**Version**: 1.0.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25

---

## 1. PURPOSE

This constitution defines mandatory architectural, structural, and development rules for the NX Angular Micro Frontend system.

All developers, reviewers, and AI agents (including Copilot) MUST strictly follow this document.

**Non-compliance is NOT permitted.**

---

## 2. ARCHITECTURE PRINCIPLES

1. **MUST**: Follow Micro Frontend Architecture with isolated, independently deployable modules
2. **MUST**: Use NX Monorepo for build orchestration and dependency management
3. **MUST**: Consist of exactly:
   - One Shell (Host Application) - orchestrator only
   - Multiple Remotes (Admin, Member, and future modules) - domain-specific logic
4. **MUST**: Shell acts only as an orchestrator, NOT a business logic container
5. **MUST**: Remotes contain all business logic and domain features

---

## 3. APPLICATION STRUCTURE

```
apps/
├── shell/          (Host application - routing & layout)
├── admin/          (Remote - admin domain)
└── member/         (Remote - member domain)

libs/
├── shared/         (Shared by all apps)
│   ├── ui/         (Reusable UI components)
│   ├── auth/       (Authentication & security)
│   └── layout/     (Layout components - header, footer, sidebar)
├── data-access/    (API & state management)
│   ├── api/        (HTTP services, interceptors)
│   └── state/      (Global state management)
├── feature/        (Feature-specific libraries)
│   ├── dashboard/
│   ├── profile/
│   └── reports/
└── util/           (Utilities & helpers)
    ├── helpers/    (Functions, formatters, validators)
    └── constants/  (App-wide constants)

tools/              (Build scripts, code generation)
```

---

## 4. APPLICATION BOUNDARIES (MANDATORY)

1. **Each application MUST be isolated** - no shared component state
2. **Applications MUST NOT directly depend on other applications** - strict module boundary
3. **All shared logic MUST be placed in libraries** - follow DRY principle
4. **Each remote MUST be independently deployable** - can be versioned & deployed separately
5. **Each remote MUST expose its own routing entry** - self-contained route configuration

**Violation Examples**:
- ❌ Admin importing from Member
- ❌ Shared logic in Shell
- ❌ Hard-coded cross-app navigation

---

## 5. SHELL APPLICATION RULES (MANDATORY)

The Shell **MUST**:
- Handle global routing and route orchestration
- Provide shared layout (header, sidebar, footer)
- Load remote applications via Module Federation
- Manage global authentication state
- Handle error boundaries and loading states

The Shell **MUST NOT**:
- Contain business logic (admin, member features)
- Contain feature implementation
- Access remote application internals
- Implement domain-specific services
- Duplicate logic from libraries

---

## 6. REMOTE APPLICATION RULES (MANDATORY)

Each Remote **MUST**:
- Own its complete domain logic
- Contain features only related to its domain
- Be independently testable and deployable
- Expose clean routing contracts
- Use shared libraries for common functionality

Each Remote **MUST NOT**:
- Import from other remotes (strict boundary)
- Duplicate shared logic
- Handle global layout or shell concerns
- Access other remote internals
- Share state directly with other remotes

---

## 7. SHARED LIBRARY RULES (MANDATORY)

1. **All reusable logic MUST be placed in libs** - no duplication
2. **Libraries MUST NOT depend on applications** - unidirectional dependency
3. **Libraries SHOULD be loosely coupled** - minimize internal dependencies
4. **Circular dependencies are STRICTLY PROHIBITED** - will cause runtime failures
5. **Libraries MUST export via index.ts** - barrel export pattern
6. **Libraries MUST have clear purpose** - single responsibility

**Library Categories**:
- **shared/ui**: UI components (Button, Table, Form, Modal, etc.)
- **shared/auth**: Authentication, guards, interceptors, token management
- **shared/layout**: Header, Sidebar, Footer components
- **data-access/api**: HTTP services, error handling, interceptors
- **data-access/state**: Global state, shared observables
- **feature/***: Feature-specific components & services
- **util/helpers**: Pure functions, formatters, validators
- **util/constants**: Application constants, enums, types

---

## 8. NAMING CONVENTION (MANDATORY)

**Applications**: kebab-case
- `shell`, `admin`, `member`

**Libraries**: kebab-case with prefix
- `@haut-spare/shared-ui`
- `@haut-spare/shared-auth`
- `@haut-spare/data-access-api`
- `@haut-spare/feature-dashboard`
- `@haut-spare/util-helpers`

**Files**: kebab-case ONLY
- ✅ `user-list.component.ts`
- ✅ `auth.guard.ts`
- ❌ `userList.component.ts`
- ❌ `AuthGuard.ts`

**Classes**: PascalCase
- `UserListComponent`, `AuthGuard`, `HttpService`

**Variables**: camelCase
- `currentUser`, `isLoading`, `errorMessage`

---

## 9. COMPONENT STRUCTURE (MANDATORY)

**Inline templates are STRICTLY PROHIBITED**  
**Inline styles are STRICTLY PROHIBITED**

Each component MUST follow strict file separation:

```
component-name/
├── component-name.component.ts        (Component logic)
├── component-name.component.html      (Template)
├── component-name.component.scss      (Styles)
└── component-name.component.spec.ts   (Tests)
```

**Rules**:
- Template MUST be in separate `.html` file
- Styles MUST be in separate `.scss` or `.css` file
- Component MUST use `templateUrl` and `styleUrls`
- Unit tests MUST be co-located with component
- No exceptions permitted

---

## 10. FEATURE STRUCTURE

Each feature module MUST follow:

```
feature-name/
├── components/          (Reusable UI components)
│   └── component-name/
├── pages/              (Container components - smart components)
│   └── page-name/
├── services/           (Business logic)
│   └── feature.service.ts
├── models/             (TypeScript interfaces/types)
│   └── feature.model.ts
├── feature.module.ts   (Module definition)
└── feature-routing.module.ts
```

**Rules**:
- **Pages** → Container components with state management
- **Components** → Reusable, presentational UI
- **Services** → Business logic, API calls, state management
- **Models** → TypeScript interfaces, types, enums
- **Routing** → Lazy-loaded routes

---

## 11. ROUTING RULES (MANDATORY)

1. **All routing MUST be lazy-loaded** - improve performance
2. **Shell SHALL define top-level routes** - orchestration point
3. **Remotes SHALL expose route configurations** - self-contained
4. **Hardcoded cross-app navigation is PROHIBITED** - use routing service
5. **Route guards MUST validate access** - authentication & authorization
6. **404 handling MUST be implemented** - graceful error display

**Example**:
```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('admin/Module')
      .then(m => m.AdminModule),
    canActivate: [AuthGuard]
  }
];
```

---

## 12. AUTHENTICATION RULES (MANDATORY)

1. **Authentication MUST be centralized in shared/auth** - single source of truth
2. **Token handling MUST NOT be duplicated** - use TokenService
3. **All API calls MUST pass through interceptor** - enforce security
4. **Guards MUST be reusable** - AuthGuard, RoleGuard, etc.
5. **Token refresh MUST be automatic** - 401 interceptor
6. **Logout MUST clear all state** - prevent stale data

**Interceptor Chain**:
1. AuthInterceptor - add token to request
2. ErrorInterceptor - handle errors globally
3. LoggingInterceptor - track requests
4. CachingInterceptor - optimize responses

---

## 13. DATA & STATE RULES

1. **State MUST NOT be shared directly between remotes** - strict isolation
2. **Shared state MUST use one of**:
   - API (via HTTP service)
   - Shared libraries (via BehaviorSubject)
3. **Global state SHOULD be minimized** - prefer local state
4. **State updates MUST be predictable** - observable pattern
5. **State MUST be immutable** - prevent side effects

**Pattern**: RxJS BehaviorSubject + Observable<T>
```typescript
private stateSubject = new BehaviorSubject<State>(initialState);
public state$ = this.stateSubject.asObservable();
```

---

## 14. DEPENDENCY RULES (MANDATORY)

1. **Remote-to-remote dependency is STRICTLY PROHIBITED** - architectural violation
2. **Only libraries may be shared** - controlled imports
3. **Third-party dependencies MUST be controlled** - via package.json
4. **Duplicate dependencies MUST be avoided** - shared dependencies
5. **Peer dependencies MUST be declared** - explicit requirements
6. **Version conflicts MUST be resolved** - consistent versions

**Allowed**:
- ✅ Shell → Library
- ✅ Remote → Library
- ✅ Library → Library (no circular)

**Forbidden**:
- ❌ Remote → Remote
- ❌ Shell → Remote
- ❌ Library → Application

---

## 15. PERFORMANCE RULES (MANDATORY)

1. **Lazy loading is MANDATORY** - for all feature modules
2. **Bundle size MUST be optimized** - monitor with webpack-bundle-analyzer
3. **Shared dependencies SHOULD be reused** - via Module Federation
4. **Large modules MUST be split** - code-splitting strategy
5. **Change detection MUST be OnPush** - when possible
6. **HTTP requests MUST be cached** - reduce server load

**Targets**:
- Shell bundle: < 500KB
- Remote bundle: < 1MB
- Total initial: < 2.5MB

---

## 16. CODE GENERATION RULES (AI / COPILOT - MANDATORY)

AI-generated code **MUST**:
- ✅ Follow folder structure exactly
- ✅ Use correct domain placement
- ✅ Use existing libraries (no duplication)
- ✅ Follow naming conventions
- ✅ Maintain separation of concerns
- ✅ Include TSDoc comments
- ✅ Be type-safe (strict mode)

AI **MUST NOT**:
- ❌ Create inline templates
- ❌ Create inline styles
- ❌ Add business logic in shell
- ❌ Introduce tight coupling
- ❌ Break architecture rules
- ❌ Duplicate existing functionality
- ❌ Skip error handling

---

## 17. FILE ORGANIZATION RULES

Each file MUST belong to a logical domain. Rules:
- No random file placement
- No mixing of concerns
- Folder structure MUST be consistent
- Related files MUST be co-located
- Imports MUST follow barrel export pattern

---

## 18. SCALABILITY RULES

When adding new functionality:

```
IF feature is shared across apps:
  → Create in libs/shared/* or libs/feature/*

IF feature is domain-specific (admin only):
  → Add to apps/admin/*

IF feature is independent module:
  → Create new remote app (future)

IF feature is utility/helper:
  → Add to libs/util/*
```

**Adding New Remote**:
1. Create `apps/new-remote/`
2. Configure Module Federation
3. Implement routing entry
4. Add to Shell route configuration
5. Document in README

---

## 19. BUILD & DEPLOYMENT RULES

**Build Output**:
```
dist/
├── apps/
│   ├── shell/          (Main app - entry point)
│   ├── admin/          (Remote - standalone)
│   └── member/         (Remote - standalone)
└── libs/               (Compiled libraries)
```

**Deployment Options**:

**Option 1 - Single Domain**:
- `https://domain.com/` → Shell
- `https://domain.com/admin` → Admin Remote
- `https://domain.com/member` → Member Remote

**Option 2 - Subdomains**:
- `https://app.domain.com/` → Shell
- `https://admin.domain.com/` → Admin Remote
- `https://member.domain.com/` → Member Remote

**Rules**:
- Each application MUST build independently
- Module Federation MUST be configured correctly
- Remotes MUST be served from predictable URLs

---

## 20. TESTING RULES (MANDATORY)

1. **Each app MUST be independently testable** - isolated test suites
2. **Shared libraries MUST have unit tests** - >80% coverage
3. **Critical flows MUST be tested** - auth, payment, etc.
4. **Integration tests MUST validate contracts** - app boundaries
5. **E2E tests MUST cover user journeys** - acceptance criteria

**Test Types**:
- Unit: Component/Service logic
- Integration: Library/App boundaries
- E2E: User workflows

---

## 21. VERSION CONTROL RULES (MANDATORY)

**Branch Structure**:
- `main` → Production-ready code
- `develop` → Integration branch
- `feature/*` → Feature branches
- `bugfix/*` → Bug fix branches
- `release/*` → Release branches

**Branch Naming**:
- ✅ `feature/user-authentication`
- ✅ `bugfix/login-redirect`
- ❌ `user-auth`, `bug-fix`

**Pull Requests**:
- Every change MUST go through PR
- Minimum 1 code review REQUIRED
- Constitution violations → REJECT
- Tests MUST pass before merge

---

## 22. COMMIT RULES (MANDATORY)

**Commit Format**:
```
type(scope): description

Body (optional)
- Details about changes
- Why this change is needed
- Impact on other modules
```

**Commit Types**:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code restructure (no functional change)
- `chore` - Build, dependencies, tooling
- `test` - Test additions/fixes
- `docs` - Documentation
- `perf` - Performance improvements

**Examples**:
- ✅ `feat(auth): add password reset functionality`
- ✅ `fix(admin): resolve user list pagination bug`
- ✅ `refactor(shared-ui): simplify button component`

---

## 23. PROHIBITED PRACTICES (STRICTLY FORBIDDEN)

The following practices will result in code rejection:

1. ❌ **Cross-remote imports** - Remote A importing from Remote B
2. ❌ **Business logic in shell** - Shell MUST be orchestrator only
3. ❌ **Inline templates** - All templates in separate .html files
4. ❌ **Inline styles** - All styles in separate .scss files
5. ❌ **Code duplication** - Must use shared libraries
6. ❌ **Circular dependencies** - Violates NX principles
7. ❌ **Tight coupling** - Services must be injectable & testable
8. ❌ **Hardcoded URLs** - Must use environment configuration
9. ❌ **Direct DOM manipulation** - Use Angular templates
10. ❌ **Magic strings** - Use constants instead

---

## 24. CODE REVIEW ENFORCEMENT (MANDATORY)

Every Pull Request MUST:
- ✅ Follow this constitution
- ✅ Be reviewed for architectural violations
- ✅ Have passing tests
- ✅ Have updated documentation
- ✅ Have meaningful commit messages

**Violation Response**:
- Constitutional violation → **MUST REJECT**
- Request changes with explanation
- Do NOT merge until fixed

---

## 25. TEAM RESPONSIBILITY

**Shell Team**:
- Core architecture decisions
- Routing orchestration
- Global layout components
- Performance optimization
- Integration with remotes

**Admin Team**:
- Admin-specific features
- Admin routing
- Admin services
- Admin business logic

**Member Team**:
- Member-specific features
- Member routing
- Member services
- Member business logic

**Shared Libraries Team** (Cross-team):
- UI component library maintenance
- Authentication service updates
- API layer improvements
- Utility library enhancements

---

## 26. FINAL PRINCIPLES

1. **Structure over shortcuts** - Architecture before convenience
2. **Scalability over speed** - Long-term maintainability prioritized
3. **Consistency over flexibility** - Predictable patterns throughout
4. **Isolation over convenience** - Strict module boundaries
5. **Observable over hidden** - Explicit patterns and dependencies

---

## 27. GOLDEN RULE

### "NO CODE SHALL BREAK ARCHITECTURE."

Every line of code must respect:
- Module boundaries
- Dependency rules
- File organization
- Naming conventions
- Component structure
- Security practices

Failure to comply = Code rejection.

---

## 28. AMENDMENT PROCEDURE

To amend this constitution:
1. Create issue describing proposed amendment
2. Justify why current rule is insufficient
3. Propose specific changes
4. Get team consensus (75%+ approval)
5. Document amendment with date
6. Update version number (semantic versioning)
7. Notify all teams of changes

**Version Bump Criteria**:
- MAJOR: Principle removal or fundamental rule change
- MINOR: New rule or section added
- PATCH: Clarification or non-semantic refinement

---

## 29. EFFECTIVE DATE & ENFORCEMENT

**Effective Date**: 2026-04-25

**Enforcement**:
- All new code MUST comply immediately
- Existing violations MUST be tracked
- Migration plan for legacy code (if any)
- Regular audits to ensure compliance

**Violations will result in**:
- PR rejection
- Code review feedback
- Potential team discussion

---

**Constitution Version**: 1.0.0 | **Ratified**: 2026-04-25 | **Last Amended**: 2026-04-25

**Status**: ✅ Active and Enforced

