import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { UnauthorizedError } from '@/lib/errors';
import logger from '@/lib/logger';
import { JWT } from "next-auth/jwt";
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new UnauthorizedError("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });
        if (!user) {
          logger.warn('Login attempt with non-existent username', { username: credentials.username });
          throw new UnauthorizedError("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          logger.warn('Login attempt with invalid password', { userId: user.id });
          throw new UnauthorizedError("Invalid credentials");
        }
        logger.info('User logged in', { userId: user.id });
        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };