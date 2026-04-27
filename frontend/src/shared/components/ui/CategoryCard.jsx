import { Link } from "react-router-dom";

export default function CategorySection({ categories }) {
  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-wrap gap-2" style={{ maxHeight: "4.5rem", overflow: "hidden" }}>
      {sorted.map((category) => (
        <Link
          key={category.slug}
          to={`/products?category=${category.slug}`}
          className="flex-shrink-0 text-xs font-bold transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: "999px",
            padding: "5px 14px",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-primary)";
            e.currentTarget.style.color = "var(--hero-text)";
            e.currentTarget.style.borderColor = "var(--color-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-surface)";
            e.currentTarget.style.color = "var(--color-text)";
            e.currentTarget.style.borderColor = "var(--color-border)";
          }}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}