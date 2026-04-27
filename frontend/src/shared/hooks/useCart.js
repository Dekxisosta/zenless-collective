import { useEffect, useState } from "react";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);

      const data = await res.json();
      setCart(data.items ?? []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = async (newCart) => {
    setCart(newCart); // optimistic update
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCart),
      });

      if (!res.ok) throw new Error("Failed to sync cart");
    } catch (err) {
      console.error(err);
      setError(err.message);
      fetchCart();
    }
  };

  return { cart, loading, error, updateCart, refetch: fetchCart };
}