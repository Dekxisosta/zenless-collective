export default function About() {
  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-14">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">About Zelphyra Collective</h1>
          <p
            style={{ color: "var(--color-text-muted)" }}
            className="text-sm md:text-base"
          >
            A modern ecommerce experience built for simplicity, clarity, and style.
          </p>
        </div>

        {/* STORY */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Our Story</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Zelphyra Collective started as a small idea — build a clean, fast,
            and distraction-free shopping experience. No clutter, no noise,
            just products that matter and a smooth user experience.
          </p>
        </section>

        {/* MISSION */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Our Mission</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            We aim to simplify online shopping by focusing on performance,
            usability, and design. Every interaction is built to feel smooth,
            responsive, and intentional.
          </p>
        </section>

        {/* VISION */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Our Vision</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            To create a shopping ecosystem where discovery feels natural,
            products feel curated, and users never feel overwhelmed by choice.
          </p>
        </section>

        {/* VALUES */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">What We Value</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Simplicity",
                desc: "No unnecessary clutter. Just clean design.",
              },
              {
                title: "Speed",
                desc: "Fast navigation and instant feedback.",
              },
              {
                title: "Clarity",
                desc: "Everything is easy to understand and use.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl border"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">The Team</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            A small group of designers and developers focused on building
            clean, performant interfaces. We care more about how something
            feels than how complex it looks.
          </p>

          <div className="grid md:grid-cols-3 gap-4 pt-2">
            {[
              { name: "Design", role: "UI/UX Systems" },
              { name: "Engineering", role: "Frontend + Performance" },
              { name: "Experience", role: "User Flow + Interaction" },
            ].map((t) => (
              <div
                key={t.name}
                className="p-4 rounded-xl border"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "rgba(0,0,0,0.03)",
                }}
              >
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {t.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="grid md:grid-cols-3 gap-4">
          {[
            { label: "Curated Products", value: "500+" },
            { label: "Active Users", value: "10K+" },
            { label: "Average Load Time", value: "<1s" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-6 rounded-xl border"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* VALUES (existing kept) */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">What We Value</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Simplicity",
                desc: "No unnecessary clutter. Just clean design.",
              },
              {
                title: "Speed",
                desc: "Fast navigation and instant feedback.",
              },
              {
                title: "Clarity",
                desc: "Everything is easy to understand and use.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl border"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="text-center p-8 rounded-xl border"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        >
          <h2 className="text-lg font-semibold mb-2">Ready to explore?</h2>
          <p
            className="text-sm mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Check out our latest products and start shopping.
          </p>

          <a
            href="/products"
            className="inline-block px-5 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            Browse Products
          </a>
        </section>
      </div>
    </div>
  );
}