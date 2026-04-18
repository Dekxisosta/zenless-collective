import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import productsData from "../../data/products.json";
import Card from "../../components/user/Card.jsx";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const PAGE_SIZE = 6;

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (searchInput) params.set("search", searchInput);
        else params.delete("search");

        params.set("page", 1);
        return params;
      });
    }, 300);

    return () => clearTimeout(t);
  }, [searchInput, setSearchParams]);

  const categories = useMemo(() => {
    return ["all", ...new Set(productsData.map((p) => p.category))];
  }, []);

  const processed = useMemo(() => {
    let result = [...productsData];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    switch (sort) {
      case "price_low":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price_high":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [search, category, sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return processed.slice(start, start + PAGE_SIZE);
  }, [processed, page]);

  const totalPages = Math.ceil(processed.length / PAGE_SIZE);

  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      if (key !== "page") params.set("page", 1);

      return params;
    });
  };

  if (loading) return <SkeletonGrid />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-gray-500 text-sm">
          Browse, filter, and discover products
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* LEFT FLOWPANE */}
        <aside className="md:w-1/3 space-y-3">
          <p className="text-sm font-semibold">Categories</p>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => updateFilter("category", c)}
                className={`
                  px-3 py-1.5 rounded-full text-sm border transition
                  whitespace-nowrap
                  ${
                    category === c
                      ? "bg-black text-white border-black"
                      : "bg-white hover:bg-gray-100 border-gray-200"
                  }
                `}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="md:w-2/3 space-y-6">

          {/* FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="border rounded-lg px-3 py-2 flex-1"
            />

            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="rating">Best Rated</option>
              <option value="price_low">Price ↑</option>
              <option value="price_high">Price ↓</option>
            </select>
          </div>

          {/* CHIPS */}
          <div className="flex gap-2 flex-wrap text-sm">
            {search && (
              <Chip
                label={`Search: ${search}`}
                onClear={() => updateFilter("search", "")}
              />
            )}
            {category !== "all" && (
              <Chip
                label={`Category: ${category}`}
                onClear={() => updateFilter("category", "all")}
              />
            )}
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {paginated.map((product) => (
              <Card
                key={product.id}
                product={product}
                onClick={() =>
                  navigate(`/product/${slugify(product.name)}/${product.id}`)
                }
              />
            ))}
          </div>

          {/* EMPTY */}
          {paginated.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No products found.
            </div>
          )}

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => updateFilter("page", i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 ? "bg-black text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}

/* CHIP */
function Chip({ label, onClear }) {
  return (
    <div className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-2">
      <span>{label}</span>
      <button onClick={onClear} className="text-xs">✕</button>
    </div>
  );
}

/* SKELETON */
function SkeletonGrid() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-40 bg-gray-200 rounded-lg" />
          <div className="h-4 bg-gray-200 w-2/3 rounded" />
          <div className="h-4 bg-gray-200 w-1/3 rounded" />
        </div>
      ))}
    </div>
  );
}