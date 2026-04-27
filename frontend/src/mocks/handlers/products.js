import { http, HttpResponse } from "msw"
import products from "../json/products.json"
import product_images from "../json/product_images.json"
import product_inventory from "../json/product_inventory.json"
import pills from "../json/pills.json"
import categories from "../json/categories.json"

const hydrate = (p) => ({
  ...p,
  pill: pills.find(pl => pl.id === p.pill_id) ?? null,
  images: product_images.filter(img => img.product_id === p.id),
  inventory: product_inventory.find(inv => inv.product_id === p.id),
})

const getEffectivePrice = (p) => {
  if (!p.discount_percent) return p.price
  return Math.round(p.price * (1 - p.discount_percent / 100) * 100) / 100
}

const applySort = (result, sort) => {
  switch (sort) {
    case "newest":     return [...result].sort((a, b) => b.id - a.id)
    case "price_low":  return [...result].sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))
    case "price_high": return [...result].sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a))
    case "sold":       return [...result].sort((a, b) => (b.inventory?.sold ?? 0) - (a.inventory?.sold ?? 0))
    default:           return result
  }
}

export const productHandlers = [
  // GET /api/products
  http.get("/api/products", ({ request }) => {
    const url      = new URL(request.url)
    const category = url.searchParams.get("category")
    const pill     = url.searchParams.get("pill")
    const search   = url.searchParams.get("search")
    const sort     = url.searchParams.get("sort")
    const page     = parseInt(url.searchParams.get("page")  ?? "1")
    const limit    = parseInt(url.searchParams.get("limit") ?? "100")

    let result = products.map(hydrate)

    if (category && category !== "all") {
      const matched = categories.find(c => c.slug === category)
      if (matched) result = result.filter(p => p.category_id === matched.id)
    }
    if (pill)   result = result.filter(p => p.pill?.label === pill)
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort)   result = applySort(result, sort)

    const totalPages = Math.ceil(result.length / limit)
    const paginated  = result.slice((page - 1) * limit, page * limit)

    return HttpResponse.json({ products: paginated, totalPages, total: result.length })
  }),

  http.get("/api/products/featured", () => {
    const result = products
      .filter(p => p.pill_id !== null)
      .map(hydrate)
      .filter(p => (p.inventory?.stock ?? 0) > 0)

    return HttpResponse.json(result)
  }),

  // GET /api/products/:id
  http.get("/api/products/:id", ({ params }) => {
    const product = products.find(p => p.id === parseInt(params.id))
    if (!product) return HttpResponse.json({ message: "Not found" }, { status: 404 })

    return HttpResponse.json(hydrate(product))
  }),
]