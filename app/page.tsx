import Link from "next/link";
import {
  Star,
  Heart,
  Sparkles,
  ShoppingBag,
  ArrowDown,
  Link2,
  LayoutGrid,
  Gift,
  ExternalLink,
} from "lucide-react";

function StarDecor({ className }: { className?: string }) {
  return (
    <Star
      className={`fill-butter stroke-text ${className}`}
      strokeWidth={2}
    />
  );
}

function HeartDecor({ className }: { className?: string }) {
  return (
    <Heart
      className={`fill-blush stroke-text ${className}`}
      strokeWidth={2}
    />
  );
}

function SparkleDecor({ className }: { className?: string }) {
  return (
    <Sparkles
      className={`fill-peach stroke-text ${className}`}
      strokeWidth={2}
    />
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b-2 border-text">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-coral border-2 border-text flex items-center justify-center">
              <Gift className="w-5 h-5 text-text" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              wishlist
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="hidden sm:block text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              features
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:block text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              how it works
            </a>
            <Link href="/signup" className="pill-btn text-sm !py-2 !px-5">
              <Sparkles className="w-4 h-4" />
              get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-12 left-8 w-40 h-40 bg-blush rounded-full blur-3xl opacity-50" />
        <div className="absolute top-32 right-12 w-56 h-56 bg-mint rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-8 left-1/3 w-48 h-48 bg-lavender rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-5xl mx-auto text-center stagger-children">
          {/* Floating decorations */}
          <div className="absolute -top-4 left-[15%] float-anim hidden sm:block">
            <StarDecor className="w-8 h-8" />
          </div>
          <div className="absolute top-16 right-[10%] float-anim-slow hidden sm:block">
            <HeartDecor className="w-7 h-7" />
          </div>
          <div className="absolute top-8 right-[25%] sparkle-anim hidden sm:block">
            <SparkleDecor className="w-6 h-6" />
          </div>
          <div className="absolute bottom-4 left-[8%] drift-anim hidden sm:block">
            <SparkleDecor className="w-5 h-5" />
          </div>

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-butter border-2 border-text rounded-full mb-8 text-sm font-medium shadow-[3px_3px_0_var(--text)]">
            <Heart className="w-4 h-4 fill-coral stroke-text" />
            your birthday wishlist, but make it cute
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
            everything you want,
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">all in one place</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 sm:h-4 bg-peach/60 -rotate-1 z-0" />
            </span>
          </h1>

          {/* Sub */}
          <p className="max-w-xl mx-auto text-lg sm:text-xl text-text-muted leading-relaxed mb-10">
            save stuff from{" "}
            <span className="font-semibold text-text">amazon</span>,{" "}
            <span className="font-semibold text-text">flipkart</span>,{" "}
            <span className="font-semibold text-text">myntra</span> &amp; more
            &mdash; your personal wishlist, beautifully messy and totally you.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="pill-btn text-lg">
              <ShoppingBag className="w-5 h-5" />
              start your wishlist
            </Link>
            <a
              href="#how-it-works"
              className="pill-btn pill-btn-secondary text-lg"
            >
              see how it works
            </a>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-2 text-text-muted">
            <span className="text-xs uppercase tracking-widest font-medium">
              scroll down
            </span>
            <ArrowDown className="w-5 h-5 scroll-indicator" />
          </div>
        </div>
      </section>

      {/* ── SITE MARQUEE ── */}
      <section className="border-y-2 border-text bg-white py-5 overflow-hidden">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[
            { name: "Amazon", emoji: "📦" },
            { name: "Flipkart", emoji: "🛍️" },
            { name: "Myntra", emoji: "👗" },
            { name: "Nykaa", emoji: "💄" },
            { name: "Meesho", emoji: "🎨" },
            { name: "Ajio", emoji: "👟" },
            { name: "Croma", emoji: "💻" },
            { name: "Apple", emoji: "🍎" },
            { name: "Amazon", emoji: "📦" },
            { name: "Flipkart", emoji: "🛍️" },
            { name: "Myntra", emoji: "👗" },
            { name: "Nykaa", emoji: "💄" },
            { name: "Meesho", emoji: "🎨" },
            { name: "Ajio", emoji: "👟" },
            { name: "Croma", emoji: "💻" },
            { name: "Apple", emoji: "🍎" },
          ].map((site, i) => (
            <span
              key={`${site.name}-${i}`}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border-2 border-text text-sm font-semibold bg-cream"
            >
              <span>{site.emoji}</span>
              {site.name}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 stagger-children">
            <span className="inline-block px-4 py-1.5 bg-mint border-2 border-text rounded-full text-sm font-semibold mb-4 shadow-[2px_2px_0_var(--text)]">
              how it works
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              three simple steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 stagger-children">
            {[
              {
                step: "01",
                icon: <Link2 className="w-7 h-7" />,
                title: "copy the link",
                desc: "found something you love? just copy the product link from any site.",
                color: "bg-blush",
              },
              {
                step: "02",
                icon: <LayoutGrid className="w-7 h-7" />,
                title: "paste & save",
                desc: "paste it into your wishlist. we'll grab the image, price & details automatically.",
                color: "bg-sky",
              },
              {
                step: "03",
                icon: <Heart className="w-7 h-7" />,
                title: "share & wish",
                desc: "send your wishlist to friends & family. no more \"what do you want?\" texts.",
                color: "bg-lavender",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div
                  className={`${item.color} border-2 border-text rounded-2xl p-8 shadow-[6px_6px_0_var(--text)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_var(--text)] transition-all`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-full bg-cream border-2 border-text flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-display text-4xl font-bold opacity-20">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed text-[0.95rem]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-24 sm:py-32 bg-white border-y-2 border-text">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 stagger-children">
            <span className="inline-block px-4 py-1.5 bg-lavender border-2 border-text rounded-full text-sm font-semibold mb-4 shadow-[2px_2px_0_var(--text)]">
              features
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
              everything you wished for
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              {
                icon: <ShoppingBag className="w-6 h-6" />,
                title: "multi-site support",
                desc: "amazon, flipkart, myntra, ajio, nykaa, meesho and more.",
                bg: "bg-peach/40",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "auto-fetch details",
                desc: "just paste a link and we'll pull the image, name & price for you.",
                bg: "bg-mint/40",
              },
              {
                icon: <LayoutGrid className="w-6 h-6" />,
                title: "organized boards",
                desc: "sort by priority, category, or price. your wishlist, your rules.",
                bg: "bg-sky/40",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "share with anyone",
                desc: "send your wishlist link to friends, family, or whoever's asking.",
                bg: "bg-blush/40",
              },
              {
                icon: <Gift className="w-6 h-6" />,
                title: "birthday mode",
                desc: "set a date and let people know what you're wishing for this year.",
                bg: "bg-butter/40",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "price tracking",
                desc: "get notified when something on your list goes on sale. score!",
                bg: "bg-lavender/40",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group border-2 border-text rounded-2xl p-6 hover:shadow-[4px_4px_0_var(--text)] transition-all cursor-default"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl border-2 border-text flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOCKUP / VISUAL ── */}
      <section className="px-6 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="relative border-2 border-text rounded-3xl bg-white p-6 sm:p-10 shadow-[8px_8px_0_var(--text)] overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-text/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-coral border border-text/20" />
                <div className="w-3 h-3 rounded-full bg-butter border border-text/20" />
                <div className="w-3 h-3 rounded-full bg-mint border border-text/20" />
              </div>
              <div className="flex-1 bg-cream rounded-full px-4 py-1.5 border border-text/10 text-xs text-text-muted font-mono">
                wishlist.app/my-birthday-list
              </div>
            </div>

            {/* Wishlist items mockup */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Vintage Film Camera",
                  price: "₹4,299",
                  from: "Amazon",
                  color: "bg-blush",
                  emoji: "📷",
                },
                {
                  name: "Linen Oversized Shirt",
                  price: "₹1,899",
                  from: "Myntra",
                  color: "bg-mint",
                  emoji: "👔",
                },
                {
                  name: "Ceramic Pour-Over Set",
                  price: "₹2,450",
                  from: "Flipkart",
                  color: "bg-lavender",
                  emoji: "☕",
                },
                {
                  name: "Retro Desk Lamp",
                  price: "₹3,100",
                  from: "Meesho",
                  color: "bg-butter",
                  emoji: "💡",
                },
                {
                  name: "Canvas Tote Bag",
                  price: "₹799",
                  from: "Ajio",
                  color: "bg-sky",
                  emoji: "👜",
                },
                {
                  name: "Vinyl Record Player",
                  price: "₹8,999",
                  from: "Croma",
                  color: "bg-peach",
                  emoji: "🎵",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="site-card hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text)] transition-all"
                >
                  <div
                    className={`${item.color} w-full h-28 rounded-xl border border-text/10 flex items-center justify-center text-4xl mb-3`}
                  >
                    {item.emoji}
                  </div>
                  <h4 className="font-display font-bold text-sm leading-tight mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-lg">
                      {item.price}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      {item.from}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Wishlist total */}
            <div className="mt-6 pt-4 border-t-2 border-text/10 flex items-center justify-between">
              <span className="text-text-muted text-sm">
                6 items on your wishlist
              </span>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl">₹21,546</span>
                <span className="text-xs text-text-muted">total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL / VIBE ── */}
      <section className="px-6 py-24 sm:py-32 bg-white border-y-2 border-text">
        <div className="max-w-3xl mx-auto text-center stagger-children">
          <div className="sticky-note inline-block mb-10">
            <p className="font-display text-xl sm:text-2xl font-bold leading-snug text-text relative z-10">
              &ldquo;made a wishlist for my birthday and finally stopped getting
              random socks from relatives&rdquo;
            </p>
            <p className="text-text-muted text-sm mt-3 relative z-10">
              &mdash; probably you, soon
            </p>
          </div>

          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-butter stroke-text"
                strokeWidth={2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-peach rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-mint rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-3xl mx-auto text-center stagger-children">
          <SparkleDecor className="w-10 h-10 mx-auto mb-6 sparkle-anim" />
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            stop sending screenshots
            <br />
            <span className="wavy-underline">start a wishlist</span>
          </h2>
          <p className="text-text-muted text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            it&apos;s free, it&apos;s personal, and it&apos;s about time you
            made your birthday wish list the way it deserves to be.
          </p>
          <Link href="/signup" className="pill-btn text-lg">
            <Heart className="w-5 h-5 fill-current" />
            create my wishlist
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-text bg-cream px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-coral border-2 border-text flex items-center justify-center">
              <Gift className="w-4 h-4 text-text" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-bold">wishlist</span>
          </div>
          <p className="text-text-muted text-xs">
            made with{" "}
            <Heart className="w-3 h-3 inline fill-coral stroke-text" /> for
            people who know what they want
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <a href="#" className="hover:text-text transition-colors">
              privacy
            </a>
            <a href="#" className="hover:text-text transition-colors">
              terms
            </a>
            <a href="#" className="hover:text-text transition-colors">
              contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
