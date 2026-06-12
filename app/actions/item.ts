"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addItemSchema = z.object({
  wishlistId: z.string(),
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().default("INR"),
  imageUrl: z.string().optional(),
  sourceSite: z.string().optional(),
  notes: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function addItem(input: z.infer<typeof addItemSchema>) {
  const user = await requireAuth();
  const data = addItemSchema.parse(input);

  // Verify wishlist belongs to user
  const wishlist = await prisma.wishlist.findFirst({
    where: { id: data.wishlistId, userId: user.id },
  });
  if (!wishlist) throw new Error("Wishlist not found");

  // Parse price string to number
  let priceNum: number | null = null;
  if (data.price) {
    const cleaned = data.price.replace(/[^0-9.]/g, "");
    priceNum = parseFloat(cleaned) || null;
  }

  const item = await prisma.wishlistItem.create({
    data: {
      wishlistId: data.wishlistId,
      url: data.url,
      title: data.title,
      description: data.description || null,
      price: priceNum,
      currency: data.currency,
      imageUrl: data.imageUrl || null,
      sourceSite: data.sourceSite || null,
      notes: data.notes || null,
      priority: data.priority,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${data.wishlistId}`);
  return item;
}

export async function deleteItem(id: string) {
  const user = await requireAuth();

  const item = await prisma.wishlistItem.findUnique({
    where: { id },
    include: { wishlist: { select: { userId: true } } },
  });

  if (!item || item.wishlist.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.wishlistItem.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${item.wishlistId}`);
}

export async function togglePurchased(id: string) {
  const user = await requireAuth();

  const item = await prisma.wishlistItem.findUnique({
    where: { id },
    include: { wishlist: { select: { userId: true } } },
  });

  if (!item || item.wishlist.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.wishlistItem.update({
    where: { id },
    data: {
      status: item.status === "PURCHASED" ? "AVAILABLE" : "PURCHASED",
    },
  });

  revalidatePath(`/dashboard/${item.wishlistId}`);
}

export async function updateItemPriority(
  id: string,
  priority: "LOW" | "MEDIUM" | "HIGH"
) {
  const user = await requireAuth();

  const item = await prisma.wishlistItem.findUnique({
    where: { id },
    include: { wishlist: { select: { userId: true } } },
  });

  if (!item || item.wishlist.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.wishlistItem.update({
    where: { id },
    data: { priority },
  });

  revalidatePath(`/dashboard/${item.wishlistId}`);
}

export async function updateItemNotes(id: string, notes: string) {
  const user = await requireAuth();

  const item = await prisma.wishlistItem.findUnique({
    where: { id },
    include: { wishlist: { select: { userId: true } } },
  });

  if (!item || item.wishlist.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.wishlistItem.update({
    where: { id },
    data: { notes: notes || null },
  });

  revalidatePath(`/dashboard/${item.wishlistId}`);
}
