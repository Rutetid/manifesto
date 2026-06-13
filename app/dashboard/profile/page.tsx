"use client";

import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/profile-form";
import { getProfile } from "@/app/actions/profile";

type Profile = {
  name: string | null;
  email: string;
  username: string | null;
  createdAt: Date;
  _count: { wishlists: number };
};

function LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <div className="h-7 w-32 bg-text/5 rounded mb-2 animate-pulse" />
      <div className="h-4 w-48 bg-text/5 rounded mb-8 animate-pulse" />
      <div className="bg-white border-2 border-text rounded-2xl p-6 shadow-[4px_4px_0_var(--text)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-text/5 rounded-full animate-pulse" />
          <div>
            <div className="h-5 w-32 bg-text/5 rounded mb-2 animate-pulse" />
            <div className="h-4 w-40 bg-text/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-text/5 rounded-xl animate-pulse" />
          <div className="h-10 bg-text/5 rounded-xl animate-pulse" />
          <div className="h-10 bg-text/5 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!profile) return null;

  return (
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
              {profile.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">
                {profile.name || "Anonymous"}
              </h2>
              <p className="text-text-muted text-sm">{profile.email}</p>
            </div>
          </div>

          {/* Form */}
          <ProfileForm
            user={{
              name: profile.name,
              email: profile.email,
              username: profile.username,
              createdAt: profile.createdAt,
              wishlistCount: profile._count.wishlists,
            }}
          />

          {/* Footer info */}
          <div className="mt-6 pt-4 border-t border-text/10">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>
                member since{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>
                {profile._count.wishlists} wishlists
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
