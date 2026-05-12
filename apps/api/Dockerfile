FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install

COPY . .

WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 4000
CMD ["pnpm", "--dir", "apps/api", "start"]
