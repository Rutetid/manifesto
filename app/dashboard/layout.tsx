"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Gift, LogOut, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r-2 border-text bg-white flex-col">
        {/* Logo */}
        <div className="p-5 border-b-2 border-text">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral border-2 border-text flex items-center justify-center">
              <Gift className="w-4 h-4 text-text" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              wishlist
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-cream transition-colors"
          >
            <Gift className="w-4 h-4" />
            my wishlists
          </Link>
          <Link
            href="/dashboard/add"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-cream transition-colors"
          >
            <Plus className="w-4 h-4" />
            add item
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-cream transition-colors"
          >
            <Settings className="w-4 h-4" />
            profile
          </Link>
        </nav>

        {/* User */}
        <div className="p-4 border-t-2 border-text">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-lavender border-2 border-text flex items-center justify-center text-sm font-bold">
              {session?.user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || "user"}
              </p>
              <p className="text-xs text-text-muted truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-cream transition-colors text-text-muted hover:text-text"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 lg:hidden z-40 border-b-2 border-text bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-coral border-2 border-text flex items-center justify-center">
              <Gift className="w-3.5 h-3.5 text-text" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-bold tracking-tight">
              wishlist
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg hover:bg-cream transition-colors text-text-muted"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
