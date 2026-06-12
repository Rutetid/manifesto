"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createWishlist(data: {
  title: string;
  description?: string;
  coverEmoji?: string;
}) {
  const user = await requireAuth();

  const slug = slugify(data.title);

  // Ensure unique slug
  const existing = await prisma.wishlist.findFirst({
    where: { userId: user.id, slug },
  });

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const wishlist = await prisma.wishlist.create({
    data: {
      userId: user.id,
      title: data.title,
      description: data.description || null,
      slug: finalSlug,
      coverEmoji: data.coverEmoji || "🎁",
    },
  });

  revalidatePath("/dashboard");
  return wishlist;
}

export async function deleteWishlist(id: string) {
  const user = await requireAuth();

  await prisma.wishlist.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard");
}

export async function toggleWishlistPublic(id: string) {
  const user = await requireAuth();

  const wishlist = await prisma.wishlist.findFirst({
    where: { id, userId: user.id },
  });

  if (!wishlist) throw new Error("Wishlist not found");

  await prisma.wishlist.update({
    where: { id },
    data: { isPublic: !wishlist.isPublic },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${id}`);
}
