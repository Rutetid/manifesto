import { Gift } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-cream">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-coral border-2 border-text flex items-center justify-center">
            <Gift className="w-6 h-6 text-text" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">
            wishlist
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
