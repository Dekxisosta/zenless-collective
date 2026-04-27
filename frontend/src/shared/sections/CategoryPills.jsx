import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { RetryComponent } from "..";

function CategoryPillsSkeleton() {
  const widths = [80, 100, 64, 90, 72, 110, 68, 95];
  return (
    <div className="flex flex-wrap gap-2" style={{ maxHeight: "4.5rem", overflow: "hidden" }}>
      {widths.map((w, i) => (
        <div
          key={i}
          className="animate-pulse flex-shrink-0 h-7 rounded-full"
          style={{ width: w, background: "var(--color-surface)" }}
        />
      ))}
    </div>
  );
}

export default function CategoryPills() {
  const { categories, loading, error, refetch } = useCategories();

  const sorted = [...(categories ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <section className="w-full px-6 py-6">
      <h2
        className="py-6 text-lg font-semibold mb-4"
        style={{ color: "var(--color-text)" }}
      >
        Shop by Category
      </h2>

      {loading ? (
        <CategoryPillsSkeleton />
      ) : error ? (
        <RetryComponent errorType="FETCH_ERROR" onRetry={refetch} />
      ) : (
        <div className="flex flex-wrap gap-2" style={{ maxHeight: "5rem", overflow: "hidden" }}>
          {sorted.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="flex-shrink-0 text-xs font-bold transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "999px",
                padding: "10px 20px",
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
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}