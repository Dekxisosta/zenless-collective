import { useEffect, useState } from "react";
import { useCart } from "../../../shared";
import { useProfile } from "../../profile";

const PAYMENT_METHODS = ["gcash", "card", "cod", "paypal"];

export function useCheckout() {
  const { cart, subtotal, clearCart } = useCart();
  const { profile, addresses } = useProfile();

  const [form, setForm] = useState({
    shipping_name:    "",
    shipping_phone:   "",
    shipping_address: "",
    payment_method:   "gcash",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);
  const [order,      setOrder]      = useState(null);
  const [payment,    setPayment]    = useState(null);

  // ── Pre-populate from profile once it loads ────────────────────────────────
  useEffect(() => {
    if (!profile) return;

    // Pick the default address if one exists, otherwise first in list
    const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];

    setForm((prev) => ({
      ...prev,
      shipping_name:    profile.full_name    ?? profile.name ?? "",
      shipping_phone:   profile.phone        ?? "",
      shipping_address: defaultAddress?.address ?? "",
    }));
  }, [profile, addresses]);

  const shipping = 0;
  const total    = subtotal + shipping;

  // ── Field update ───────────────────────────────────────────────────────────
  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    if (!form.shipping_name.trim())    return "Full name is required.";
    if (!form.shipping_phone.trim())   return "Phone number is required.";
    if (!form.shipping_address.trim()) return "Shipping address is required.";
    if (!PAYMENT_METHODS.includes(form.payment_method))
      return "Invalid payment method.";
    if (cart.length === 0)             return "Your cart is empty.";
    return null;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return { success: false };
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method:   form.payment_method,
          status:           "pending",
          shipping_name:    form.shipping_name,
          shipping_phone:   form.shipping_phone,
          shipping_address: form.shipping_address,
          items: cart.map((i) => ({
            product_id:    i.product_id,
            product_name:  i.product.name,
            product_price: i.product.price,
            quantity:      i.quantity,
            subtotal:      i.product.price * i.quantity,
          })),
        }),
      });

      if (!orderRes.ok) throw new Error(`Failed to create order: ${orderRes.status}`);
      const newOrder = await orderRes.json();
      setOrder(newOrder);

      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: newOrder.id,
          amount:   newOrder.total,
          method:   form.payment_method,
        }),
      });

      if (!paymentRes.ok) throw new Error(`Failed to create payment: ${paymentRes.status}`);
      const newPayment = await paymentRes.json();
      setPayment(newPayment);

      // 3. Clear cart
      await clearCart();

      return { success: true, order: newOrder, payment: newPayment };
    } catch (err) {
      console.error(err);
      setError(err.message);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    setField,
    submitting,
    error,
    order,
    payment,
    subtotal,
    shipping,
    total,
    cart,
    placeOrder,
    PAYMENT_METHODS,
  };
}