import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Command Center",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        // Check DB users first
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && user.active && user.passwordHash) {
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (isValid) {
            // Update last login
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.email.split("@")[0],
              role: user.role,
            };
          }
        }

        // Fallback: check env var admin (for initial setup / recovery)
        const envEmail = process.env.CC_AUTH_EMAIL;
        const envHash = process.env.CC_AUTH_PASSWORD_HASH;
        if (envEmail && envHash && email === envEmail.toLowerCase()) {
          const isValid = await bcrypt.compare(credentials.password, envHash);
          if (isValid) {
            // Auto-create admin user in DB if not exists
            const adminUser = await prisma.user.upsert({
              where: { email },
              create: {
                email,
                name: "Kirsten",
                passwordHash: envHash,
                role: "admin",
                lastLoginAt: new Date(),
              },
              update: { lastLoginAt: new Date() },
            });
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name || "Kirsten",
              role: adminUser.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "team";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
