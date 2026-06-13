"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreateWishlistButton } from "@/components/create-wishlist-modal";
import { getWishlists } from "@/app/actions/wishlist";

type Wishlist = {
  id: string;
  title: string;
  description: string | null;
  coverEmoji: string;
  isPublic: boolean;
  updatedAt: Date;
  items: { id: string; status: string; imageUrl: string | null }[];
};

function LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-text/5 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-text/5 rounded mt-2 animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-text/5 rounded-full animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-text/10 rounded-2xl p-4">
            <div className="w-full h-32 bg-text/5 rounded-xl mb-4 animate-pulse" />
            <div className="h-5 w-3/4 bg-text/5 rounded mb-2 animate-pulse" />
            <div className="h-3 w-1/2 bg-text/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlists()
      .then(setWishlists)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            my wishlists
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {wishlists.length === 0
              ? "create your first wishlist to get started"
              : `${wishlists.length} wishlist${wishlists.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <CreateWishlistButton />
      </div>

      {/* Wishlists Grid */}
      {wishlists.length === 0 ? (
        <div className="border-2 border-dashed border-text/20 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="font-display text-xl font-bold mb-2">
            no wishlists yet
          </h3>
          <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
            create your first wishlist and start adding items from your
            favorite stores
          </p>
          <CreateWishlistButton />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlists.map((wishlist) => {
            const itemCount = wishlist.items.length;
            const claimedCount = wishlist.items.filter(
              (i) => i.status === "CLAIMED"
            ).length;
            const purchasedCount = wishlist.items.filter(
              (i) => i.status === "PURCHASED"
            ).length;

            return (
              <Link
                key={wishlist.id}
                href={`/dashboard/${wishlist.id}`}
                className="site-card group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text)] transition-all"
              >
                {/* Cover */}
                <div className="w-full h-32 rounded-xl bg-lavender/30 border border-text/10 flex items-center justify-center text-5xl mb-4 group-hover:scale-[1.02] transition-transform">
                  {wishlist.coverEmoji}
                </div>

                {/* Info */}
                <h3 className="font-display font-bold text-lg mb-1">
                  {wishlist.title}
                </h3>
                {wishlist.description && (
                  <p className="text-text-muted text-xs line-clamp-2 mb-3">
                    {wishlist.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{itemCount} items</span>
                  {claimedCount > 0 && (
                    <span className="text-coral">{claimedCount} claimed</span>
                  )}
                  {purchasedCount > 0 && (
                    <span className="text-mint">{purchasedCount} bought</span>
                  )}
                </div>

                {/* Public badge */}
                {wishlist.isPublic && (
                  <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-mint/30 border border-text/10 rounded-full text-[10px] font-medium">
                    public
                  </div>
                )}
              </Link>
            );
          })}

          {/* Add new card */}
          <CreateWishlistButton />
        </div>
      )}
    </div>
  );
}
