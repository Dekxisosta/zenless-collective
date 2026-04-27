import { http, HttpResponse } from "msw"
import payments from "../../json/payments.json"
import orders from "../../json/orders.json"
import users from "../../json/users.json"

const paginate = (arr, page, limit) => ({
  data:       arr.slice((page - 1) * limit, page * limit),
  totalPages: Math.ceil(arr.length / limit),
  total:      arr.length,
})

export const paymentHandlers = [
  http.get("/api/admin/payments", ({ request }) => {
    const url    = new URL(request.url)
    const status = url.searchParams.get("status")
    const method = url.searchParams.get("method")
    const page   = parseInt(url.searchParams.get("page")  ?? "1")
    const limit  = parseInt(url.searchParams.get("limit") ?? "10")

    let result = payments.map(p => {
      const order    = orders.find(o => o.id === p.order_id) ?? null
      const customer = order ? (users.find(u => u.id === order.user_id) ?? null) : null
      return {
        ...p,
        order,
        customerName:  customer?.name  ?? null,
        customerEmail: customer?.email ?? null,
      }
    })

    if (status) result = result.filter(p => p.status === status)
    if (method) result = result.filter(p => p.method === method)
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    const { data, totalPages, total } = paginate(result, page, limit)
    return HttpResponse.json({ payments: data, totalPages, total })
  }),
]