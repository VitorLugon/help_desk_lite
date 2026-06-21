# Modelo de Dados - HelpDesk Lite

Este documento descreve o schema inicial do Prisma para o HelpDesk Lite.

## Enums

### UserRole

Define o papel do usuário no sistema:

- `REQUESTER`: solicitante que abre e acompanha os próprios chamados.
- `TECHNICIAN`: técnico responsável por atender chamados atribuídos.
- `ADMIN`: administrador com acesso à gestão geral.

### UserStatus

Define se o usuário pode acessar o sistema:

- `ACTIVE`
- `INACTIVE`

### TicketStatus

Define o estágio atual do chamado:

- `OPEN`
- `IN_PROGRESS`
- `WAITING_USER`
- `RESOLVED`
- `CLOSED`
- `CANCELED`

### TicketPriority

Define a prioridade operacional do chamado:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

## User

Representa uma pessoa que usa o sistema.

Campos principais:

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `status`
- `createdAt`
- `updatedAt`

Relacionamentos:

- Pode abrir muitos chamados como solicitante.
- Pode receber muitos chamados como técnico responsável.
- Pode criar muitos comentários.
- Pode registrar muitas mudanças de status.

Observações:

- `email` é único.
- Senhas devem ser armazenadas somente como hash.
- `passwordHash` não deve ser retornado para o frontend.

## Ticket

Representa um chamado de suporte.

Campos principais:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `category`
- `requesterId`
- `assigneeId`
- `createdAt`
- `updatedAt`
- `resolvedAt`
- `closedAt`

Relacionamentos:

- Pertence obrigatoriamente a um solicitante.
- Pode ter um técnico responsável.
- Possui muitos comentários.
- Possui histórico de mudanças de status.

Índices:

- `requesterId`
- `assigneeId`
- `status`
- `priority`
- `category`
- `createdAt`
- `status` + `priority`

## TicketComment

Representa uma mensagem dentro de um chamado.

Campos principais:

- `id`
- `ticketId`
- `authorId`
- `content`
- `createdAt`

Relacionamentos:

- Pertence a um chamado.
- Pertence a um autor.

Índices:

- `ticketId`
- `authorId`

## TicketStatusHistory

Representa uma mudança de status no chamado.

Campos principais:

- `id`
- `ticketId`
- `changedById`
- `fromStatus`
- `toStatus`
- `createdAt`

Relacionamentos:

- Pertence a um chamado.
- Pertence ao usuário que realizou a mudança.

Índices:

- `ticketId`
- `changedById`

## Seed inicial

A seed cria:

- 1 administrador.
- 2 técnicos.
- 3 solicitantes.
- 4 chamados de exemplo com comentários e histórico de status.

Todos os usuários de demonstração usam a senha `Senha@123`.
