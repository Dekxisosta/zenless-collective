import { http, HttpResponse } from "msw"
import products from "../../json/products.json"
import product_inventory from "../../json/product_inventory.json"
import product_images from "../../json/product_images.json"
import pills from "../../json/pills.json"

const hydrate = (p) => ({
  ...p,
  pill:      pills.find(pl => pl.id === p.pill_id) ?? null,
  images:    product_images.filter(img => img.product_id === p.id),
  inventory: product_inventory.find(inv => inv.product_id === p.id),
})

export const inventoryHandlers = [
  http.get("/api/admin/inventory", ({ request }) => {
    const url    = new URL(request.url)
    const search = url.searchParams.get("search")
    const low    = url.searchParams.get("low")

    let result = products.map(hydrate)

    if (search)        result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.includes(search))
    if (low === "true") result = result.filter(p => (p.inventory?.stock ?? 0) < 10)

    result.sort((a, b) => (a.inventory?.stock ?? 0) - (b.inventory?.stock ?? 0))
    return HttpResponse.json(result)
  }),

  http.patch("/api/admin/inventory/:productId", async ({ params, request }) => {
    const body = await request.json()
    const inv  = product_inventory.find(i => i.product_id === parseInt(params.productId))
    if (!inv) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    Object.assign(inv, body)
    return HttpResponse.json(inv)
  }),
]