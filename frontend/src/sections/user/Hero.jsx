import { Link } from "react-router-dom";

const heroImg = "/images/hero.jpg";
const ambassadorImg = "/images/ambassador.png";

export default function Hero() {
  return (
    <section className="relative w-full h-[520px] overflow-hidden">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "slowPan 20s ease-in-out infinite alternate",
        }}
      />

      {/* MAIN OVERLAY (keep this for readability) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center max-w-6xl mx-auto px-6">
        <div className="max-w-xl">

          <p className="text-xs tracking-[0.3em] uppercase text-red-300 mb-4">
            Zelphyra Collective • New Season
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Curated Finds for
            <br />
            <span className="text-red-400">Every Lifestyle</span>
          </h1>

          <p className="text-white/70 mt-5 text-lg">
            Books, manga, tech, and lifestyle essentials — all in one curated space.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Shop Now
            </Link>

            <Link
              to="/about"
              className="px-6 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition"
            >
              About Zelphyra →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}