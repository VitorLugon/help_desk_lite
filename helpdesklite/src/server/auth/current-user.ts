import "server-only";

import { redirect } from "next/navigation";
import { UserRole, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";
import { destroySession, readSession } from "./session";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

const currentUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
} as const;

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await readSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: currentUserSelect,
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    await destroySession();
    return null;
  }

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
