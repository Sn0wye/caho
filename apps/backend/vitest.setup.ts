import { execSync } from 'node:child_process';

execSync('dotenv -e .env.test pnpm db:migrate', { stdio: 'inherit' });
