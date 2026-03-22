import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * POST /api/users/set-password
 * Body: { token, password }
 * Sets password for an invited user.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, password } = body;

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  // Find user by invite token
  const user = await prisma.user.findUnique({ where: { inviteToken: token } });

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired invite link" }, { status: 404 });
  }

  if (user.inviteExpires && new Date() > user.inviteExpires) {
    return NextResponse.json({ error: "Invite link has expired. Ask your admin for a new one." }, { status: 410 });
  }

  // Hash password and save
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      inviteToken: null,
      inviteExpires: null,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Password set. You can now sign in.",
    email: user.email,
  });
}
