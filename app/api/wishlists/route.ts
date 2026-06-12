import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return Response.json([], { status: 401 });
  }

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      coverEmoji: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json(wishlists);
}
