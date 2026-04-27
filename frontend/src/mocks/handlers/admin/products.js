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

const paginate = (arr, page, limit) => ({
  data:       arr.slice((page - 1) * limit, page * limit),
  totalPages: Math.ceil(arr.length / limit),
  total:      arr.length,
})

export const adminProductHandlers = [
  http.get("/api/admin/products", ({ request }) => {
    const url      = new URL(request.url)
    const search   = url.searchParams.get("search")
    const category = url.searchParams.get("category")
    const page     = parseInt(url.searchParams.get("page")  ?? "1")
    const limit    = parseInt(url.searchParams.get("limit") ?? "10")

    let result = products.map(hydrate)

    if (search)   result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.includes(search))
    if (category) result = result.filter(p => p.category_id === parseInt(category))

    const { data, totalPages, total } = paginate(result, page, limit)
    return HttpResponse.json({ products: data, totalPages, total })
  }),

  http.post("/api/admin/products", async ({ request }) => {
    const body = await request.json()
    const newProduct = {
      id:                products.length + 1,
      created_at:        new Date().toISOString(),
      updated_at:        new Date().toISOString(),
      discount_percent:  null,
      pill_id:           null,
      size:              null,
      shipping_fee:      null,
      shipping_days_min: null,
      shipping_days_max: null,
      shipping_from:     null,
      ...body,
    }
    products.push(newProduct)
    return HttpResponse.json(hydrate(newProduct), { status: 201 })
  }),

  http.patch("/api/admin/products/:id", async ({ params, request }) => {
    const body    = await request.json()
    const product = products.find(p => p.id === parseInt(params.id))
    if (!product) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    Object.assign(product, { ...body, updated_at: new Date().toISOString() })
    return HttpResponse.json(hydrate(product))
  }),

  http.delete("/api/admin/products/:id", ({ params }) => {
    const idx = products.findIndex(p => p.id === parseInt(params.id))
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    products.splice(idx, 1)
    return HttpResponse.json({ message: "Deleted" })
  }),

  http.post("/api/admin/products/:id/images", async ({ params, request }) => {
    const body      = await request.json()
    const productId = parseInt(params.id)

    if (body.is_primary) {
      product_images
        .filter(img => img.product_id === productId)
        .forEach(img => { img.is_primary = false })
    }

    const newImage = {
      id:         product_images.length + 1,
      product_id: productId,
      is_primary: false,
      is_hover:   false,
      sort_order: product_images.filter(img => img.product_id === productId).length,
      created_at: new Date().toISOString(),
      ...body,
    }
    product_images.push(newImage)
    return HttpResponse.json(newImage, { status: 201 })
  }),

  http.patch("/api/admin/products/:id/images/:imageId", async ({ params, request }) => {
    const body      = await request.json()
    const productId = parseInt(params.id)
    const image     = product_images.find(img => img.id === parseInt(params.imageId))
    if (!image) return HttpResponse.json({ message: "Not found" }, { status: 404 })

    if (body.is_primary) {
      product_images
        .filter(img => img.product_id === productId)
        .forEach(img => { img.is_primary = false })
    }

    Object.assign(image, body)
    return HttpResponse.json(image)
  }),

  http.delete("/api/admin/products/:id/images/:imageId", ({ params }) => {
    const idx = product_images.findIndex(img => img.id === parseInt(params.imageId))
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    product_images.splice(idx, 1)
    return HttpResponse.json({ message: "Deleted" })
  }),
]