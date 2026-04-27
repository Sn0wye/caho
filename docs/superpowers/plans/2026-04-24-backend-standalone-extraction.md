# Backend Full Standalone Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `apps/backend` into a fully standalone repository rooted at `/`, with no Turborepo, no pnpm workspace coupling, no `apps/*` monorepo structure, and no shared monorepo package dependencies.

**Architecture:** Flatten backend into repository root (`src`, `scripts`, configs at `/`), internalize previously shared contracts/schemas under `src/shared/*`, and replace root-level monorepo tooling with backend-local equivalents (TypeScript, Biome, Docker, compose, optional nginx). Enforce independence via coupling guard checks.

**Tech Stack:** TypeScript, Fastify, Zod, Vitest, tsup, pnpm, Biome, Docker, Docker Compose

---

### Task 1: Add standalone coupling guard (TDD red)

**Files:**
- Create: `scripts/check-standalone-coupling.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing guard script**

```ts
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const BLOCKED_TOKENS = [
  '@caho/contracts',
  '@caho/schemas',
  '@caho/tsconfig',
  'workspace:*',
  'turbo',
  'turbo.json',
  'pnpm-workspace.yaml',
  '../../packages/',
  'apps/backend',
  'apps/web',
  'packages/'
];

const SCAN_ROOTS = [
  'src',
  'scripts',
  'package.json',
  'tsconfig.json',
  'vitest.config.ts',
  'biome.json',
  'Dockerfile',
  'docker-compose.yml'
];
const INCLUDED_EXTENSIONS = new Set(['.ts', '.json', '.yml', '.yaml', '.md']);
const SKIPPED_DIRS = new Set(['node_modules', 'dist', '.git']);
const IGNORED_FILES = new Set(['scripts/check-standalone-coupling.ts']);

function walk(relativeRoot: string): string[] {
  const out: string[] = [];
  const pending = [relativeRoot];

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;

    for (const entry of readdirSync(path.join(process.cwd(), current), { withFileTypes: true })) {
      const rel = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRS.has(entry.name)) {
          pending.push(rel);
        }
        continue;
      }

      if (entry.isFile() && INCLUDED_EXTENSIONS.has(path.extname(rel))) {
        out.push(rel);
      }
    }
  }

  return out;
}

function resolveScanRoot(entry: string): string[] {
  const abs = path.join(process.cwd(), entry);
  const dir = path.dirname(abs);
  const base = path.basename(abs);
  const stats = readdirSync(dir, { withFileTypes: true }).find(dirent => dirent.name === base);

  if (!stats) return [];
  if (stats.isFile()) return [entry];
  if (stats.isDirectory()) return walk(entry);
  return [];
}

const filesToScan = SCAN_ROOTS.flatMap(resolveScanRoot);

const offenders = filesToScan.filter(file => {
  if (IGNORED_FILES.has(file)) return false;
  const content = readFileSync(path.join(process.cwd(), file), 'utf8');
  return BLOCKED_TOKENS.some(token => content.includes(token));
});

if (offenders.length > 0) {
  console.error('Standalone coupling violations found:');
  for (const offender of offenders) {
    console.error(` - ${offender}`);
  }
  process.exit(1);
}

console.log('No monorepo/turbo coupling found.');
```

- [ ] **Step 2: Add guard command**

```json
{
  "scripts": {
    "test:standalone-guard": "tsx scripts/check-standalone-coupling.ts"
  }
}
```

- [ ] **Step 3: Run guard and verify red**

Run: `pnpm test:standalone-guard`  
Expected: FAIL before extraction is complete.

### Task 2: Flatten monorepo layout into standalone root

**Files:**
- Move/Create at root: `src/**`, `scripts/**`, `migrations/**`, `.env.example`, `.gitignore`
- Move/Create at root: `drizzle.config.ts`, `vitest.config.ts`, `vitest.setup.ts`, `tsup.config.ts`, `tsconfig.json`, `package.json`

- [ ] **Step 1: Define target standalone root layout**

```text
/
  src/
  scripts/
  migrations/
  package.json
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  vitest.setup.ts
  drizzle.config.ts
  biome.json
  Dockerfile
  docker-compose.yml
  nginx/nginx.conf (optional)
  .env.example
  .gitignore
  README.md
```

- [ ] **Step 2: Move backend files from `apps/backend` to root**

- [ ] **Step 3: Update path-sensitive script/config references to root-relative paths**

### Task 3: Internalize shared modules and repoint imports

**Files:**
- Create: `src/shared/schemas/*.ts`
- Create: `src/shared/contracts/*.ts`
- Create: `src/shared/contracts/ws/*.ts`
- Modify: `src/**/*.ts`

- [ ] **Step 1: Copy schemas/contracts source into `src/shared/*`**

- [ ] **Step 2: Replace imports**

```ts
// from
import { createRoom } from '@caho/contracts';
import type { Player } from '@caho/schemas';

// to
import { createRoom } from '@/shared/contracts';
import type { Player } from '@/shared/schemas';
```

- [ ] **Step 3: Ensure copied contract files import local schemas (`@/shared/schemas`)**

### Task 4: Remove Turbo/workspace and keep backend-only scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove any `workspace:*` dependencies**

- [ ] **Step 2: Remove turbo-related scripts and assumptions**

- [ ] **Step 3: Ensure standalone scripts remain**

```json
{
  "scripts": {
    "dev": "dotenv tsx watch src/server.ts",
    "start": "dotenv node dist/server.js",
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "test": "dotenv -e .env.test vitest --run --passWithNoTests",
    "test:standalone-guard": "tsx scripts/check-standalone-coupling.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "dotenv drizzle-kit migrate",
    "check": "biome check .",
    "check:fix": "biome check . --apply"
  },
  "packageManager": "pnpm@9.4.0"
}
```

### Task 5: Extract and localize required tooling from monorepo root

**Files:**
- Create: `biome.json`
- Modify/Create: `tsconfig.json`, `vitest.config.ts`
- Optional: `.npmrc`

- [ ] **Step 1: Inline Biome config (no parent `extends`)**

- [ ] **Step 2: Keep TypeScript config fully local (no `@caho/tsconfig` extends)**

- [ ] **Step 3: Remove monorepo aliases and parent path assumptions from Vitest config**

- [ ] **Step 4: Ensure tooling files do not reference parent monorepo paths**

### Task 6: Replace deployment/container setup without Turbo

**Files:**
- Modify/Create: `Dockerfile`, `docker-compose.yml`
- Optional copy/adapt: `nginx/nginx.conf`
- Modify: `README.md`

- [ ] **Step 1: Replace Dockerfile with backend-only build (no `turbo prune`, no `--filter`)**

- [ ] **Step 2: Create standalone compose stack (`backend`, `postgres`, `redis`)**

- [ ] **Step 3: Copy/adapt nginx config only if needed for target deployment**

- [ ] **Step 4: Document env contract (`PORT`, `DATABASE_URL`, `REDIS_URL`, auth vars)**

### Task 7: Verification gates (green)

**Files:**
- Test: `scripts/check-standalone-coupling.ts`

- [ ] **Step 1: Guard pass**

Run: `pnpm test:standalone-guard`  
Expected: PASS with `No monorepo/turbo coupling found.`

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`  
Expected: PASS

- [ ] **Step 3: Build**

Run: `pnpm build`  
Expected: PASS

- [ ] **Step 4: Tests**

Run: `pnpm test`  
Expected: PASS (uses `--passWithNoTests` until real tests exist)

- [ ] **Step 5: Container smoke check**

Run: `docker compose up --build`  
Expected: backend starts and health endpoint responds.

- [ ] **Step 6: Outside-repo rehearsal**

Run from a copied folder in a temp location:

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm start
```

Expected: PASS with no monorepo/turbo references.

### Task 8: Standalone documentation

**Files:**
- Modify/Create: `README.md`
- Optional: `docs/extraction-notes.md`

- [ ] **Step 1: Document final standalone directory structure**

- [ ] **Step 2: Document local dev/test/build/run commands**

- [ ] **Step 3: Document intentional removals (Turbo, workspaces, `apps/*`, `packages/*`)**

- [ ] **Step 4: Add troubleshooting notes for env, DB migration, and Redis setup**

## Definition of Done

- No Turborepo usage anywhere in the standalone backend repository.
- No workspace dependencies or workspace config assumptions.
- No monorepo structure assumptions (`apps/*`, `packages/*`, parent path references).
- Backend runs as a root-level standalone repository with local tooling/config.
- Standalone guard, typecheck, build, runtime smoke, and container checks pass.

## Plan Self-Review

- Spec coverage: includes full structure flattening, tooling extraction, and turbo removal.
- Placeholder scan: no TODO/TBD placeholders.
- Path consistency: all tasks target root-level standalone structure and `@/shared/*` imports.
