FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install

COPY . .
WORKDIR /app/apps/web
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "--dir", "apps/web", "start"]
