import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@/generated/prisma/client";
import { canAssignTicket } from "@/features/tickets/authorization";
import { assignTicketSchema } from "@/features/tickets/schemas";
import { getCurrentUser } from "@/server/auth/current-user";
import { prisma } from "@/server/db/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "Faça login para atribuir chamados." },
      { status: 401 },
    );
  }

  if (!canAssignTicket(currentUser)) {
    return NextResponse.json(
      { message: "Apenas admins podem atribuir chamados." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsedBody = assignTicketSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message:
          parsedBody.error.issues[0]?.message ??
          "Selecione um técnico válido.",
      },
      { status: 400 },
    );
  }

  const [ticket, technician] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id },
      select: { id: true },
    }),
    prisma.user.findFirst({
      where: {
        id: parsedBody.data.assigneeId,
        role: UserRole.TECHNICIAN,
        status: UserStatus.ACTIVE,
      },
      select: { id: true },
    }),
  ]);

  if (!ticket) {
    return NextResponse.json(
      { message: "Chamado não encontrado." },
      { status: 404 },
    );
  }

  if (!technician) {
    return NextResponse.json(
      { message: "Técnico não encontrado ou inativo." },
      { status: 400 },
    );
  }

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      assigneeId: technician.id,
    },
  });

  return NextResponse.json({ ok: true });
}
