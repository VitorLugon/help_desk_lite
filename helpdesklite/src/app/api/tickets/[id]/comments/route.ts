import { NextResponse } from "next/server";
import { canCommentOnTicket } from "@/features/tickets/authorization";
import { createTicketCommentSchema } from "@/features/tickets/schemas";
import { getCurrentUser } from "@/server/auth/current-user";
import { prisma } from "@/server/db/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "Faça login para comentar." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      requesterId: true,
      assigneeId: true,
    },
  });

  if (!ticket || !canCommentOnTicket(currentUser, ticket)) {
    return NextResponse.json(
      { message: "Você não tem permissão para comentar neste chamado." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsedBody = createTicketCommentSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Verifique o comentário informado.",
      },
      { status: 400 },
    );
  }

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket.id,
      authorId: currentUser.id,
      content: parsedBody.data.content,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
