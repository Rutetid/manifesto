"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createWishlist } from "@/app/actions/wishlist";

const EMOJI_OPTIONS = ["🎁", "🎂", "🎉", "🛍️", "💫", "🌟", "🎈", "🎊", "💝", "🎀"];

export function CreateWishlistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const wishlist = await createWishlist({ title, description, coverEmoji: emoji });
      setTitle("");
      setDescription("");
      setEmoji("🎁");
      onClose();
      router.push(`/dashboard/${wishlist.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-2 border-text rounded-2xl p-6 w-full max-w-md shadow-[6px_6px_0_var(--text)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-xl font-bold mb-4">
          new wishlist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 bg-blush/50 border border-text/20 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Emoji picker */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              pick an emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                    emoji === e
                      ? "border-text bg-butter/30 scale-110"
                      : "border-text/10 hover:border-text/30"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="wishlist-title"
              className="block text-sm font-medium mb-1.5"
            >
              title *
            </label>
            <input
              id="wishlist-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Birthday 2026"
              required
              className="w-full px-4 py-2.5 border-2 border-text/20 rounded-xl text-sm focus:outline-none focus:border-text transition-colors bg-cream/50"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="wishlist-desc"
              className="block text-sm font-medium mb-1.5"
            >
              description (optional)
            </label>
            <textarea
              id="wishlist-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="things I'd love for my birthday..."
              rows={2}
              className="w-full px-4 py-2.5 border-2 border-text/20 rounded-xl text-sm focus:outline-none focus:border-text transition-colors bg-cream/50 resize-none"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-text/10">
            <span className="text-3xl">{emoji}</span>
            <div>
              <p className="font-display font-bold text-sm">
                {title || "Your wishlist"}
              </p>
              <p className="text-xs text-text-muted">
                {description || "no description"}
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="pill-btn w-full justify-center !text-sm disabled:opacity-50"
          >
            {loading ? "creating..." : "create wishlist"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function CreateWishlistButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="pill-btn !text-sm">
        <Plus className="w-4 h-4" />
        new wishlist
      </button>
      <CreateWishlistModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
