import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/stripe";

export async function POST(request: Request) {
  const requestData = await request.json();

  const parsedEvent = eventSchema.safeParse(requestData);

  if (parsedEvent.error) {
    logger.error({
      action: import.meta.filename,
      error: parsedEvent.error,
      requestData,
    });

    return Response.json({ message: "ok" });
  }

  if (parsedEvent.data.type === "payment_intent.succeeded") {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        deletedAt: null,
        stripeCustomerId: parsedEvent.data.data.object.customer,
      },
    });

    await prisma.lineStampTicket.create({
      data: {
        userId: user.id,
      },
    });
  }

  return Response.json({ message: "ok" });
}
