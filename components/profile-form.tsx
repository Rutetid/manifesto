"use client";

import { useState } from "react";
import { User, Mail, AtSign, Loader2, Check } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

type UserProfile = {
  name: string | null;
  email: string | null;
  username: string | null;
  createdAt: Date;
  wishlistCount: number;
};

export function ProfileForm({ user }: { user: UserProfile }) {
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({ name, username: username || undefined });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {error && (
        <div className="px-4 py-3 bg-blush/50 border border-text/20 rounded-xl text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="px-4 py-3 bg-mint/30 border border-text/20 rounded-xl text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          profile updated!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">
          <User className="w-3.5 h-3.5 inline mr-1.5" />
          name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 border-2 border-text/20 rounded-xl text-sm focus:outline-none focus:border-text transition-colors bg-cream/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          <AtSign className="w-3.5 h-3.5 inline mr-1.5" />
          username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="choose a username"
          className="w-full px-4 py-2.5 border-2 border-text/20 rounded-xl text-sm focus:outline-none focus:border-text transition-colors bg-cream/50"
        />
        <p className="text-xs text-text-muted mt-1">
          your public wishlist URL: wishlist.app/w/
          {username || "your-username"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          <Mail className="w-3.5 h-3.5 inline mr-1.5" />
          email
        </label>
        <input
          type="email"
          value={user.email || ""}
          disabled
          className="w-full px-4 py-2.5 border-2 border-text/10 rounded-xl text-sm bg-cream/30 text-text-muted cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="pill-btn !text-sm disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "save changes"
        )}
      </button>
    </form>
  );
}
