import { useRef, useEffect } from "react";
import { Truck, ShieldCheck, HeadphonesIcon, RefreshCw, Lock, Tag } from "lucide-react";

const perks = [
  {
    icon: Truck,
    title: "Free delivery",
    description: "Free shipping on orders over ₱999. Same-day dispatch before 2PM.",
    stat: "2–4 days",
  },
  {
    icon: ShieldCheck,
    title: "Authentic guaranteed",
    description: "Every item is verified before it ships. 100% genuine or your money back.",
    stat: "100% legit",
  },
  {
    icon: HeadphonesIcon,
    title: "Live support",
    description: "Chat with a real person 7 days a week. Average response under 3 minutes.",
    stat: "< 3 min",
  },
  {
    icon: RefreshCw,
    title: "Easy returns",
    description: "Changed your mind? Return within 7 days, no forms, no hassle.",
    stat: "7-day window",
  },
  {
    icon: Lock,
    title: "Secure checkout",
    description: "End-to-end encrypted payments. GCash, Maya, cards — all accepted.",
    stat: "SSL secured",
  },
  {
    icon: Tag,
    title: "Best price promise",
    description: "Spot it cheaper elsewhere? We'll beat that price, guaranteed.",
    stat: "Price matched",
  },
];

const ticker = [...perks, ...perks];

export default function Perks() {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let raf;

    const step = () => {
      if (!pausedRef.current) {
        x -= 0.6;
        // Reset when first half scrolled past
        if (Math.abs(x) >= track.scrollWidth / 2) x = 0;
        track.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-bg)",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Fade edges */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to right, var(--color-bg) 0%, transparent 8%, transparent 92%, var(--color-bg) 100%)",
      }} />

      <div
        ref={trackRef}
        style={{
          display: "flex",
          width: "max-content",
          willChange: "transform",
        }}
      >
        {ticker.map(({ icon: Icon, title, description, stat }, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              padding: "1.5rem 1.75rem",
              borderRight: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              overflow: "hidden",
              minWidth: "260px",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-surface)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-bg)"}
          >
            {/* Accent diamonds */}
            <div style={{
              position: "absolute", top: "-18px", right: "-18px",
              width: "72px", height: "72px",
              background: "var(--color-primary)", opacity: 0.08,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }} />
            <div style={{
              position: "absolute", top: "-8px", right: "-8px",
              width: "40px", height: "40px",
              background: "var(--color-primary)", opacity: 0.12,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }} />

            {/* Icon */}
            <div style={{
              width: 44, height: 44, marginBottom: "0.875rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              clipPath: "polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1,
            }}>
              <Icon size={18} strokeWidth={1.75} style={{ color: "var(--color-primary)" }} />
            </div>

            {/* Stat chip */}
            <div style={{
              display: "inline-flex", alignItems: "center",
              marginBottom: "0.4rem",
              background: "var(--color-primary)", color: "var(--hero-text)",
              fontSize: "10px", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "2px 8px",
              clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)",
              position: "relative", zIndex: 1,
            }}>
              {stat}
            </div>

            <p style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 600, color: "var(--color-text)", position: "relative", zIndex: 1 }}>
              {title}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}