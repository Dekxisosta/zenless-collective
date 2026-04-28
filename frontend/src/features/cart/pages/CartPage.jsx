import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useProfile } from "../../profile";
import { Featured, Pill, useCart } from "../../../shared";

// ── Helpers (mirrored from Card) ──────────────────────────────────────────────
const formatSold = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

const computePrice = (basePrice, discount) => {
  if (!discount) return { final: basePrice, saved: null };
  return {
    final: Math.round(basePrice * (1 - discount / 100) * 100) / 100,
    saved: discount,
  };
};

const getStockStatus = (stock) => {
  if (stock === 0)  return { label: "Sold out",       color: "var(--color-text-subtle)" };
  if (stock <= 5)   return { label: `Last ${stock}!`, color: "var(--color-danger)" };
  if (stock <= 20)  return { label: "Low stock",      color: "var(--color-warning)" };
  return null;
};

// ── Cart Item Row ─────────────────────────────────────────────────────────────
function CartItem({ item, onChangeQty, onRemove }) {
  const [wished, setWished] = useState(false);
  const { product } = item;

  const primaryImage = product.images?.find((img) => img.is_primary)?.url ?? product.images?.[0]?.url ?? "https://placehold.co/80";
  const hoverImage   = product.images?.find((img) => img.is_hover)?.url ?? null;
  const stock        = product.inventory?.stock ?? 0;
  const sold         = product.inventory?.sold ?? 0;
  const stockStatus  = getStockStatus(stock);
  const { final, saved } = computePrice(product.price, product.discount_percent);
  const resolvedPill = product.pill ?? null;
  

  return (
    <div
      className="flex gap-4 rounded-2xl overflow-hidden transition"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* ── Image ── */}
      <div
        className="relative flex-shrink-0 overflow-hidden group"
        style={{ width: "120px", minHeight: "120px", background: "var(--color-bg-muted)" }}
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }}
        />

        {/* Pill — top left */}
        {resolvedPill && (
          <div className="absolute top-2 left-0 z-20">
            <Pill {...resolvedPill} />
          </div>
        )}

        {/* Stock status — bottom of image */}
        {stockStatus && stock > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 z-20 flex items-center px-2 py-1"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
          >
            <span
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide"
              style={{
                color: "var(--hero-text)",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "5px",
                padding: "2px 6px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: stockStatus.color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {stockStatus.label}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 min-w-0 p-3 flex flex-col gap-2">

        {/* Seller + category + wishlist */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <img
              src="/images/seller-image.png"
              alt="Seller"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--color-primary)",
              }}
            />
            <span
              className="px-2 py-0.5 rounded-2xl text-xs font-semibold"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-text-muted)",
              }}
            >
              Official Store
            </span>
          </div>

          <div className="flex items-center gap-2">
            {product.category?.name && (
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--color-primary)" }}
              >
                {product.category.name}
              </span>
            )}
            {/* Wishlist heart */}
            <button
              onClick={() => setWished((w) => !w)}
              className="flex items-center justify-center transition-all duration-200 active:scale-90"
              style={{
                background: "none",
                border: wished ? "2px solid var(--color-border)" : "none",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              <Heart
                className="w-4 h-4 transition-all duration-200"
                style={{
                  fill: wished ? "#ec4899" : "transparent",
                  color: wished ? "#ec4899" : "var(--color-text-muted)",
                  transform: wished ? "scale(1.25)" : "scale(1)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Product name */}
        <h2
          className="font-semibold text-sm leading-snug truncate"
          style={{ color: "var(--color-text)" }}
        >
          {product.name}
        </h2>

        {/* Description */}
        {product.description && (
          <p
            className="text-xs leading-relaxed line-clamp-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            {product.description}
          </p>
        )}

        {/* Price + qty + remove */}
        <div
          className="flex items-center justify-between pt-2 mt-auto"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {/* Price */}
          <div className="flex flex-col leading-none gap-0.5">
            <span className="text-base font-bold" style={{ color: "var(--color-danger)" }}>
              ₱{(final * item.quantity).toFixed(2)}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              ₱{final.toFixed(2)} each
              {saved && (
                <span className="ml-1 line-through">₱{product.price.toFixed(2)}</span>
              )}
            </span>
          </div>

          {/* Qty stepper + remove */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeQty(item.id, -1)}
                className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition hover:brightness-90"
                style={{ background: "var(--color-border)", color: "var(--color-text)" }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span
                className="text-xs font-semibold w-4 text-center"
                style={{ color: "var(--color-text)" }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onChangeQty(item.id, 1)}
                className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition hover:brightness-90"
                style={{ background: "var(--color-border)", color: "var(--color-text)" }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-xs transition hover:opacity-70"
              style={{ color: "var(--color-text-muted)" }}
              aria-label={`Remove ${product.name}`}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Sold count */}
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {formatSold(sold)} sold
        </span>

      </div>
    </div>
  );
}

// ── CartPage ──────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { cart, loading, removeItem, changeQty, subtotal } = useCart();
  const navigate = useNavigate();
  const isAdmin = profile?.role === "admin";

  

  useEffect(() => {
    if (!profileLoading && !profile) navigate("/login");
    if (!profileLoading && isAdmin) navigate("/");
  }, [profileLoading, profile, isAdmin, navigate]);

  if (loading || profileLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      <div
        className="flex flex-col"
        style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">

          {/* ── Header ── */}
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
            Your Cart
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
            {cart.length === 0
              ? "No items yet."
              : `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`}
          </p>

          {/* ── Empty State ── */}
          {cart.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-2xl p-16 text-center"
              style={{ border: "1px dashed var(--color-border)", color: "var(--color-text-muted)" }}
            >
              <span className="text-5xl">🛒</span>
              <p className="text-sm">Your cart is empty. Start adding some products!</p>
              <button
                onClick={() => navigate("/products")}
                className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold transition hover:brightness-110"
                style={{ background: "var(--color-primary)", color: "white" }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* ── Items ── */}
              <div className="flex-1 flex flex-col gap-3">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onChangeQty={changeQty}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* ── Order Summary ── */}
              <div
                className="w-full lg:w-80 flex-shrink-0 rounded-2xl p-6 flex flex-col gap-4 lg:sticky lg:top-24"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h2 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                  Order Summary
                </h2>

                <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span style={{ color: "var(--color-text)" }}>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span style={{ color: "var(--color-text)" }}>
                      {shipping === 0 ? "Free" : `₱${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div
                  className="flex justify-between font-bold text-sm pt-3"
                  style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text)" }}
                >
                  <span>Total</span>
                  <span style={{ color: "var(--color-primary)" }}>₱{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3 rounded-xl text-sm font-bold transition hover:brightness-110 active:scale-95"
                  style={{ background: "var(--color-primary)", color: "white" }}
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-2 rounded-xl text-xs font-medium transition hover:opacity-80"
                  style={{
                    background: "none",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                  }}
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      <Featured />
    </>
  );
}