# HelpDesk Lite

Sistema de chamados de suporte técnico para pequenas equipes, desenvolvido como projeto de portfólio fullstack júnior.

O projeto demonstra uma aplicação web com autenticação, autorização por perfil, modelagem relacional, validação de dados, formulários, dashboard operacional e testes de regras críticas.

## Problema Resolvido

Pequenas equipes de suporte muitas vezes controlam pedidos por mensagens soltas ou planilhas. Isso dificulta saber quem abriu um chamado, quem está responsável, qual é o status atual e quais demandas são críticas.

O HelpDesk Lite centraliza esse fluxo em uma aplicação simples:

- solicitantes abrem e acompanham chamados;
- técnicos atendem demandas atribuídas;
- administradores visualizam a operação e distribuem chamados.

## Funcionalidades

- Login e logout com sessão por cookie HTTP-only.
- Bloqueio de acesso para usuários inativos.
- Proteção de rotas internas.
- Listagem de chamados com autorização por perfil.
- Filtros por status e prioridade.
- Abertura de chamado por solicitantes.
- Detalhe do chamado com informações principais.
- Comentários em chamados autorizados.
- Alteração de status por técnico responsável ou admin.
- Atribuição de técnico por admin.
- Registro de histórico quando o status muda.
- Dashboard com métricas, gráficos e últimos chamados.
- Seed com usuários e chamados de demonstração.

## Perfis de Usuário

- Solicitante: abre chamados, visualiza os próprios chamados e comenta quando autorizado.
- Técnico: visualiza chamados atribuídos, comenta e altera status de chamados sob sua responsabilidade.
- Admin: visualiza todos os chamados, atribui técnicos, altera status e acompanha indicadores gerais.

## Tecnologias

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod
- React Hook Form
- Recharts
- Vitest
- Testing Library
- bcryptjs

## Arquitetura Geral

- `src/app`: rotas, páginas, layouts e rotas API do Next.js.
- `src/features`: módulos por domínio, como autenticação, chamados e dashboard.
- `src/server`: código server-side compartilhado, sessão, usuário atual e Prisma.
- `prisma`: schema, migrations e seed.
- `docs`: documentação de apoio do projeto.

As regras sensíveis ficam no servidor. O frontend pode esconder botões, mas a autorização real é validada nas queries e rotas API.

## Modelo de Dados

Entidades principais:

- `User`: usuários do sistema, com papel, status e senha armazenada como hash.
- `Ticket`: chamado de suporte com status, prioridade, solicitante e técnico responsável.
- `TicketComment`: comentários vinculados a chamados e autores.
- `TicketStatusHistory`: histórico das mudanças de status.

Enums principais:

- `UserRole`: `REQUESTER`, `TECHNICIAN`, `ADMIN`
- `UserStatus`: `ACTIVE`, `INACTIVE`
- `TicketStatus`: `OPEN`, `IN_PROGRESS`, `WAITING_USER`, `RESOLVED`, `CLOSED`, `CANCELED`
- `TicketPriority`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

## Como Rodar Localmente

Pré-requisitos:

- Node.js
- PostgreSQL
- npm

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Configure o PostgreSQL no `.env`, aplique as migrations e rode a seed:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

Inicie o projeto:

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

## Variáveis de Ambiente

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
AUTH_SECRET="troque-por-uma-chave-grande-e-aleatoria"
```

- `DATABASE_URL`: string de conexão com o PostgreSQL.
- `DATABASE_URL_UNPOOLED`: string de conexão direta, recomendada para migrations no Neon.
- `AUTH_SECRET`: chave usada para assinar o cookie de sessão.

## Logins de Demonstração

Todos os usuários da seed usam a senha:

```txt
Senha@123
```

| Perfil | E-mail |
| --- | --- |
| Admin | `admin@helpdesklite.dev` |
| Técnico | `ana.tecnica@helpdesklite.dev` |
| Técnico | `bruno.tecnico@helpdesklite.dev` |
| Solicitante | `carla@helpdesklite.dev` |
| Solicitante | `diego@helpdesklite.dev` |
| Solicitante | `eva@helpdesklite.dev` |

## Scripts Disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

- `dev`: inicia o servidor de desenvolvimento.
- `build`: gera a build de produção.
- `start`: roda a aplicação em modo produção.
- `lint`: executa ESLint.
- `test`: executa testes com Vitest.
- `test:watch`: executa testes em modo observação.

## Testes

O projeto usa Vitest. As regras críticas de autorização de chamados possuem testes unitários, incluindo:

- visibilidade por perfil;
- criação de chamado apenas por solicitante;
- comentários em chamados fechados;
- alteração de status por técnico responsável ou admin;
- transições de status permitidas.

## Prints

Espaço reservado para imagens do projeto:

- Tela de login
- Dashboard
- Listagem de chamados
- Detalhe do chamado
- Abertura de chamado

## Deploy

O projeto está preparado para deploy na Vercel usando um PostgreSQL externo, como Neon, Supabase, Railway, Render ou outro provedor compatível.

Link do deploy:

[Acessar o HelpDesk Lite](https://helpdesklite.vercel.app/)

### Variáveis na Vercel

Cadastre em `Project Settings > Environment Variables`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DATABASE_URL_UNPOOLED="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
AUTH_SECRET="uma-chave-longa-aleatoria-e-segura"
```

Não use valores locais ou senhas reais no repositório. O arquivo `.env` deve permanecer apenas na máquina local.

No Neon, use a URL pooled em `DATABASE_URL` para a aplicação e a URL sem pooler em `DATABASE_URL_UNPOOLED` para as migrations do Prisma.

### Configuração de Build

Na Vercel, mantenha os comandos padrão:

- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: padrão do Next.js

O script `postinstall` executa `prisma generate` automaticamente após a instalação das dependências.

### Migrations e Seed em Produção

Após configurar `DATABASE_URL` e, se disponível, `DATABASE_URL_UNPOOLED` apontando para o banco externo, rode as migrations:

```bash
npm run db:migrate:deploy
```

Se quiser popular o ambiente com usuários e chamados de demonstração:

```bash
npm run db:seed
```

A seed é opcional. O projeto não depende de dados locais, mas precisa de usuários no banco para que seja possível fazer login.

Importante: a seed atual recria os dados de demonstração. Use apenas em ambiente vazio ou demo.

### Checklist de Produção

- Criar banco PostgreSQL externo.
- Copiar a connection string para `DATABASE_URL` na Vercel.
- No Neon, copiar também a connection string sem pooler para `DATABASE_URL_UNPOOLED`.
- Criar um `AUTH_SECRET` longo e aleatório.
- Confirmar que `.env` não foi commitado.
- Rodar `npm run lint`.
- Rodar `npm run test`.
- Rodar `npm run build`.
- Executar `npm run db:migrate:deploy` contra o banco de produção.
- Executar `npm run db:seed` somente se quiser logins de demonstração.
- Fazer deploy na Vercel.
- Testar login, dashboard, listagem, detalhe, comentários e mudança de status.

## Aprendizados Técnicos

- Modelar regras de negócio com Prisma e PostgreSQL.
- Proteger dados por perfil usando autorização no servidor.
- Evitar exposição de `passwordHash` para o frontend.
- Validar entradas com Zod no cliente e no servidor.
- Criar formulários com React Hook Form.
- Registrar histórico de mudanças de status.
- Separar regras puras para facilitar testes unitários.
- Construir dashboard com dados filtrados por escopo de usuário.

## Melhorias Futuras

- CRUD completo de usuários para admin.
- Edição de prioridade por técnico/admin.
- Melhorias de UX para mensagens de erro em chamadas de API.
- Testes de integração para rotas API.
- Paginação na listagem de chamados.
- Busca por título, categoria ou solicitante.
- Upload de anexos.
- Notificações por e-mail.
