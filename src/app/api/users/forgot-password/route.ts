import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return NextResponse.json({ error: "No account found with that email" }, { status: 404 });

    const token = crypto.randomBytes(32).toString("base64url");
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: { inviteToken: token, inviteExpires: expires },
    });

    const link = `${process.env.NEXTAUTH_URL || "https://conceivable-command-center.vercel.app"}/set-password?token=${token}`;

    return NextResponse.json({ link });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
