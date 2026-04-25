# NX Angular Micro Frontend Architecture

A comprehensive micro frontend system using NX monorepo and Angular with Module Federation, featuring independent Shell, Admin, and Member applications with shared libraries and reusable components.

## Project Overview

This project implements a production-ready micro frontend architecture with:

- **NX Monorepo**: Unified build and dependency management
- **Module Federation**: Independent deployment and dynamic remote loading
- **Angular 15+**: Modern framework with TypeScript strict mode
- **Micro Frontends**: Shell (host) + Admin (remote) + Member (remote)
- **Shared Libraries**: Reusable UI, authentication, and API layers
- **JWT Authentication**: Secure httpOnly cookie-based token management
- **RESTful APIs**: Standard HTTP services with error handling and interceptors
- **Independent Scaling**: Each remote can scale independently

## Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Installation

```bash
# Install dependencies
npm install

# Serve all applications
npm run serve

# Verify setup
# Shell: http://localhost:4200
# Admin: http://localhost:4201
# Member: http://localhost:4202
```

### Build

```bash
# Build all applications
npm run build

# Build individual applications
npm run build:shell
npm run build:admin
npm run build:member

# Production build
npm run build:prod
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test:shell
npm run test:admin
npm run test:member

# Lint all code
npm run lint
npm run lint:fix
```

## Project Structure

```
haut-spare-ui/
├── apps/
│   ├── shell/              # Host application
│   ├── admin/              # Admin remote
│   └── member/             # Member remote
├── libs/
│   ├── shared/
│   │   ├── ui/             # Reusable UI components
│   │   ├── auth/           # Authentication logic
│   │   └── layout/         # Shared layout components
│   ├── data-access/
│   │   ├── api/            # HTTP services
│   │   └── state/          # State management
│   ├── feature/            # Feature libraries
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── reports/
│   └── util/               # Utilities
│       ├── helpers/
│       └── constants/
└── specs/
    └── 001-micro-frontend-setup/
        ├── spec.md         # Feature specification
        ├── plan.md         # Implementation plan
        ├── data-model.md   # Architecture design
        ├── research.md     # Technology decisions
        ├── quickstart.md   # Developer guide
        ├── tasks.md        # Implementation tasks
        └── contracts/      # API contracts
```

## Architecture Documentation

- **[Feature Specification](specs/001-micro-frontend-setup/spec.md)**: User stories, requirements, success criteria
- **[Implementation Plan](specs/001-micro-frontend-setup/plan.md)**: Technical context, architecture overview
- **[Data Model](specs/001-micro-frontend-setup/data-model.md)**: Entities, services, integration patterns
- **[Research & Best Practices](specs/001-micro-frontend-setup/research.md)**: Technology decisions and rationale
- **[Developer Quickstart](specs/001-micro-frontend-setup/quickstart.md)**: Setup and common tasks
- **[Implementation Tasks](specs/001-micro-frontend-setup/tasks.md)**: 142 implementation tasks organized by phase

## Key Features

### Shell Application (Host)

- Centralized routing and orchestration
- Layout components (header, sidebar, footer)
- Dynamic remote loading via Module Federation
- Graceful error handling for remote failures
- Authentication bootstrap

### Admin Remote

- Dashboard with metrics
- User management with CRUD operations
- Report generation and viewing
- Independent deployment

### Member Remote

- Profile management
- Wallet and transactions
- Transaction history with filtering
- Independent deployment

### Shared Libraries

- Reusable UI components (Button, Table, Form, Modal, Input, Select)
- Authentication services and guards
- HTTP client with interceptors for auth, error handling, logging
- Utility functions and constants
- State management (optional NgRx per app)

## Authentication Flow

- JWT tokens stored securely in httpOnly cookies
- Automatic token injection via HttpInterceptor
- Token refresh on 401 responses
- Cross-remote coordinate authentication
- Graceful error handling on auth failures

## API Communication

- RESTful HTTP APIs with standard methods
- Centralized HttpService with shared interceptors
- Error transformation and handling
- Optional HTTP caching
- Correlation ID tracking for debugging

## Performance Targets

- Shell bundle: < 250KB (gzipped)
- Remote bundles: < 500KB each (gzipped)
- Remote load time: < 3 seconds
- 10,000 concurrent users
- Sub-100ms routing latency

## Development Workflow

1. **Setup Phase (T001-T010)**: Initialize NX, create directories, install dependencies
2. **Foundational Phase (T011-T026)**: Create shared libraries, services, interceptors
3. **Remote Applications (T027-T071)**: Implement Shell, Admin, Member with features
4. **Feature Libraries (T072-T109)**: Build reusable feature components
5. **Integration (T110-T120)**: Implement routing, navigation, state preservation
6. **Polish & Deployment (T121-T142)**: Testing, monitoring, documentation

See [tasks.md](specs/001-micro-frontend-setup/tasks.md) for complete 142-task breakdown.

## Contributing

1. Follow TypeScript strict mode guidelines
2. Write tests for all new code (target 80%+ coverage)
3. Use shared libraries for reusable code
4. Avoid direct cross-remote imports (use APIs only)
5. Maintain semantic versioning for shared libraries

## License

MIT

## Support

- [Developer Quickstart Guide](specs/001-micro-frontend-setup/quickstart.md)
- [Architecture Overview](specs/001-micro-frontend-setup/data-model.md)
- [Technology Research](specs/001-micro-frontend-setup/research.md)
- [Troubleshooting](specs/001-micro-frontend-setup/quickstart.md#troubleshooting)
