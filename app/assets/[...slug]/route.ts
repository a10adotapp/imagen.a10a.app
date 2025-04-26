import { publicDirname } from "@/lib/env/public-dirname";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string[];
    }>
  }
) {
  const { slug } = await params;

  const filePath = path.join(publicDirname(), ...slug);

  const stat = statSync(filePath, {
    throwIfNoEntry: false,
  });

  if (!stat) {
    return Response.json({
      message: "not found",
    }, {
      status: 404,
    });
  }

  return new Response(readFileSync(filePath));
}
