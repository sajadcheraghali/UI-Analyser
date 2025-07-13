import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

import { getDatabaseConnection } from "../../../lib/database"; // استفاده از تابع getDatabaseConnection
import { User } from "../../../entities/User";

// تعریف تایپ‌های سفارشی
interface ExtendedProfile {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "user" | "admin" | undefined;
  };
}

interface CustomJWT extends JWT {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role?: "user" | "admin" | undefined;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          console.error("Missing email or password");
          return null;
        }

        try {
          // اطمینان از اولیه‌سازی دیتابیس
          const AppDataSource = await getDatabaseConnection();
          const userRepo = AppDataSource.getRepository(User);
          const user = await userRepo.findOne({
            where: { email },
          });

          if (!user || !user.password) {
            console.error("User not found or no password set");
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            console.error("Invalid password");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        const googleProfile = profile as ExtendedProfile;
        const email = googleProfile.email;
        if (!email) {
          console.error("No email in Google profile");
          return token;
        }

        try {
          const AppDataSource = await getDatabaseConnection();
          const userRepo = AppDataSource.getRepository(User);
          let dbUser = await userRepo.findOne({ where: { email } });

          if (!dbUser) {
            dbUser = userRepo.create({
              email,
              name: googleProfile.name || email.split("@")[0],
              image: googleProfile.picture ?? undefined,
              role: "user",
            });
            await userRepo.save(dbUser);
            console.log("Created new user from Google:", email);
          }

          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.image = dbUser.image;
          token.role = dbUser.role;
        } catch (error) {
          console.error("Google OAuth error:", error);
        }
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = (user as any).role ?? "user";
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session?.user) {
        session.user.id = (token as CustomJWT).id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = (token as CustomJWT).image;
        (session.user as any).role = (token as CustomJWT).role ?? "user";
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        try {
          const AppDataSource = await getDatabaseConnection();
          const userRepo = AppDataSource.getRepository(User);
          const existingUser = await userRepo.findOne({
            where: { email: user.email },
          });

          if (!existingUser) {
            await userRepo.save({
              email: user.email!,
              name: user.name!,
              role: "user",
            });
            console.log("Created new user on Google sign-in:", user.email);
          }

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };