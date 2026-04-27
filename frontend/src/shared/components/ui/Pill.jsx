const VARIANTS = {
  exclusive: {
    label: "Shop Exclusive",
    bg: "#be185d",
    color: "#fff",
  },
  new: {
    label: "New Arrival",
    bg: "var(--color-primary)",
    color: "#fff",
  },
  trending: {
    label: "Trending",
    bg: "#ea580c",
    color: "#fff",
  },
  discounted: {
    label: "Discounted",
    bg: "#16a34a",
    color: "#fff",
  },
  bestseller: {
    label: "Bestseller",
    bg: "#d97706",
    color: "#fff",
  },
  sale: {
    label: "Sale Now!",
    bg: "#dc2626",
    color: "#fff",
  },
  limited: {
    label: "Limited",
    bg: "#7c3aed",
    color: "#fff",
  },
  hot: {
    label: "Hot",
    bg: "#e11d48",
    color: "#fff",
  },
};

export default function Pill({ label, bg, color }) {
  const base = VARIANTS[label] ?? VARIANTS.new;

  const resolvedBg    = bg    ?? base.bg;
  const resolvedColor = color ?? base.color;
  const resolvedLabel = (label ?? base.label).replace(/^\w/, c => c.toUpperCase());

  return (
    <span className="inline-flex flex-col items-start" style={{ gap: "1px" }}>

      {/* ZENLESS TAG */}
      <span
        className="inline-flex items-center font-bold tracking-widest"
        style={{
          fontSize: "7px",
          color: resolvedBg === "var(--color-primary)" ? "var(--color-primary)" : resolvedBg,
          backgroundColor: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(4px)",
          border: `1px solid ${resolvedBg === "var(--color-primary)" ? "var(--color-primary)" : resolvedBg}`,
          paddingLeft: "5px",
          paddingRight: "5px",
          paddingTop: "1px",
          paddingBottom: "1px",
          borderRadius: "3px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        ◆ zenless
      </span>

      {/* MAIN PILL + SLASH TAILS */}
      <span className="inline-flex items-stretch" style={{ gap: "2px" }}>

        {/* MAIN PILL */}
        <span
          className="inline-flex items-center text-xs font-bold relative overflow-hidden"
          style={{
            backgroundColor: resolvedBg,
            color: resolvedColor,
            clipPath: "polygon(0% 0%, 100% %, 100% 100%, 0% 100%)",
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingLeft: "44px",
            paddingRight: "16px",
            lineHeight: 1,
            minHeight: "28px",
          }}
        >
          {/* MASCOT */}
          <img
            src="/images/mascot-icon.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-2px",
              bottom: "0px",
              width: "40px",
              height: "40px",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          {/* HATCHES */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: "5px",
              backgroundImage: `repeating-linear-gradient(
                90deg,
                rgb(255,255,255) 0px,
                rgba(255,255,255,0.49) 4px,
                transparent 4px,
                transparent 8px
              )`,
            }}
          />

          {resolvedLabel}
        </span>

        {/* SLASH 1 */}
        <span
          style={{
            display: "inline-block",
            width: "6px",
            backgroundColor: resolvedBg,
            opacity: 0.6,
            clipPath: "polygon(0% 0%, 100% 0%, 94% 100%, 0% 100%)",
          }}
        />

        {/* SLASH 2 */}
        <span
          style={{
            display: "inline-block",
            width: "6px",
            backgroundColor: resolvedBg,
            opacity: 0.3,
            clipPath: "polygon(0% 0%, 100% 0%, 94% 100%, 0% 100%)",
          }}
        />

      </span>
    </span>
  );
}