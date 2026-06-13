import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wishlist — Your Favorites, All in One Place",
  description:
    "Save items from Amazon, Flipkart, Myntra, and more. Your personal wishlist, beautifully organized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col grain-overlay">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
