# `twitter`

A Twitter clone.

## Development

### Dependencies

- [NodeJS](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (to start development database)

### Start Development Server

```
pnpm install
pnpm db:start
pnpm db:push
pnpm dev
```

## Project Structure

This repository is a monorepo using [turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces/). Modules live in the following directories:

### `apps`

Folders in the apps directory each spawn their own process.

- `web` - The main website with [NextJS](https://nextjs.org/).

### `packages`

Folders in the packages directory are ordinary modules.

- `api` - End to end typesafe queries/mutations with [TRPC](https://trpc.io/).
- `db` - Typesafe database queries with [Prisma](https://www.prisma.io/).
- `ui` - Accessible React components with [shadcn-ui](https://ui.shadcn.com/).
- `utils` - General utilities shared across all packages.

### `tooling`

Folders in the tooling directory store shared config for common tooling.

- `eslint-config`
- `prettier-config`
- `tailwind-config`
- `tsconfig`

## Infrastructure

![image](https://github.com/ryanArora/twitter/assets/26044687/c80746d9-7094-4762-9d1f-97b1995d1802)

