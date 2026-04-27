import { http, HttpResponse } from "msw"
import orders from "../../json/orders.json"
import order_items from "../../json/order_items.json"
import payments from "../../json/payments.json"
import users from "../../json/users.json"

const paginate = (arr, page, limit) => ({
  data:       arr.slice((page - 1) * limit, page * limit),
  totalPages: Math.ceil(arr.length / limit),
  total:      arr.length,
})

export const orderHandlers = [
  http.get("/api/admin/orders", ({ request }) => {
    const url    = new URL(request.url)
    const status = url.searchParams.get("status")
    const search = url.searchParams.get("search")
    const page   = parseInt(url.searchParams.get("page")  ?? "1")
    const limit  = parseInt(url.searchParams.get("limit") ?? "10")

    let result = orders.map(o => ({
      ...o,
      items:   order_items.filter(i => i.order_id === o.id),
      payment: payments.find(p => p.order_id === o.id) ?? null,
    }))

    if (status) result = result.filter(o => o.status === status)
    if (search) result = result.filter(o =>
      o.shipping_name.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search)
    )

    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const { data, totalPages, total } = paginate(result, page, limit)
    return HttpResponse.json({ orders: data, totalPages, total })
  }),

  http.patch("/api/admin/orders/:id", async ({ params, request }) => {
    const body  = await request.json()
    const order = orders.find(o => o.id === parseInt(params.id))
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    Object.assign(order, body)
    return HttpResponse.json(order)
  }),

  http.get("/api/admin/order-history", ({ request }) => {
    const url     = new URL(request.url)
    const user_id = url.searchParams.get("user_id")
    const page    = parseInt(url.searchParams.get("page")  ?? "1")
    const limit   = parseInt(url.searchParams.get("limit") ?? "10")

    let result = orders.map(o => ({
      ...o,
      items:    order_items.filter(i => i.order_id === o.id),
      payment:  payments.find(p => p.order_id === o.id) ?? null,
      customer: users.find(u => u.id === o.user_id) ?? null,
    }))

    if (user_id) result = result.filter(o => o.user_id === user_id)
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const { data, totalPages, total } = paginate(result, page, limit)
    return HttpResponse.json({ orders: data, totalPages, total })
  }),
]