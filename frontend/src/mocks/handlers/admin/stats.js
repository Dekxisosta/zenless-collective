import { http, HttpResponse } from "msw"
import orders from "../../json/orders.json"
import order_items from "../../json/order_items.json"
import payments from "../../json/payments.json"
import products from "../../json/products.json"
import product_inventory from "../../json/product_inventory.json"
import users from "../../json/users.json"

export const statsHandlers = [
  http.get("/api/admin/stats", () => {
    const totalRevenue   = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0)
    const totalOrders    = orders.length
    const totalCustomers = users.filter(u => u.role === "user").length
    const pendingOrders  = orders.filter(o => o.status === "pending").length

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map(o => ({
        ...o,
        items:   order_items.filter(i => i.order_id === o.id),
        payment: payments.find(p => p.order_id === o.id) ?? null,
      }))

    const topProducts = products
      .map(p => ({ ...p, inventory: product_inventory.find(i => i.product_id === p.id) }))
      .sort((a, b) => (b.inventory?.sold ?? 0) - (a.inventory?.sold ?? 0))
      .slice(0, 5)

    const paymentBreakdown = ["completed", "pending", "failed", "refunded"].map(status => ({
      status,
      count: payments.filter(p => p.status === status).length,
      total: payments.filter(p => p.status === status).reduce((s, p) => s + p.amount, 0),
    }))

    return HttpResponse.json({ totalRevenue, totalOrders, totalCustomers, pendingOrders, recentOrders, topProducts, paymentBreakdown })
  }),
]