import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({ database: "connected" });
  } catch (error) {
    console.error("Database health check failed", error);

    return Response.json({ database: "unavailable" }, { status: 503 });
  }
}
