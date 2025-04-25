import { authSecret } from "@/lib/env/auth-secret";
import logger from "@/lib/logger";
import { User as AppUser } from "@prisma/client";
import NextAuth, { Session } from "next-auth";
import "next-auth/jwt";
import { JWT } from "next-auth/jwt";
import { getUser } from "./_actions/get-user";
import { CredentialsProvider } from "./providers/credentials-provider";

declare module "next-auth" {
  interface Session {
    user: AppUser;
  }

  interface User {
    id?: string; // User::id
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string; // User::id
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret(),
  trustHost: true,
  providers: [
    CredentialsProvider,
  ],
  callbacks: {
    jwt: async ({
      token,
      user: authUser,
      trigger,
    }): Promise<JWT> => {
      try {
        if (trigger === "signIn") {
          const userId = authUser.id;

          if (!userId) {
            throw new Error("no userId specified");
          }

          return {
            ...token,
            sub: userId,
          };
        }

        if (trigger === undefined) {
          return token;
        }

        throw new Error("unhandled trigger");
      } catch (err) {
        logger.error({
          action: import.meta.filename,
          error: err,
        });
      }

      return token;
    },
    session: async ({
      session,
      token,
    }): Promise<Session> => {
      try {
        const user = await getUser(token.sub);

        return {
          ...session,
          user,
        };
      } catch (err) {
        logger.error({
          action: import.meta.filename,
          error: err,
        });

        throw err;
      }
    },
  },
});
