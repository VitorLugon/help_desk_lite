# Setup do Projeto

## Estrutura inicial

- `src/app`: rotas, páginas e layout global do Next.js.
- `src/components`: componentes reutilizáveis de interface.
- `src/features`: módulos por domínio, como tickets, usuários e dashboard.
- `src/lib`: utilitários compartilhados.
- `src/server`: código de servidor, serviços, queries e acesso ao banco.
- `src/test`: configuração de testes.
- `prisma`: schema, migrations e seed.
- `docs`: documentação técnica do projeto.

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste a URL do PostgreSQL:

```bash
cp .env.example .env
```

Variáveis necessárias:

- `DATABASE_URL`: conexão com o PostgreSQL.
- `AUTH_SECRET`: chave usada para assinar o cookie de sessão.

## Prisma

Com o banco configurado, gere o client:

```bash
npx prisma generate
```

Para aplicar o schema e popular dados de demonstração:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Testes

O projeto usa Vitest com ambiente `jsdom` e setup em `src/test/setup.ts`.
