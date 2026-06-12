"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, Loader2 } from "lucide-react";
import { claimItem } from "@/app/actions/claim";

export function ClaimModal({
  itemId,
  itemTitle,
  open,
  onClose,
}: {
  itemId: string;
  itemTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await claimItem(itemId, name, email || undefined);
      setName("");
      setEmail("");
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-text/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white border-2 border-text rounded-2xl p-6 w-full max-w-sm shadow-[6px_6px_0_var(--text)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-coral" />
          <h2 className="font-display text-lg font-bold">reserve this item</h2>
        </div>

        <p className="text-text-muted text-sm mb-4 line-clamp-2">
          &ldquo;{itemTitle}&rdquo;
        </p>

        <form onSubmit={handleClaim} className="space-y-3">
          {error && (
            <div className="px-3 py-2 bg-blush/50 border border-text/20 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1">your name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Priya"
              required
              className="w-full px-3 py-2 border-2 border-text/20 rounded-lg text-sm focus:outline-none focus:border-text transition-colors bg-cream/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="for a thank-you message"
              className="w-full px-3 py-2 border-2 border-text/20 rounded-lg text-sm focus:outline-none focus:border-text transition-colors bg-cream/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="pill-btn w-full justify-center !text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "reserve it"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
