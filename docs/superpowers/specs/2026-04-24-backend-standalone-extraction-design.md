# Backend Standalone Extraction Design

## Context

`apps/backend` currently runs inside a pnpm/turbo monorepo and consumes shared workspace packages (`@caho/contracts`, `@caho/schemas`). The goal is to make backend as independent as possible now so it can be moved to a separate repository later with minimal friction.

This design follows a strict non-functional constraint: zero behavior changes.

## Goals

- Remove backend dependence on monorepo workspace packages and path assumptions.
- Preserve HTTP and WebSocket behavior exactly as it is today.
- Produce migration docs that can be executed later, in a separate session, without guesswork.
- Ensure backend can be copied to a standalone location and still install, typecheck, test, build, and start.

## Non-Goals

- No feature work.
- No API contract redesign.
- No refactors beyond relocation and import rewiring needed for independence.
- No CI/platform redesign beyond what is required to remove monorepo coupling.

## Current Coupling Inventory

### Direct dependency coupling

- `apps/backend/package.json` depends on:
  - `@caho/contracts` via `workspace:*`
  - `@caho/schemas` via `workspace:*`

### Import coupling

- Backend source imports symbols from `@caho/schemas` across repositories/services/controllers.
- Backend source imports symbols from `@caho/contracts` in route controllers and event typing.

### Tooling coupling

- `apps/backend/vitest.config.ts` maps aliases to monorepo-relative paths:
  - `../../packages/schemas/src`
  - `../../packages/contracts/src`

### Workspace/runtime assumptions

- Workspace package linking is provided by root `pnpm-workspace.yaml`.
- Root task orchestration is defined by `turbo.json`.

## Target State

After migration, `apps/backend` should satisfy all of the following:

- No `workspace:*` dependencies in backend package manifest.
- No imports of `@caho/contracts` or `@caho/schemas` from backend runtime/test code.
- No references to `../../packages/*` in backend configs.
- Backend owns local contracts/schemas source under backend-controlled directories.
- Backend can be copied outside the monorepo and still run the full command chain successfully.

## Recommended Approach

Approach A (Extraction Playbook): one deterministic, backend-focused runbook with a coupling inventory, sequence of migration steps, and hard verification gates.

Reasoning:

- Lowest risk for zero-behavior-change migration.
- Best fit for delayed repository split.
- Reduces hidden coupling misses by making dependency relocation explicit.

## Proposed Backend-Local Structure

Use backend-owned modules to replace monorepo shared package consumption.

Suggested layout:

- `apps/backend/src/shared/schemas/*`
- `apps/backend/src/shared/contracts/*`

Design constraints:

- Copy exported source definitions exactly before any cleanup.
- Keep symbol names and Zod definitions unchanged.
- Restrict changes to import paths and location.

## Migration Phases

### Phase 1: Baseline capture

Establish baseline behavior and compile results:

- `pnpm --dir apps/backend typecheck`
- `pnpm --dir apps/backend test`
- `pnpm --dir apps/backend build`
- One smoke runtime check (existing health route, e.g. `/ping`).

Output from this phase becomes comparison evidence for post-migration parity.

### Phase 2: Internalize shared source

- Mirror used exports from:
  - `packages/schemas/src/*`
  - `packages/contracts/src/*`
- Place mirrored files under backend-local shared paths.
- Preserve export shape and module boundaries.

### Phase 3: Repoint imports

- Replace backend imports from `@caho/schemas` and `@caho/contracts` with backend-local paths.
- Update/trim vitest alias configuration so no alias targets `../../packages/*`.

### Phase 4: Remove workspace coupling

- Remove workspace deps from `apps/backend/package.json`.
- Ensure backend lock/install assumptions are valid standalone.

### Phase 5: Standalone rehearsal validation

- Copy backend folder to temp non-monorepo location.
- Execute: install -> typecheck -> test -> build -> start.
- Confirm no monorepo path/package assumptions remain.

## Verification Gates

Each phase must pass before moving to next.

### Gate A: Coupling scan

Fail if any of the following remain in backend source/config after migration:

- `@caho/contracts`
- `@caho/schemas`
- `../../packages/`
- `packages/` references that imply monorepo-relative dependency

### Gate B: Type and test parity

- `typecheck` succeeds.
- `test` succeeds.
- No schema typing regressions from import rewiring.

### Gate C: Build/runtime parity

- `build` succeeds.
- `start` boots successfully with backend-local env config.
- Smoke route behavior matches baseline.

### Gate D: Extraction readiness

- Backend executes outside monorepo without requiring root workspace files.
- No residual workspace dependency entries in backend manifest.

## Risk Register and Controls

### Risk 1: Silent contract/schema drift

Control:

- Copy first, do not rewrite.
- Compare exported symbol surfaces before/after relocation.

### Risk 2: Hidden residual imports

Control:

- Enforce coupling scan gate after import rewiring.
- Scan both source and config files.

### Risk 3: Passes in monorepo but fails standalone

Control:

- Mandatory standalone rehearsal in temp directory.
- Treat rehearsal as release gate for migration completion.

## Documentation Deliverables

### 1) Backend Extraction Playbook

Contains:

- Objective and constraints.
- Coupling inventory.
- Ordered migration phases.
- Verification gates and rollback guidance.

### 2) Dependency Relocation Matrix

For each current import usage:

- Current import path.
- Target backend-local import path.
- Owning backend file/module.
- Verification status.

### 3) Extraction Readiness Checklist

- Pre-migration checks.
- In-flight phase checkpoints.
- Post-migration acceptance checklist.

## Definition of Done

Migration planning is complete when:

- Backend no longer requires monorepo workspace packages.
- Backend import graph is fully backend-local for contracts/schemas.
- Baseline parity checks pass (typecheck/test/build/start + smoke route).
- Standalone rehearsal passes in a copied non-monorepo location.
- Playbook, matrix, and checklist are complete and actionable.

## Out of Scope for This Design Iteration

- Actually performing the code migration in this document.
- Deleting monorepo `packages/contracts` or `packages/schemas`.
- Changing backend API semantics.

## Implementation Planning Handoff

Next step after user review approval: invoke writing-plans skill and produce an execution plan with ordered tasks, command list, file-level change map, and verification commands.
