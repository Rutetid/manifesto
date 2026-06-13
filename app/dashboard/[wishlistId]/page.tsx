"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, ExternalLink, Lock, Check } from "lucide-react";
import { SessionProvider } from "@/components/session-provider";
import { ItemActions } from "@/components/item-actions";
import { getWishlist } from "@/app/actions/wishlist";

type Item = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  price: number | string | null;
  currency: string | null;
  imageUrl: string | null;
  sourceSite: string | null;
  notes: string | null;
  status: string;
  priority: string;
  claimedBy: string | null;
  addedAt: Date;
};

type Tag = {
  id: string;
  name: string;
  color: string;
};

type Wishlist = {
  id: string;
  title: string;
  description: string | null;
  coverEmoji: string;
  isPublic: boolean;
  items: Item[];
  tags: Tag[];
};

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "AVAILABLE":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-mint/30 border border-text/10 rounded-full text-[10px] font-medium">
          available
        </span>
      );
    case "CLAIMED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-peach/30 border border-text/10 rounded-full text-[10px] font-medium">
          <Lock className="w-2.5 h-2.5" />
          claimed
        </span>
      );
    case "PURCHASED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-lavender/30 border border-text/10 rounded-full text-[10px] font-medium">
          <Check className="w-2.5 h-2.5" />
          purchased
        </span>
      );
    default:
      return null;
  }
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    HIGH: "bg-coral/30",
    MEDIUM: "bg-butter/30",
    LOW: "bg-sky/30",
  };
  return (
    <span
      className={`px-2 py-0.5 border border-text/10 rounded-full text-[10px] font-medium ${colors[priority] || "bg-cream"}`}
    >
      {priority.toLowerCase()}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="h-4 w-32 bg-text/5 rounded mb-4 animate-pulse" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-text/5 rounded-2xl animate-pulse" />
            <div>
              <div className="h-7 w-48 bg-text/5 rounded mb-2 animate-pulse" />
              <div className="h-4 w-32 bg-text/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-text/10 rounded-2xl p-4">
            <div className="w-full h-36 bg-text/5 rounded-xl mb-3 animate-pulse" />
            <div className="h-5 w-3/4 bg-text/5 rounded mb-2 animate-pulse" />
            <div className="h-6 w-1/3 bg-text/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wishlistId = params.wishlistId as string;
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist(wishlistId)
      .then((data) => {
        if (!data) {
          router.push("/dashboard");
        } else {
          setWishlist(data as Wishlist);
        }
      })
      .finally(() => setLoading(false));
  }, [wishlistId, router]);

  if (loading) return <LoadingSkeleton />;
  if (!wishlist) return null;

  const availableCount = wishlist.items.filter(
    (i) => i.status === "AVAILABLE"
  ).length;
  const claimedCount = wishlist.items.filter(
    (i) => i.status === "CLAIMED"
  ).length;
  const purchasedCount = wishlist.items.filter(
    (i) => i.status === "PURCHASED"
  ).length;

  return (
    <SessionProvider>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        {/* Back + Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            back to wishlists
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-lavender/30 border-2 border-text/10 flex items-center justify-center text-3xl">
                {wishlist.coverEmoji}
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {wishlist.title}
                </h1>
                {wishlist.description && (
                  <p className="text-text-muted text-sm mt-1">
                    {wishlist.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  {wishlist.isPublic && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-mint/30 border border-text/10 rounded-full font-medium">
                      public
                    </span>
                  )}
                  <span>{wishlist.items.length} items</span>
                  {availableCount > 0 && (
                    <span className="text-mint">{availableCount} available</span>
                  )}
                  {claimedCount > 0 && (
                    <span className="text-coral">{claimedCount} claimed</span>
                  )}
                  {purchasedCount > 0 && (
                    <span>{purchasedCount} bought</span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/dashboard/add?wishlistId=${wishlist.id}`}
              className="pill-btn !text-sm"
            >
              <Plus className="w-4 h-4" />
              add item
            </Link>
          </div>
        </div>

        {/* Tags */}
        {wishlist.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {wishlist.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 border border-text/10 rounded-full text-xs font-medium"
                style={{ backgroundColor: tag.color + "40" }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Items */}
        {wishlist.items.length === 0 ? (
          <div className="border-2 border-dashed border-text/20 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="font-display text-xl font-bold mb-2">
              no items yet
            </h3>
            <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
              paste a link from amazon, flipkart, myntra and we&apos;ll
              auto-fill the details
            </p>
            <Link
              href={`/dashboard/add?wishlistId=${wishlist.id}`}
              className="pill-btn !text-sm inline-flex"
            >
              <Plus className="w-4 h-4" />
              add first item
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.items.map((item) => (
              <div
                key={item.id}
                className="site-card group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text)] transition-all"
              >
                {/* Image */}
                <div className="w-full h-36 rounded-xl bg-cream border border-text/10 flex items-center justify-center mb-3 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">📷</span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-bold text-sm leading-tight line-clamp-2">
                      {item.title}
                    </h4>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center justify-between">
                    {item.price ? (
                      <span className="font-display font-bold text-lg">
                        {item.currency === "INR" ? "₹" : "$"}
                        {Number(item.price).toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">no price</span>
                    )}
                    <PriorityBadge priority={item.priority} />
                  </div>

                  {item.claimedBy && (
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-peach/20 rounded-lg">
                      <div className="w-5 h-5 rounded-full bg-peach border border-text/20 flex items-center justify-center text-[8px] font-bold">
                        {item.claimedBy[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs text-text-muted">
                        claimed by{" "}
                        <span className="font-medium text-text">
                          {item.claimedBy}
                        </span>
                      </span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-text-muted line-clamp-2 italic">
                      &ldquo;{item.notes}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted uppercase tracking-wide">
                      {item.sourceSite || "other"}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Item actions */}
                  <ItemActions
                    itemId={item.id}
                    status={item.status}
                    priority={item.priority}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SessionProvider>
  );
}
