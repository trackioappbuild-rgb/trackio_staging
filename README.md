# Trackio

Trackio is a Next.js application backed by PostgreSQL on Neon through Prisma.

## Requirements

- Node.js 24 (see `.nvmrc`)
- A Neon project and database

## Local setup

1. Install the configured Node.js version and dependencies:

   ```bash
   nvm use
   npm ci
   ```

2. Create the local environment file:

   ```bash
   cp .env.example .env
   ```

3. In the Neon console, open **Connect**, copy the pooled PostgreSQL connection
   string, and assign it to `DATABASE_URL` in `.env`. Keep the value quoted if
   its password contains special characters. `.env` is ignored by Git and must
   never be committed.

4. Verify the schema and generate the Prisma client:

   ```bash
   npm run db:validate
   npm run db:generate
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Database workflow

Edit `prisma/schema.prisma`, then create and apply a development migration:

```bash
npm run db:migrate -- --name describe_the_change
```

Production and CI environments should apply committed migrations with:

```bash
npm run db:deploy
```

The shared Prisma client is exported from `src/lib/prisma.ts`. Import it only
from server-side code such as Server Components, Server Actions, and Route
Handlers; never expose `DATABASE_URL` to browser code.

## Deploy to Render

The included `render.yaml` contains the build, start, and database health-check
settings. In Render:

1. Choose **New > Blueprint** and connect this GitHub repository.
2. When prompted for `DATABASE_URL`, paste the pooled Neon connection string.
3. Deploy the Blueprint.

Render runs `npm ci && npm run build`; the build generates the Prisma client
before compiling Next.js. After deployment, `/api/health/database` returns
`{"database":"connected"}` when Render can reach Neon.

The repository contains only `.env.example`. Never put the real connection
string in `render.yaml`, a GitHub Actions workflow, or a Git commit.

## Checks

```bash
npm run lint
npm run build
```

## Automated staging workflow

After the one-time GitHub, Neon, and Render connection is complete, publish a
local change with:

```bash
npm run publish:staging -- "Describe the change"
```

You can also double-click `publish.command` in Finder. The helper synchronizes
`main`, installs locked dependencies, validates Prisma, lints, builds, commits,
and pushes. GitHub Actions verifies the pushed commit again. Render deploys only
after those checks pass, then applies committed Prisma migrations before the
application starts.
