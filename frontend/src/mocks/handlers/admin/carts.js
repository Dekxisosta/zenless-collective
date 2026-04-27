import { http, HttpResponse } from "msw"
import cart from "../../json/cart.json"
import cart_items from "../../json/cart_items.json"
import products from "../../json/products.json"
import product_images from "../../json/product_images.json"

export const adminCartHandlers = [
  http.get("/api/admin/carts", ({ request }) => {
    const url     = new URL(request.url)
    const user_id = url.searchParams.get("user_id")

    const userCart = cart.find(c => c.user_id === user_id) ?? null
    if (!userCart) return HttpResponse.json({ cart: null })

    const items = cart_items
      .filter(ci => Number(ci.cart_id) === Number(userCart.id))
      .map(ci => {
        const product = products.find(p => Number(p.id) === Number(ci.product_id)) ?? null
        const images  = product_images.filter(img => img.product_id === ci.product_id)
        return { ...ci, product: product ? { ...product, images } : null }
      })

    return HttpResponse.json({ cart: { ...userCart, items } })
  }),
]