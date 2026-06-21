# Modelo de Dados — HelpDesk Lite

## User

Representa um usuário do sistema.

Campos:

- id
- name
- email
- passwordHash
- role
- status
- createdAt
- updatedAt

Papéis:

- REQUESTER
- TECHNICIAN
- ADMIN

## Ticket

Representa um chamado.

Campos:

- id
- title
- description
- status
- priority
- category
- requesterId
- assigneeId
- createdAt
- updatedAt
- resolvedAt
- closedAt

Relacionamentos:

- Ticket pertence a um solicitante.
- Ticket pode pertencer a um técnico responsável.
- Ticket possui muitos comentários.
- Ticket possui histórico de status.

## TicketComment

Representa um comentário em um chamado.

Campos:

- id
- ticketId
- authorId
- content
- createdAt

## TicketStatusHistory

Representa uma mudança de status.

Campos:

- id
- ticketId
- changedById
- fromStatus
- toStatus
- createdAt