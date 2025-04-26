import { cronscriptToken } from "@/lib/env/cronscript-token";
import { lineStampGenerateQueueConsumer } from "@/lib/line-stamp-generate-queue-consumer";

export async function POST(request: Request) {
  const token = cronscriptToken();

  if (token) {
    if (token !== request.headers.get("x-cronscript-token")) {
      return Response.json({
        error: "Invalid token",
      }, {
        status: 401,
      });
    }
  }

  const isConsumerHealthy = await lineStampGenerateQueueConsumer.check();

  if (!isConsumerHealthy) {
    lineStampGenerateQueueConsumer.start();
  }

  return Response.json({ message: "ok" });
}
