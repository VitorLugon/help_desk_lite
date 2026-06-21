"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/server/db/prisma";
import { createSession, destroySession } from "@/server/auth/session";
import { loginSchema } from "./schemas";

export type LoginFormState = {
  message: string;
};

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsedData = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    return {
      message: parsedData.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsedData.data.email },
    select: {
      id: true,
      passwordHash: true,
      status: true,
    },
  });

  if (!user) {
    return { message: "E-mail ou senha inválidos." };
  }

  if (user.status !== UserStatus.ACTIVE) {
    return { message: "Usuário inativo. Fale com um administrador." };
  }

  const passwordMatches = await bcrypt.compare(
    parsedData.data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return { message: "E-mail ou senha inválidos." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
