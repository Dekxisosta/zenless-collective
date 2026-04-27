import { http, HttpResponse } from "msw"
import users from "../../json/users.json"
import orders from "../../json/orders.json"
import payments from "../../json/payments.json"
import user_images from "../../json/user_images.json"

const paginate = (arr, page, limit) => ({
  data:       arr.slice((page - 1) * limit, page * limit),
  totalPages: Math.ceil(arr.length / limit),
  total:      arr.length,
})

export const customerHandlers = [
  http.get("/api/admin/customers", ({ request }) => {
    const url    = new URL(request.url)
    const search = url.searchParams.get("search")
    const page   = parseInt(url.searchParams.get("page")  ?? "1")
    const limit  = parseInt(url.searchParams.get("limit") ?? "10")

    let result = users
      .filter(u => u.role === "user")
      .map(u => {
        const userImage = user_images.find(ui => ui.user_id === u.id)
        return {
          ...u,
          avatar_id:  userImage?.avatar_id ?? null,
          orderCount: orders.filter(o => o.user_id === u.id).length,
          totalSpent: payments
            .filter(p => {
              const order = orders.find(o => o.id === p.order_id)
              return order?.user_id === u.id && p.status === "completed"
            })
            .reduce((s, p) => s + p.amount, 0),
        }
      })

    if (search) result = result.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )

    const { data, totalPages, total } = paginate(result, page, limit)
    return HttpResponse.json({ customers: data, totalPages, total })
  }),
]