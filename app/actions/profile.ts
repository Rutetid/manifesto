"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, - and _")
    .optional()
    .or(z.literal("")),
});

export async function getProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      username: true,
      createdAt: true,
      _count: { select: { wishlists: true } },
    },
  });

  return user;
}

export async function updateProfile(data: { name: string; username?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = updateProfileSchema.parse(data);

  // Check username uniqueness if provided
  if (parsed.username && parsed.username !== "") {
    const existing = await prisma.user.findFirst({
      where: {
        username: parsed.username,
        NOT: { id: session.user.id },
      },
    });

    if (existing) {
      throw new Error("Username is already taken");
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.name,
      username: parsed.username || null,
    },
  });

  revalidatePath("/dashboard/profile");
}
