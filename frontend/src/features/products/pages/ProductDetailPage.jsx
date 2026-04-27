import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Truck, ShoppingCart, PackageCheck, Heart } from "lucide-react";
import { RetryComponent } from "../../../shared";
import { useCart } from "../../../shared";

const formatSold = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const computePrice = (price, discount) => {
  if (!discount) return { final: price, saved: null };
  return {
    final: Math.round(price * (1 - discount / 100) * 100) / 100,
    saved: discount,
  };
};

const getStockStatus = (stock) => {
  if (stock === 0)  return { label: "Sold out",       color: "var(--color-text-subtle)" };
  if (stock <= 5)   return { label: `Last ${stock}!`, color: "var(--color-danger)" };
  if (stock <= 20)  return { label: "Low stock",      color: "var(--color-warning)" };
  return null;
};

/* ─── Sub-components ─────────────────────────────────── */

function ProductImage({ primaryImage, hoverImage, isSoldOut, name }) {
  return (
    <div
      className="rounded-xl overflow-hidden relative group"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <img
        src={primaryImage}
        alt={name}
        className="w-full h-[400px] object-cover transition-opacity duration-500 group-hover:opacity-0"
      />
      {hoverImage && (
        <img
          src={hoverImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-[400px] object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      )}
      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <span
            className="px-4 py-2 text-sm font-bold uppercase tracking-widest"
            style={{
              background: "var(--color-bg)",
              color: "var(--color-text)",
              borderRadius: "var(--radius)",
            }}
          >
            Out of Stock
          </span>
        </div>
      )}
    </div>
  );
}

function ProductMeta({ brand, name, sold, stock }) {
  const stockStatus = getStockStatus(stock);

  return (
    <div className="flex flex-col gap-1.5">
      {brand && (
        <p style={{
          color: "var(--color-text-muted)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          {brand}
        </p>
      )}

      <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
        {name}
      </h1>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {formatSold(sold)} sold
        </span>
        {stockStatus && (
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-2 py-0.5"
            style={{
              color: stockStatus.color,
              background: "color-mix(in srgb, " + stockStatus.color + " 12%, transparent)",
              borderRadius: "999px",
              border: "1px solid color-mix(in srgb, " + stockStatus.color + " 30%, transparent)",
            }}
          >
            <span style={{
              width: 6, height: 6,
              borderRadius: "50%",
              backgroundColor: stockStatus.color,
              display: "inline-block",
              flexShrink: 0,
            }} />
            {stockStatus.label}
          </span>
        )}
      </div>
    </div>
  );
}

function ProductPrice({ final, originalPrice, saved }) {
  return (
    <div className="flex items-end gap-3">
      <span className="text-3xl font-bold" style={{ color: "var(--color-danger)" }}>
        ₱{final.toFixed(2)}
      </span>
      {saved && (
        <span className="text-sm line-through" style={{ color: "var(--color-text-muted)" }}>
          ₱{originalPrice.toFixed(2)}
        </span>
      )}
      {saved && (
        <span
          className="text-sm font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: "color-mix(in srgb, var(--color-danger) 15%, transparent)",
            color: "var(--color-danger)",
          }}
        >
          -{saved}%
        </span>
      )}
    </div>
  );
}

function ProductShipping({ fee, daysMin, daysMax, from }) {
  if (fee === null || fee === undefined) return null;
  return (
    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
      <Truck size={14} strokeWidth={1.75} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
      <span>
        ₱{fee} shipping · {daysMin}–{daysMax} days
        {from && ` from ${from}`}
      </span>
    </div>
  );
}

function ProductSellerBadge({ wished, onWish }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <img
          src="/images/seller-image.png"
          alt="Seller"
          style={{
            width: 36, height: 36,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--color-primary)",
          }}
        />
        <span
          className="px-2 py-1 rounded-2xl text-xs font-semibold"
          style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}
        >
          Official Store
        </span>
      </div>

      <div style={{ borderRadius: "50%", border: wished ? "2px solid var(--color-border)" : "none" }}>
        <button
          onClick={onWish}
          className="flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
        >
          <Heart
            className="w-4 h-4 m-2 transition-all duration-200"
            style={{
              fill: wished ? "#ec4899" : "transparent",
              color: wished ? "#ec4899" : "var(--color-text-muted)",
              transform: wished ? "scale(1.25)" : "scale(1)",
            }}
          />
        </button>
      </div>
    </div>
  );
}

function AddToCartButton({ isSoldOut, added, onClick }) {
  return (
    <button
      disabled={isSoldOut || added}
      onClick={onClick}
      className="mt-2 py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
      style={{
        background: isSoldOut
          ? "var(--color-disabled)"
          : added
          ? "var(--color-success)"
          : "var(--color-primary)",
        color: "var(--hero-text)",
        borderRadius: "var(--radius)",
        cursor: isSoldOut ? "not-allowed" : "pointer",
        border: "none",
        boxShadow: isSoldOut || added
          ? "none"
          : "0 4px 14px color-mix(in srgb, var(--color-primary) 40%, transparent)",
      }}
    >
      {isSoldOut ? (
        <><ShoppingCart size={16} strokeWidth={1.75} /> Out of Stock</>
      ) : added ? (
        <><PackageCheck size={16} strokeWidth={1.75} /> Added to Cart!</>
      ) : (
        <><ShoppingCart size={16} strokeWidth={1.75} /> Add to Cart</>
      )}
    </button>
  );
}

/* ─── Skeletons ──────────────────────────────────────── */

function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="rounded-xl h-[400px]" style={{ background: "var(--color-surface)" }} />
      <div className="flex flex-col gap-4">
        <div className="h-4 rounded w-1/3" style={{ background: "var(--color-surface)" }} />
        <div className="h-8 rounded w-3/4" style={{ background: "var(--color-surface)" }} />
        <div className="h-4 rounded w-1/2" style={{ background: "var(--color-surface)" }} />
        <div className="h-10 rounded w-1/3" style={{ background: "var(--color-surface)" }} />
        <div className="h-4 rounded w-2/5" style={{ background: "var(--color-surface)" }} />
        <div className="h-24 rounded"      style={{ background: "var(--color-surface)" }} />
        <div className="h-12 rounded mt-2" style={{ background: "var(--color-surface)" }} />
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function ProductDetailPage() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [added, setAdded]     = useState(false);
  const [wished, setWished]   = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  useEffect(() => {
    if (product && slug !== slugify(product.name)) {
      navigate(`/product/${slugify(product.name)}/${product.id}`, { replace: true });
    }
  }, [product, slug, navigate]);

  if (loading) return <ProductDetailSkeleton />;
  if (error)   return <RetryComponent errorType="FETCH_ERROR" onRetry={fetchProduct} />;
  if (!product) return <RetryComponent errorType="NOT_FOUND"  onRetry={fetchProduct} />;

  const primaryImage = product.images?.find(img => img.is_primary)?.url ?? null;
  const hoverImage   = product.images?.find(img => img.is_hover)?.url  ?? null;
  const stock        = product.inventory?.stock ?? 0;
  const sold         = product.inventory?.sold  ?? 0;
  const isSoldOut    = stock === 0;

  const { final, saved } = computePrice(product.price, product.discount_percent);

  const handleAddToCart = () => {
    if (!product || isSoldOut) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      <ProductImage
        primaryImage={primaryImage}
        hoverImage={hoverImage}
        isSoldOut={isSoldOut}
        name={product.name}
      />

      <div className="flex flex-col gap-4">
        <ProductSellerBadge
          wished={wished}
          onWish={() => setWished(w => !w)}
        />

        <div style={{ height: "1px", background: "var(--color-border-muted)" }} />

        <ProductMeta
          brand={product.brand}
          name={product.name}
          sold={sold}
          stock={stock}
        />

        <ProductPrice
          final={final}
          originalPrice={product.price}
          saved={saved}
        />

        <ProductShipping
          fee={product.shipping_fee}
          daysMin={product.shipping_days_min}
          daysMax={product.shipping_days_max}
          from={product.shipping_from}
        />

        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {product.description}
        </p>

        {product.sku && (
          <p className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
            SKU: {product.sku}
          </p>
        )}

        <AddToCartButton
          isSoldOut={isSoldOut}
          added={added}
          onClick={handleAddToCart}
        />
      </div>

    </div>
  );
}