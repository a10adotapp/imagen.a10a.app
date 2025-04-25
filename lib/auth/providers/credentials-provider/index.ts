import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { getUserByLineUserId } from "./_actions/get-or-create-user-by-line-user-id";

const authorizeRequestSchema = z.object({
  type: z.literal("liff"),
  lineUserId: z.string(),
});

export const CredentialsProvider = Credentials({
  credentials: {},
  authorize: async (request) => {
    const authorizeRequest = authorizeRequestSchema.parse(request);

    if (authorizeRequest.type === "liff") {
      const user = await getUserByLineUserId(authorizeRequest.lineUserId);

      return {
        id: user.id,
      };
    }

    return null;
  },
});
