import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExternalLink, Lock, Check, Gift } from "lucide-react";
import { ClaimButton } from "@/components/claim-button";

async function getPublicWishlist(username: string, slug: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, image: true },
  });

  if (!user) return null;

  const wishlist = await prisma.wishlist.findFirst({
    where: {
      userId: user.id,
      slug,
      isPublic: true,
    },
    include: {
      items: {
        orderBy: [
          { status: "asc" },
          { priority: "desc" },
          { addedAt: "desc" },
        ],
      },
    },
  });

  if (!wishlist) return null;

  return { user, wishlist };
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
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

export default async function PublicWishlistPage({
  params,
}: {
  params: Promise<{ username: string; wishlistSlug: string }>;
}) {
  const { username, wishlistSlug } = await params;
  const data = await getPublicWishlist(username, wishlistSlug);

  if (!data) {
    notFound();
  }

  const { user, wishlist } = data;

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b-2 border-text bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-coral border-2 border-text flex items-center justify-center">
              <Gift className="w-4 h-4 text-text" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              wishlist
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <div className="w-6 h-6 rounded-full bg-lavender border border-text/20 flex items-center justify-center text-[10px] font-bold">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span>{user.name}</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-lavender/30 border-2 border-text/10 flex items-center justify-center text-4xl">
            {wishlist.coverEmoji}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {wishlist.title}
            </h1>
            {wishlist.description && (
              <p className="text-text-muted text-sm mt-1">
                {wishlist.description}
              </p>
            )}
            <p className="text-xs text-text-muted mt-2">
              {wishlist.items.length} items &middot;{" "}
              {wishlist.items.filter((i) => i.status === "AVAILABLE").length}{" "}
              available
            </p>
          </div>
        </div>

        {/* Items */}
        {wishlist.items.length === 0 ? (
          <div className="border-2 border-dashed border-text/20 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="font-display text-xl font-bold mb-2">
              nothing here yet
            </h3>
            <p className="text-text-muted text-sm">
              this wishlist is empty. check back later!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.items.map((item) => (
              <div
                key={item.id}
                className="site-card relative hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text)] transition-all"
              >
                {/* Image */}
                <div className="w-full h-36 rounded-xl bg-white border border-text/10 flex items-center justify-center mb-3 overflow-hidden">
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

                  {item.price ? (
                    <span className="font-display font-bold text-lg">
                      {item.currency === "INR" ? "₹" : "$"}
                      {Number(item.price).toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted">no price</span>
                  )}

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

                  <div className="flex items-center justify-between pt-2 border-t border-text/5">
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

                  {/* Claim button for available items */}
                  {item.status === "AVAILABLE" && (
                    <ClaimButton
                      itemId={item.id}
                      itemTitle={item.title}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-text bg-white mt-16">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-text-muted">
          made with{" "}
          <span className="text-coral">♥</span> by {user.name || username}
        </div>
      </footer>
    </div>
  );
}
