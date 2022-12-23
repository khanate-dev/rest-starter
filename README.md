# Typescript-Express-Mongo-Zod REST Boilerplate

A boilerplate to quickly get started with building a REST api.

## Stack

- Typescript
- Express
- Mongo with Mongoose
- Zod
- Pino
- pnpm for package management

---

## Scripts

Start in Development mode: `pnpm dev`

Build: `pnpm build`

Start in Production mode : `pnpm start`

Lint the code: `pnpm lint`

Run tests: `pnpm test`

---

## Environment Variables

Environment variables are securely stored with dotenv-vault.

Environment example format:
[![fork with dotenv-vault](https://badge.dotenv.org/fork.svg?r=1)]
(<https://vault.dotenv.org/project/vlt_2044fec0a36deab104f24264965c998a51566ae69c87c56d8405e2bc1fde303e/example>)

Login to dotenv-vault: `pnpm env:login`

Open dotenv-vault: `pnpm env:open`

Pull environment from dotenv-vault: `pnpm env:pull`

Push environment to dotenv-vault: `pnpm env:push`
