import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@/generated/prisma";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * POST /api/users/invite
 * Body: { email, name?, role: "team" | "investor" }
 * Only admin can invite.
 */
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const { email, name, role } = body;

  if (!email || !role || !["team", "investor"].includes(role)) {
    return NextResponse.json(
      { error: "Email and role (team or investor) required" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing && existing.passwordHash) {
    return NextResponse.json(
      { error: "User already has an account" },
      { status: 409 }
    );
  }

  // Generate invite token (URL-safe)
  const inviteToken = crypto.randomBytes(32).toString("base64url");
  const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    create: {
      email: normalizedEmail,
      name: name || null,
      role,
      inviteToken,
      inviteExpires,
      invitedBy: token.email as string,
    },
    update: {
      name: name || undefined,
      role,
      inviteToken,
      inviteExpires,
      invitedBy: token.email as string,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://conceivable-command-center.vercel.app";
  const inviteLink = `${baseUrl}/set-password?token=${inviteToken}`;

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    inviteLink,
    expiresAt: inviteExpires.toISOString(),
  });
}

/**
 * GET /api/users/invite
 * List all users. Admin only.
 */
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      lastLoginAt: true,
      invitedBy: true,
      createdAt: true,
      passwordHash: false,
      inviteToken: false,
    },
    orderBy: { createdAt: "desc" },
  });

  // Add "hasPassword" flag
  const usersRaw = await prisma.user.findMany({
    select: { id: true, passwordHash: true },
  });
  const hashMap = new Map(usersRaw.map((u) => [u.id, !!u.passwordHash]));

  const result = users.map((u) => ({
    ...u,
    hasSetPassword: hashMap.get(u.id) || false,
  }));

  return NextResponse.json({ users: result });
}
