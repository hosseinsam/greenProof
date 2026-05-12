# GreenProof MVP

GreenProof is a verified tree-and-seed impact marketplace for small companies and community projects. This monorepo includes a NestJS API, a Next.js front-end, PostgreSQL, Prisma ORM, local file storage, and a mock Cosmos registry adapter.

## Prerequisites

- Node.js 22 LTS or compatible current LTS
- pnpm
- Docker and Docker Compose

## Quick start

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Start local development
   ```bash
   pnpm docker:up
   ```
3. Run migrations
   ```bash
   pnpm db:migrate
   ```
4. Seed sample data
   ```bash
   pnpm db:seed
   ```

## Run commands

- Install all workspace dependencies
  ```bash
  npm install
  ```
- Start the backend API
  ```bash
  npm run dev:api
  ```
- Start the frontend web app
  ```bash
  npm run dev:web
  ```
- Build both apps
  ```bash
  npm run build
  ```
- Run backend tests
  ```bash
  npm --prefix apps/api run test
  ```
- Run frontend tests
  ```bash
  npm --prefix apps/web run test
  ```
- Run both project tests
  ```bash
  npm run test
  ```
- Start Docker services
  ```bash
  npm run docker:up
  ```
- Stop Docker services
  ```bash
  npm run docker:down
  ```

## Troubleshooting

- Recommended Node versions: `22.x` or `24.x`.
- This workspace now supports `npm` workspaces for local development.
- If you are on Node `25.x`, `pnpm` and `corepack` behavior can be unreliable; use `npm install` and `npm run dev:api` / `npm run dev:web` instead.
- If `npm install` is still not available, remove the root `package-lock.json` and retry:
  ```bash
  rm package-lock.json
  npm install
  ```
- To regenerate app dependencies directly if the workspace install fails:
  ```bash
  npm --prefix apps/api install
  npm --prefix apps/web install
  ```

## Test accounts

- Admin: `admin@greenproof.local` / `admin123456`
- User: `user@greenproof.local` / `user123456`
- Company: `company@greenproof.local` / `company123456`

## URLs

- API: `http://localhost:4000`
- Web: `http://localhost:3000`

## How to use

- Register or login as a user to submit evidence and view wallet balance.
- Login as admin to approve evidence, create projects, and review certificates.
- Login as company to browse impact packs and purchase retired certificates.

## Submission flow

1. User submits evidence with an image upload.
2. Admin approves the pending submission.
3. The system awards Green Coins and creates impact units.
4. A company can buy an available impact pack and receive a retired certificate.

## Local files

- Uploaded evidence files and generated reports are stored in `apps/api/storage` (or the mounted Docker volume).

## Mock Cosmos registry

The backend includes a mock Cosmos registry adapter that generates deterministic fake transaction hashes and stores chain events in the database. It simulates minting Green Coins, issuing certificates, transferring them to a buyer wallet, and retiring certificates.

## Replacing the mock adapter later

The placeholder file `apps/api/src/chain/cosmjs-cosmos-registry.adapter.ts` includes TODO markers where a real CosmJS `SigningStargateClient`, `StargateClient`, or CosmWasm client should be integrated.

## Known limitations

- This MVP uses simulated payment and local storage.
- Certificates are retired immediately after purchase.
- Files are stored on disk rather than a production object storage service.
- Geo coordinates are not exposed in full on public certificate pages.
- This is not a real carbon credit or financial trading platform.

## Safety disclaimer

This certificate documents verified nature-impact activity. It is not a certified carbon credit and should not be used to claim carbon neutrality unless paired with certified carbon accounting and independent verification.
