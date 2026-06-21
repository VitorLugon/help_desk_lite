# HelpDesk Lite

Sistema de chamados de suporte técnico criado como projeto de portfólio fullstack júnior.

## Objetivo

O HelpDesk Lite demonstra a construção de uma aplicação web com papéis de usuário, modelagem relacional, validação, formulários, dashboard e testes básicos.

## Stack

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod
- React Hook Form
- Vitest

## Perfis

- Solicitante: abre chamados e acompanha seus próprios atendimentos.
- Técnico: atende chamados atribuídos e atualiza status.
- Admin: gerencia usuários, atribuições e indicadores.

## Como rodar localmente

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento.
- `npm run build`: gera build de produção.
- `npm run start`: roda a build de produção.
- `npm run lint`: executa ESLint.
- `npm run test`: executa Vitest.
- `npm run test:watch`: executa Vitest em modo observação.

## Estado atual

Base inicial configurada com layout, página inicial, Prisma, Vitest, seed e autenticação simples. CRUD de chamados e dashboard operacional ainda não foram implementados.
