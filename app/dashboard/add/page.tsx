"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Link2, Loader2, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { addItem } from "@/app/actions/item";
import { SessionProvider } from "@/components/session-provider";

type Wishlist = {
  id: string;
  title: string;
  coverEmoji: string;
};

type ScrapeResult = {
  title: string;
  description: string;
  price: string | null;
  imageUrl: string | null;
  sourceSite: string;
};

export default function AddItemPage() {
  return (
    <Suspense>
      <SessionProvider>
        <AddItemForm />
      </SessionProvider>
    </Suspense>
  );
}

function AddItemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedWishlistId = searchParams.get("wishlistId") || "";

  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState(
    preselectedWishlistId
  );
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ScrapeResult | null>(null);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState("");

  // Fetch user's wishlists
  useEffect(() => {
    fetch("/api/wishlists")
      .then((res) => res.json())
      .then((data) => setWishlists(data))
      .catch(() => {});
  }, []);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setPreview(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "failed to fetch product details");
        return;
      }

      setPreview(data);
    } catch {
      setError("something went wrong. try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preview || !selectedWishlistId) return;
    setSaving(true);
    setError("");

    try {
      await addItem({
        wishlistId: selectedWishlistId,
        url: url.trim(),
        title: preview.title,
        description: preview.description || undefined,
        price: preview.price || undefined,
        currency: "INR",
        priority: "MEDIUM",
        imageUrl: preview.imageUrl || undefined,
        sourceSite: preview.sourceSite || undefined,
        notes: notes || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/${selectedWishlistId}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          back to wishlists
        </Link>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          add an item
        </h1>
        <p className="text-text-muted text-sm mb-8">
          paste a link from any store and we&apos;ll fetch the details
          automatically
        </p>

        {/* Success message */}
        {success && (
          <div className="mb-6 px-4 py-3 bg-mint/30 border-2 border-text/20 rounded-xl text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            item added! redirecting...
          </div>
        )}

        {/* Wishlist selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            add to wishlist
          </label>
          <div className="relative">
            <select
              value={selectedWishlistId}
              onChange={(e) => setSelectedWishlistId(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 border-2 border-text/20 rounded-xl text-sm focus:outline-none focus:border-text transition-colors bg-white pr-10"
            >
              <option value="">select a wishlist</option>
              {wishlists.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.coverEmoji} {w.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
          {wishlists.length === 0 && (
            <p className="text-xs text-text-muted mt-1">
              no wishlists yet —{" "}
              <Link href="/dashboard" className="underline">
                create one first
              </Link>
            </p>
          )}
        </div>

        {/* URL Input */}
        <div className="bg-white border-2 border-text rounded-2xl p-6 shadow-[4px_4px_0_var(--text)]">
          <label className="block text-sm font-medium mb-2">
            product link
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://amazon.in/dp/..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-text/20 rounded-xl text-sm focus:outline-none focus:border-text transition-colors bg-cream/50"
              />
            </div>
            <button
              onClick={handleFetch}
              disabled={loading || !url.trim()}
              className="pill-btn !text-sm disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "fetch"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 bg-blush/50 border border-text/20 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-6 bg-white border-2 border-text rounded-2xl p-6 shadow-[4px_4px_0_var(--text)]">
            <h3 className="font-display font-bold text-sm mb-4">
              found this:
            </h3>
            <div className="flex gap-4">
              {preview.imageUrl && (
                <div className="w-24 h-24 rounded-xl bg-cream border border-text/10 flex-shrink-0 overflow-hidden">
                  <img
                    src={preview.imageUrl}
                    alt={preview.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-sm line-clamp-2">
                  {preview.title}
                </h4>
                {preview.description && (
                  <p className="text-text-muted text-xs mt-1 line-clamp-2">
                    {preview.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {preview.price && (
                    <span className="font-display font-bold text-lg">
                      {preview.price}
                    </span>
                  )}
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    {preview.sourceSite}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-xs font-medium mb-1">
                personal note (optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., the blue one, size M"
                className="w-full px-3 py-2 border border-text/10 rounded-lg text-xs focus:outline-none focus:border-text transition-colors bg-cream/50"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                disabled={saving || !selectedWishlistId}
                className="pill-btn !text-sm flex-1 justify-center disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "add to wishlist"
                )}
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  setUrl("");
                  setNotes("");
                }}
                className="pill-btn pill-btn-secondary !text-sm"
              >
                cancel
              </button>
            </div>
          </div>
        )}

        {/* Supported sites hint */}
        <div className="mt-8 p-4 bg-white border border-text/10 rounded-xl">
          <p className="text-xs text-text-muted mb-2">supported stores:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Amazon",
              "Flipkart",
              "Myntra",
              "Nykaa",
              "Meesho",
              "Ajio",
              "Croma",
              "Apple",
            ].map((site) => (
              <span
                key={site}
                className="px-2 py-0.5 bg-cream border border-text/10 rounded-full text-[10px] font-medium"
              >
                {site}
              </span>
            ))}
          </div>
        </div>
      </div>
  );
}
