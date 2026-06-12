import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/session-provider";
import { ProfileForm } from "@/components/profile-form";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
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

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          profile
        </h1>
        <p className="text-text-muted text-sm mb-8">
          manage your account settings
        </p>

        {/* Profile Card */}
        <div className="bg-white border-2 border-text rounded-2xl p-6 shadow-[4px_4px_0_var(--text)]">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-lavender border-2 border-text flex items-center justify-center text-2xl font-bold">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                {user.name || "Anonymous"}
              </h2>
              <p className="text-text-muted text-sm">{user.email}</p>
            </div>
          </div>

          {/* Form */}
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              username: user.username,
              createdAt: user.createdAt,
              wishlistCount: user._count.wishlists,
            }}
          />

          {/* Footer info */}
          <div className="mt-6 pt-4 border-t border-text/10">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>
                member since{" "}
                {user.createdAt.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>
                {user._count.wishlists} wishlists
              </span>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
