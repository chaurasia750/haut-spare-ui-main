# Implementation Plan: NX Angular Micro Frontend Architecture

**Branch**: `001-micro-frontend-setup` | **Date**: April 25, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-micro-frontend-setup/spec.md`

## Summary

Establish a NX monorepo-based micro frontend architecture with a Shell (host) application and independent Remote applications (Admin, Member) using Module Federation. Each remote is independently deployable while sharing reusable libraries for UI components, authentication, and API communication. All remotes communicate via RESTful APIs with JWT authentication, maintain independent state per remote, and gracefully handle load failures. Shared libraries follow semantic versioning with deprecation periods to enable independent scaling without tight coupling.

## Technical Context

**Language/Version**: TypeScript 5.x, Angular 15+, Node 18+, NX 15.x+  
**Primary Dependencies**: 
  - Angular Core, Routing, HttpClient
  - NX monorepo tooling
  - Webpack Module Federation (rspack or traditional)
  - Angular Material or custom component library (for shared/ui)

**Storage**: N/A (Frontend architecture; backend RESTful API used for data persistence)  
**Testing**: 
  - Unit: Jasmine + Karma
  - Integration: Jasmine + Karma
  - E2E: Cypress or Playwright
  - Module Federation load testing: Custom test utilities

**Target Platform**: Web browsers supporting ES2018+ and dynamic imports (Chrome 76+, Firefox 67+, Safari 12+, Edge 79+)  
**Project Type**: Micro Frontend (Host + Remote applications)  
**Performance Goals**: 
  - Remote application load time: < 3 seconds on broadband
  - Routing latency between remotes: < 100ms
  - System capacity: 10,000 concurrent users

**Constraints**: 
  - Shell bundle size: < 250KB (gzipped)
  - Remote bundle size: < 500KB each (gzipped)
  - API response time: 95% requests complete within 2 seconds
  - Network: Assumes reliable internet connectivity (users can retry on transient failures)

**Scale/Scope**: 
  - 3 applications (Shell, Admin, Member) in Phase 1
  - 5-8 shared libraries (ui, auth, api, state, helpers, constants)
  - 3-5 feature libraries (optional in Phase 1)
  - Extensible to 10+ remotes in future phases

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on micro frontend architecture best practices:

| Principle | Requirement | Status |
|-----------|-------------|--------|
| **Loose Coupling** | Remotes MUST NOT import from each other directly; communication only via APIs or shared libraries | ✓ Spec requirement FR-009 |
| **Independent Deployment** | Each application (Shell, Admin, Member) MUST build and deploy independently | ✓ Spec requirements FR-001, FR-005, FR-007 |
| **Shared Library Contracts** | Shared libraries MUST maintain semantic versioning; breaking changes require deprecation period | ✓ Clarification Q5: Semantic versioning with deprecation |
| **Module Federation Config** | Each remote MUST have explicit Module Federation configuration defining exposed modules | ✓ Architectural requirement |
| **Graceful Failure Handling** | Remotes MUST implement error boundaries; failures in one remote must not crash others | ✓ Clarification Q4: Graceful degradation |
| **Authentication Isolation** | Authentication MUST be managed centrally; all remotes share same httpOnly cookie scope | ✓ Clarification Q2: JWT with httpOnly cookies |
| **State Decoupling** | Each remote MUST manage its own state; Shell has minimal layout state only | ✓ Clarification Q1: Decoupled state per remote |

**All gates PASS** ✓

## Project Structure

### Documentation (this feature)

```text
specs/001-micro-frontend-setup/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (in progress)
├── research.md          # Phase 0 output (research & best practices)
├── data-model.md        # Phase 1 output (architecture design)
├── contracts/           # Phase 1 output (Module Federation contracts)
├── quickstart.md        # Phase 1 output (developer onboarding)
├── checklists/
│   └── requirements.md  # Specification quality validation
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (Repository Root) - NX Monorepo Structure

```text
├── apps/
│   ├── shell/                          # Host application (Shell)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.component.ts
│   │   │   │   ├── app.routes.ts
│   │   │   │   └── app.config.ts
│   │   │   ├── core/
│   │   │   │   ├── services/
│   │   │   │   │   └── shell-config.service.ts
│   │   │   │   └── guards/
│   │   │   ├── layout/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   └── footer/
│   │   │   ├── assets/
│   │   │   └── environments/
│   │   ├── module-federation.config.js
│   │   ├── webpack.config.js
│   │   └── project.json
│   │
│   ├── admin/                          # Admin remote application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── feature-dashboard/
│   │   │   ├── feature-users/
│   │   │   ├── feature-reports/
│   │   │   ├── assets/
│   │   │   └── environments/
│   │   ├── module-federation.config.js
│   │   └── project.json
│   │
│   └── member/                         # Member remote application
│       ├── src/
│       │   ├── app/
│       │   ├── feature-profile/
│       │   ├── feature-wallet/
│       │   ├── feature-history/
│       │   ├── assets/
│       │   └── environments/
│       ├── module-federation.config.js
│       └── project.json
│
├── libs/
│   ├── shared/
│   │   ├── ui/                         # Reusable UI components
│   │   │   ├── src/
│   │   │   │   ├── lib/
│   │   │   │   │   ├── button/
│   │   │   │   │   ├── table/
│   │   │   │   │   ├── form/
│   │   │   │   │   └── modal/
│   │   │   │   └── index.ts
│   │   │   ├── package.json
│   │   │   └── project.json
│   │   │
│   │   ├── auth/                       # Authentication logic
│   │   │   ├── src/
│   │   │   │   ├── lib/
│   │   │   │   │   ├── guards/
│   │   │   │   │   ├── interceptors/
│   │   │   │   │   └── services/
│   │   │   │   └── index.ts
│   │   │   └── project.json
│   │   │
│   │   └── layout/                     # Shared layout components
│   │       └── project.json
│   │
│   ├── data-access/
│   │   ├── api/                        # HTTP communication layer
│   │   │   ├── src/
│   │   │   │   ├── lib/
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── http.service.ts
│   │   │   │   │   │   ├── user.service.ts
│   │   │   │   │   │   └── admin.service.ts
│   │   │   │   │   └── interceptors/
│   │   │   │   └── index.ts
│   │   │   └── project.json
│   │   │
│   │   └── state/                      # State management (optional NgRx)
│   │       └── project.json
│   │
│   ├── feature/                        # Domain-specific feature libraries
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── reports/
│   │
│   └── util/                           # Utilities and helpers
│       ├── helpers/
│       ├── constants/
│       └── types/
│
├── tools/
│   ├── scripts/
│   └── generators/
│
├── nx.json                             # NX workspace configuration
├── tsconfig.base.json                  # TypeScript base config
├── package.json                        # Root dependencies
├── .nxignore                           # NX ignore patterns
└── angular.json                        # Angular CLI configuration (legacy)
```

**Structure Decision**: 
- **NX Monorepo** selected for unified build configuration and dependency management
- **Three Applications** (Shell, Admin, Member) in separate `apps/` directory for clear ownership
- **Shared Libraries** in `libs/` organized by domain (shared, data-access, feature, util)
- **Module Federation** enabled per-app with independent webpack configs
- **Independent Build Output**: Each app builds to `dist/apps/{app-name}`
- **Optional: Package.json per library** for independent versioning and publishing to npm registry

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
