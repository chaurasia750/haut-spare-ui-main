# Feature Specification: NX Angular Micro Frontend Architecture

**Feature Branch**: `001-micro-frontend-setup`  
**Created**: April 25, 2026  
**Status**: Draft  
**Input**: User description: "NX ANGULAR MICRO FRONTEND – PROJECT SPECIFICATION"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Shell Application Setup (Priority: P1)

Development teams can initialize the Shell (host application) that serves as the centralized entry point and orchestration layer for all remote applications.

**Why this priority**: The Shell is foundational to the entire micro frontend architecture. Without it, remote applications cannot be loaded or coordinated. This is the first piece that must be established.

**Independent Test**: Shell application is accessible at the root path, displays layout with header/sidebar/footer, and successfully routes to remote applications.

**Acceptance Scenarios**:

1. **Given** Shell application is built, **When** user accesses the application root, **Then** they see the main layout (header, sidebar, footer)
2. **Given** Shell is running, **When** user navigates to `/admin`, **Then** the Admin remote application loads
3. **Given** Shell is running, **When** user navigates to `/member`, **Then** the Member remote application loads
4. **Given** user is unauthenticated, **When** they access the Shell, **Then** they are redirected to the authentication bootstrap service

---

### User Story 2 - Admin Remote Application Setup (Priority: P1)

Development teams can build and deploy the Admin remote application independently with its own feature modules for dashboard, user management, and reporting.

**Why this priority**: Admin functionality is critical for platform operations. It must be independently deployable while remaining loosely coupled from the Shell.

**Independent Test**: Admin application loads when routed from Shell, displays dashboard with admin features, and operates independently of Member application.

**Acceptance Scenarios**:

1. **Given** Shell routes to `/admin`, **When** Admin application loads, **Then** the dashboard feature is displayed
2. **Given** Admin is loaded, **When** user navigates to user management, **Then** the user management feature is displayed
3. **Given** Admin is loaded, **When** user accesses reporting module, **Then** reports are displayed
4. **Given** Admin application is deployed, **When** Shell is updated, **Then** Admin continues functioning without redeployment

---

### User Story 3 - Member Remote Application Setup (Priority: P1)

Development teams can build and deploy the Member remote application independently with its own feature modules for profile management, wallet, and transaction history.

**Why this priority**: Member-facing features are core to the platform's value proposition. Independent deployment ensures member experience is not blocked by admin changes.

**Independent Test**: Member application loads when routed from Shell, displays member profile and wallet features, and operates independently of Admin application.

**Acceptance Scenarios**:

1. **Given** Shell routes to `/member`, **When** Member application loads, **Then** the profile feature is displayed
2. **Given** Member is loaded, **When** user accesses wallet, **Then** wallet transactions are displayed
3. **Given** Member is loaded, **When** user accesses history, **Then** transaction history is shown
4. **Given** Member application is deployed, **When** Admin is updated, **Then** Member continues functioning without redeployment

---

### User Story 4 - Shared Libraries for Code Reuse (Priority: P1)

Development teams across Admin and Member applications can reuse common UI components, authentication logic, and utilities without code duplication.

**Why this priority**: Shared libraries are essential to preventing tight coupling and enabling independent scaling. Without this, maintaining consistency and reducing code duplication becomes impossible.

**Independent Test**: UI components from `shared/ui` library are imported and used by both Admin and Member applications and render consistently.

**Acceptance Scenarios**:

1. **Given** a UI component exists in `shared/ui`, **When** Admin application imports it, **Then** it renders correctly
2. **Given** a UI component exists in `shared/ui`, **When** Member application imports it, **Then** it renders identically to Admin's usage
3. **Given** authentication logic exists in `shared/auth`, **When** Admin checks authorization, **Then** guards and interceptors work as expected
4. **Given** a utility function exists in `util/helpers`, **When** both applications use it, **Then** they get the same behavior

---

### User Story 5 - API Data Access Layer (Priority: P2)

Development teams can integrate with backend services through a centralized API communication layer without duplicating HTTP logic.

**Why this priority**: While important, the API layer can be developed in parallel with application features. It's decoupled from the Shell/Remote architecture.

**Independent Test**: API calls from both Admin and Member applications use the same HTTP service layer and interceptors, with token injection and error handling working consistently.

**Acceptance Scenarios**:

1. **Given** an API service exists in `data-access/api`, **When** Admin makes an API call, **Then** the request includes proper authentication tokens
2. **Given** an API call is made, **When** the response includes an error, **Then** error handling interceptor processes it consistently
3. **Given** both Admin and Member applications make API calls, **When** tokens expire, **Then** both trigger refresh logic identically

---

### User Story 6 - Feature Library Integration (Priority: P2)

Development teams can create reusable feature libraries for common business logic that both applications need (e.g., dashboard, profile management) without duplicating feature code.

**Why this priority**: Feature libraries accelerate development for shared domains, but can be introduced incrementally as patterns emerge.

**Independent Test**: A feature library for dashboard can be imported by both Admin and Member applications without conflicts or code duplication.

**Acceptance Scenarios**:

1. **Given** a feature library exists in `feature/dashboard`, **When** Admin imports it, **Then** it provides all dashboard functionality
2. **Given** the same feature library is used by Member, **When** both render the dashboard, **Then** the user experience is consistent

---

### User Story 7 - Centralized Routing and Navigation (Priority: P1)

Users can navigate between Shell layout and remote applications seamlessly with lazy-loaded routes and proper navigation state management.

**Why this priority**: Navigation is a core user experience concern. Without proper routing, the micro frontend architecture fails from a UX perspective.

**Independent Test**: User can navigate from Shell to Admin to Member back to Shell without losing application state or experiencing routing errors.

**Acceptance Scenarios**:

1. **Given** user is on Shell home, **When** they click Admin navigation link, **Then** Admin application loads at `/admin` route
2. **Given** user is in Admin, **When** they navigate to Member via navigation menu, **Then** Member application loads at `/member` route
3. **Given** routes are deep-linked (e.g., `/admin/users`), **When** user accesses the URL directly, **Then** Shell and Admin load correctly and show the right feature
4. **Given** a route is lazily loaded, **When** user navigates to it, **Then** the application bundle is loaded only at that moment

---

### User Story 8 - New Module Scalability (Priority: P3)

Development teams can add new independent modules (either as new Remote applications or Feature libraries) without affecting existing Shell or Remote applications.

**Why this priority**: This is a future-proofing requirement that validates the architecture's extensibility. It's less critical for initial setup but important for long-term viability.

**Independent Test**: A new Remote application can be created, registered with Module Federation, and routed from Shell without requiring changes to Admin or Member.

**Acceptance Scenarios**:

1. **Given** a new Remote application is created, **When** it's registered in Module Federation configuration, **Then** Shell can route to it
2. **Given** Shell is deployed without the new Remote, **When** the new Remote is deployed independently, **Then** Shell can discover and load it without redeployment

---

### Edge Cases

- What happens when a Remote application fails to load (network error, build failure)?
- How does the system handle network disconnection while switching between remotes?
- What happens when a shared library has a breaking change?
- How are token refreshes handled across multiple running remotes?
- What happens when Module Federation routes conflict between remotes?
- How does the Shell handle backward compatibility when remotes use different versions of shared libraries?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Shell application that acts as the host container for all remote applications
- **FR-002**: Shell application MUST include layout components (header, sidebar, footer) that persist across route changes
- **FR-003**: Shell application MUST implement centralized routing that delegates to remote applications via Module Federation
- **FR-004**: Shell application MUST bootstrap authentication before loading remote applications
- **FR-005**: Admin remote application MUST be independently deployable and loadable via Module Federation at `/admin` route
- **FR-006**: Admin application MUST include feature modules for dashboard, user management, and reporting
- **FR-007**: Member remote application MUST be independently deployable and loadable via Module Federation at `/member` route
- **FR-008**: Member application MUST include feature modules for profile management, wallet, and transaction history
- **FR-009**: Both Remote applications MUST NOT import from each other directly (no cross-remote imports)
- **FR-010**: Shared libraries in `libs/shared` MUST provide reusable UI components (buttons, tables, forms, modals)
- **FR-011**: Shared libraries MUST provide centralized authentication logic (guards, interceptors, token handling)
- **FR-012**: Data access layer MUST provide HTTP communication services without framework-specific dependencies
- **FR-013**: System MUST support lazy loading for all remote applications and feature modules
- **FR-014**: System MUST enforce separation of concerns: Shell has no business logic, only orchestration
- **FR-015**: System MUST use NX monorepo structure with separate apps/ and libs/ directories
- **FR-016**: All inter-application communication MUST go through shared libraries or API services
- **FR-017**: System MUST support independent versioning of remote applications
- **FR-018**: Each remote MUST have its own build output independent of other remotes

### Key Entities

- **Shell Application**: The host container that orchestrates all remote applications, manages layout, and handles global routing
- **Admin Remote Application**: Independent remote serving admin domain features (dashboard, users, reports)
- **Member Remote Application**: Independent remote serving member domain features (profile, wallet, history)
- **Shared Libraries**: Reusable code packages for UI components, authentication, API communication, and utilities
- **Feature Libraries**: Domain-specific reusable feature packages
- **Data Access Layer**: Centralized service for API communication and state management

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three applications (Shell, Admin, Member) build and deploy independently without cross-application dependencies
- **SC-002**: Developers can make changes to Admin application and deploy it without redeploying Shell or Member
- **SC-003**: Developers can make changes to Member application and deploy it without redeploying Shell or Admin
- **SC-004**: Remote application load time is under 3 seconds on standard broadband connection
- **SC-005**: Shared library updates maintain 100% backward compatibility or provide clear migration path
- **SC-006**: New developers can set up the development environment and run all applications in under 30 minutes
- **SC-007**: Code duplication across applications decreases by at least 60% through use of shared libraries compared to monolithic approach
- **SC-008**: System supports 10,000 concurrent users with sub-100ms routing latency between remotes
- **SC-009**: Bundle size for Shell application is under 250KB (gzipped) to maintain fast initial load
- **SC-010**: Each Remote application bundle is independently under 500KB (gzipped)
- **SC-011**: 95% of API requests complete within 2 seconds
- **SC-012**: New Remote applications can be added to the architecture with minimal changes to Shell (under 5 lines of configuration)

## Assumptions

- **User Base**: Development teams have experience with Angular and understand modular architecture concepts
- **Deployment Environment**: System will be deployed to a modern hosting platform that supports serving multiple SPAs from a single domain with subpath routing
- **Network Stability**: Users have reliable internet connectivity for loading multiple remote applications
- **Browser Compatibility**: Target browsers support ES2018+ and dynamic imports (all modern browsers)
- **Build Process**: NX monorepo tooling and Module Federation are properly configured in the build pipeline
- **Shared Libraries Stability**: Shared libraries follow semantic versioning and maintain backward compatibility within major versions
- **Authentication System**: Existing authentication system (centralized token storage) will be reused; new implementation not in scope
- **API Backend**: RESTful API backend exists and is accessible for data access
- **Feature Priority**: Phase 1 focuses on architecture setup; advanced state management (NgRx) is optional for Phase 1
- **Mobile Support**: Mobile-first design considerations apply to all components; full mobile optimization is Phase 2 or later
- **Team Size**: Architecture supports teams of 3-10 developers working independently on each application
- **Technology Versions**: Angular 15+, Node 18+, NX 15+
- **CI/CD Pipeline**: Automated build and deployment pipeline exists to support independent remote deployments

## Clarifications

### Session April 25, 2026

- Q: How should state be managed across Shell and Remote applications? → A: Decoupled state per remote. Each Remote manages its own state independently. Shell maintains only layout/navigation state. Remotes communicate via APIs or events for consistency.
- Q: Which authentication protocol should be used for token management? → A: JWT with stateless httpOnly cookies. Tokens stored securely in httpOnly cookies, no JavaScript access. Coordinated refresh across remotes handled by interceptors.
- Q: What API communication pattern should the system use? → A: RESTful HTTP APIs. Standard REST endpoints with JSON payloads. HttpClient + interceptors for auth and error handling.
- Q: How should remote applications handle failures to load or network errors? → A: Graceful degradation with retry logic and fallback UI. Failed remotes show error message in their section; other remotes remain functional. Users can retry without reloading the app.
- Q: How should shared libraries handle breaking changes and versioning? → A: Semantic versioning with deprecation periods and migration guides. Mark old APIs as deprecated, maintain for 2+ releases, provide clear upgrade path.

### State Management (Updated)

Based on clarification, the architecture uses the following state strategy:

- **Shell State**: Limited to layout state (sidebar visibility, theme, global navigation context)
- **Remote State**: Each Remote application manages its own state independently
- **Communication**: Remotes communicate with Shell via:
  - Event-based messaging for cross-application notifications
  - API calls for data consistency
  - Shared authentication state (read-only from Shell)
- **Benefits**: Maximum isolation, independent deployment, true micro frontend autonomy
- **Implementation Option**: NgRx per application (Shell has minimal store, Admin has dashboard/user store, Member has profile/wallet store) or local component state depending on feature complexity

### Authentication Protocol (Updated)

Based on clarification, the architecture uses:

- **Token Type**: JWT (JSON Web Tokens) with stateless authentication
- **Storage Method**: Secure httpOnly cookies (not accessible to JavaScript, immune to XSS attacks)
- **Refresh Strategy**: Refresh tokens used for token rotation; coordinated across all remotes via HTTP interceptors
- **Interceptor Behavior**: All HTTP requests automatically include JWT from httpOnly cookie; 401 responses trigger refresh token flow
- **Cross-Remote Coordination**: All remotes share the same httpOnly cookie scope (same domain), ensuring uniform token state
- **Logout**: Clear httpOnly cookie on logout; all remotes detect auth loss on next request

### API Communication Pattern (Updated)

Based on clarification, the architecture uses:

- **Protocol**: RESTful HTTP APIs with standard REST conventions
- **Data Format**: JSON payloads for all requests and responses
- **Base Service Layer**: Centralized HTTP service in `data-access/api` using Angular HttpClient
- **Interceptors**: Global interceptors for:
  - Automatically injecting authentication tokens from httpOnly cookies
  - Handling 401/403 errors and triggering token refresh
  - Adding correlation IDs and request tracking
  - Standardizing error responses
- **Client Generation**: Optional use of generated clients from OpenAPI/Swagger specs
- **Caching Strategy**: HTTP caching headers honored; optional in-memory caching layer for frequently accessed data
- **Error Handling**: Consistent error responses across all remotes with standardized error codes and messages

### Remote Application Error Recovery (Updated)

Based on clarification, the architecture implements:

- **Graceful Degradation**: If a Remote application fails to load, Shell displays an error message in that Remote's section but remains fully functional
- **Isolation of Failures**: One Remote's failure does NOT affect other Remotes or the Shell navigation
- **User-Triggered Retry**: Fallback UI includes a "Retry Loading" button allowing users to attempt reload without app refresh
- **Error Details**: Error state includes:
  - Error message (user-friendly)
  - Timestamp of failure
  - Retry count and last attempt time
  - Link to troubleshooting documentation
- **Network Disconnection**: Shell detects connection loss and shows offline banner; Remotes can still render if already loaded; retry available on reconnection
- **Automatic Retry**: Optional automatic retry with exponential backoff (configurable: 1s, 2s, 4s, etc.)
- **Module Federation Timeout**: Configurable Module Federation load timeout (recommended: 10-30 seconds); timeout triggers failure state
- **Logging**: All failures logged with context (Remote name, error message, user action, timestamp) for monitoring and debugging

### Shared Library Versioning Strategy (Updated)

Based on clarification, the architecture implements:

- **Versioning Scheme**: Semantic Versioning (MAJOR.MINOR.PATCH)
- **Breaking Change Process**:
  - Announce breaking change in upcoming release
  - Mark affected APIs as @deprecated with migration guidance
  - Maintain deprecated APIs for 2+ minor releases
  - Increment MAJOR version when removing deprecated APIs
- **Migration Guides**: Every breaking change includes:
  - Before/after code examples
  - Rationale for the change
  - Step-by-step upgrade instructions
  - Timeline for deprecation period
- **Release Notes**: Clearly separate sections for:
  - New features (can upgrade immediately)
  - Bug fixes (can upgrade immediately)
  - Deprecations (plan upgrade within 2 releases)
  - Breaking changes (Major version bump; requires coordinated update)
- **Coordination**: For breaking changes across multiple libraries, coordinate releases (e.g., all major version bumps in same release cycle)
- **Consumer Control**: Remotes use package.json ranges (e.g., `^1.0.0` for minor updates, `~1.0.0` for patch only) based on stability needs
- **Changelog**: Maintain CHANGELOG.md in each shared library with all version history and migration notes
