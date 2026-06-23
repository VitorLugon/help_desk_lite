import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import {
  PrismaClient,
  TicketPriority,
  TicketStatus,
  UserRole,
  UserStatus,
} from "../src/generated/prisma/client.ts";

const databaseUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não foi definida.");
}

const adapter = new PrismaNeon({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const demoPassword = "Senha@123";

async function main() {
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await prisma.ticketStatusHistory.deleteMany();
  await prisma.ticketComment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const [admin, techAna, techBruno, requesterCarla, requesterDiego, requesterEva] =
    await Promise.all([
      prisma.user.create({
        data: {
          id: "user-admin-001",
          name: "Marina Admin",
          email: "admin@helpdesklite.dev",
          passwordHash,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
      }),
      prisma.user.create({
        data: {
          id: "user-tech-001",
          name: "Ana Técnica",
          email: "ana.tecnica@helpdesklite.dev",
          passwordHash,
          role: UserRole.TECHNICIAN,
          status: UserStatus.ACTIVE,
        },
      }),
      prisma.user.create({
        data: {
          id: "user-tech-002",
          name: "Bruno Técnico",
          email: "bruno.tecnico@helpdesklite.dev",
          passwordHash,
          role: UserRole.TECHNICIAN,
          status: UserStatus.ACTIVE,
        },
      }),
      prisma.user.create({
        data: {
          id: "user-requester-001",
          name: "Carla Souza",
          email: "carla@helpdesklite.dev",
          passwordHash,
          role: UserRole.REQUESTER,
          status: UserStatus.ACTIVE,
        },
      }),
      prisma.user.create({
        data: {
          id: "user-requester-002",
          name: "Diego Lima",
          email: "diego@helpdesklite.dev",
          passwordHash,
          role: UserRole.REQUESTER,
          status: UserStatus.ACTIVE,
        },
      }),
      prisma.user.create({
        data: {
          id: "user-requester-003",
          name: "Eva Martins",
          email: "eva@helpdesklite.dev",
          passwordHash,
          role: UserRole.REQUESTER,
          status: UserStatus.ACTIVE,
        },
      }),
    ]);

  const ticketPrinter = await prisma.ticket.create({
    data: {
      id: "ticket-001",
      title: "Impressora do financeiro não imprime",
      description:
        "A impressora aparece online, mas os documentos ficam presos na fila.",
      category: "Hardware",
      priority: TicketPriority.HIGH,
      status: TicketStatus.IN_PROGRESS,
      requesterId: requesterCarla.id,
      assigneeId: techAna.id,
      comments: {
        create: [
          {
            authorId: requesterCarla.id,
            content: "O problema começou hoje pela manhã.",
          },
          {
            authorId: techAna.id,
            content: "Vou verificar o driver e a fila de impressão.",
          },
        ],
      },
      statusHistory: {
        create: [
          {
            changedById: requesterCarla.id,
            fromStatus: null,
            toStatus: TicketStatus.OPEN,
          },
          {
            changedById: techAna.id,
            fromStatus: TicketStatus.OPEN,
            toStatus: TicketStatus.IN_PROGRESS,
          },
        ],
      },
    },
  });

  const ticketAccess = await prisma.ticket.create({
    data: {
      id: "ticket-002",
      title: "Acesso ao sistema de notas bloqueado",
      description:
        "O usuário não consegue acessar o sistema após trocar a senha.",
      category: "Acesso",
      priority: TicketPriority.CRITICAL,
      status: TicketStatus.WAITING_USER,
      requesterId: requesterDiego.id,
      assigneeId: techBruno.id,
      comments: {
        create: [
          {
            authorId: requesterDiego.id,
            content: "A mensagem informa que a conta está temporariamente bloqueada.",
          },
          {
            authorId: techBruno.id,
            content: "Solicitei uma tentativa de login após limpar o cache.",
          },
        ],
      },
      statusHistory: {
        create: [
          {
            changedById: requesterDiego.id,
            fromStatus: null,
            toStatus: TicketStatus.OPEN,
          },
          {
            changedById: techBruno.id,
            fromStatus: TicketStatus.OPEN,
            toStatus: TicketStatus.IN_PROGRESS,
          },
          {
            changedById: techBruno.id,
            fromStatus: TicketStatus.IN_PROGRESS,
            toStatus: TicketStatus.WAITING_USER,
          },
        ],
      },
    },
  });

  const ticketEmail = await prisma.ticket.create({
    data: {
      id: "ticket-003",
      title: "Configurar e-mail em novo notebook",
      description:
        "Notebook novo precisa receber a conta corporativa e assinatura padrão.",
      category: "E-mail",
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      requesterId: requesterEva.id,
      assigneeId: null,
      comments: {
        create: {
          authorId: requesterEva.id,
          content: "O equipamento já está comigo e conectado à rede.",
        },
      },
      statusHistory: {
        create: {
          changedById: requesterEva.id,
          fromStatus: null,
          toStatus: TicketStatus.OPEN,
        },
      },
    },
  });

  const ticketVpn = await prisma.ticket.create({
    data: {
      id: "ticket-004",
      title: "VPN desconecta durante reunião",
      description:
        "A conexão VPN cai depois de alguns minutos em chamadas externas.",
      category: "Rede",
      priority: TicketPriority.LOW,
      status: TicketStatus.RESOLVED,
      requesterId: requesterCarla.id,
      assigneeId: techBruno.id,
      resolvedAt: new Date(),
      comments: {
        create: [
          {
            authorId: requesterCarla.id,
            content: "A queda acontece principalmente no período da tarde.",
          },
          {
            authorId: techBruno.id,
            content: "Atualizei o cliente VPN e validei a estabilidade.",
          },
        ],
      },
      statusHistory: {
        create: [
          {
            changedById: requesterCarla.id,
            fromStatus: null,
            toStatus: TicketStatus.OPEN,
          },
          {
            changedById: techBruno.id,
            fromStatus: TicketStatus.OPEN,
            toStatus: TicketStatus.IN_PROGRESS,
          },
          {
            changedById: techBruno.id,
            fromStatus: TicketStatus.IN_PROGRESS,
            toStatus: TicketStatus.RESOLVED,
          },
        ],
      },
    },
  });

  console.log("Seed concluída com sucesso.");
  console.table([
    { perfil: "admin", email: admin.email, senha: demoPassword },
    { perfil: "técnico", email: techAna.email, senha: demoPassword },
    { perfil: "técnico", email: techBruno.email, senha: demoPassword },
    { perfil: "solicitante", email: requesterCarla.email, senha: demoPassword },
    { perfil: "solicitante", email: requesterDiego.email, senha: demoPassword },
    { perfil: "solicitante", email: requesterEva.email, senha: demoPassword },
  ]);
  console.table([
    { chamado: ticketPrinter.id, status: ticketPrinter.status },
    { chamado: ticketAccess.id, status: ticketAccess.status },
    { chamado: ticketEmail.id, status: ticketEmail.status },
    { chamado: ticketVpn.id, status: ticketVpn.status },
  ]);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
