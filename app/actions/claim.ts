"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function claimItem(
  itemId: string,
  claimerName: string,
  claimerEmail?: string
) {
  if (!claimerName.trim()) {
    throw new Error("Name is required");
  }

  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    include: { wishlist: { select: { isPublic: true } } },
  });

  if (!item) throw new Error("Item not found");
  if (!item.wishlist.isPublic) throw new Error("Wishlist is not public");
  if (item.status !== "AVAILABLE") throw new Error("Item is not available");

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: {
      status: "CLAIMED",
      claimedBy: claimerName.trim(),
      claimedByEmail: claimerEmail?.trim() || null,
      claimedAt: new Date(),
    },
  });

  revalidatePath(`/w`);
}

export async function releaseClaim(itemId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
  });

  if (!item) throw new Error("Item not found");
  if (item.status !== "CLAIMED") throw new Error("Item is not claimed");

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: {
      status: "AVAILABLE",
      claimedBy: null,
      claimedByEmail: null,
      claimedByUserId: null,
      claimedAt: null,
    },
  });

  revalidatePath(`/w`);
}

export async function markPurchased(itemId: string) {
  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
  });

  if (!item) throw new Error("Item not found");
  if (item.status !== "CLAIMED") throw new Error("Item is not claimed");

  await prisma.wishlistItem.update({
    where: { id: itemId },
    data: { status: "PURCHASED" },
  });

  revalidatePath(`/w`);
}
