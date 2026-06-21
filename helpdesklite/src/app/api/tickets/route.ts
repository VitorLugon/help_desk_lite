import { NextResponse } from "next/server";
import { TicketStatus } from "@/generated/prisma/client";
import { canCreateTicket } from "@/features/tickets/authorization";
import { createTicketSchema } from "@/features/tickets/schemas";
import { getCurrentUser } from "@/server/auth/current-user";
import { prisma } from "@/server/db/prisma";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "Faça login para abrir um chamado." },
      { status: 401 },
    );
  }

  if (!canCreateTicket(currentUser)) {
    return NextResponse.json(
      { message: "Apenas solicitantes podem abrir chamados." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsedBody = createTicketSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Verifique os dados do chamado.",
      },
      { status: 400 },
    );
  }

  const ticket = await prisma.ticket.create({
    data: {
      title: parsedBody.data.title,
      description: parsedBody.data.description,
      category: parsedBody.data.category,
      priority: parsedBody.data.priority,
      status: TicketStatus.OPEN,
      requesterId: currentUser.id,
      statusHistory: {
        create: {
          changedById: currentUser.id,
          fromStatus: null,
          toStatus: TicketStatus.OPEN,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({ ticketId: ticket.id }, { status: 201 });
}
