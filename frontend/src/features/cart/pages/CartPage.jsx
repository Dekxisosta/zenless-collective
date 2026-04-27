import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../profile";
import { useCart } from "../../../shared";

export default function CartPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { cart, loading } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileLoading && !profile) {
      navigate("/login");
    }
  }, [profileLoading, profile, navigate]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-6 text-center text-[var(--color-text-muted)]">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images?.[0]?.url || "https://placehold.co/60"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h2 className="font-medium">{item.product.name}</h2>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    ₱{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius)] p-5">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-[var(--color-primary)]">
                ₱{total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full py-3 rounded-[var(--radius)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition"
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}