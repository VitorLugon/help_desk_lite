import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const sessionCookieName = "helpdesklite_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  expiresAt: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET não foi definida.");
  }

  return secret;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

function signaturesMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = encodeBase64Url(JSON.stringify({ userId, expiresAt }));
  const signature = sign(payload);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.delete(sessionCookieName);
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName)?.value;

  if (!session) {
    return null;
  }

  const [payload, signature] = session.split(".");

  if (!payload || !signature || !signaturesMatch(signature, sign(payload))) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(decodeBase64Url(payload)) as SessionPayload;

    if (!parsedPayload.userId || parsedPayload.expiresAt < Date.now()) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}
