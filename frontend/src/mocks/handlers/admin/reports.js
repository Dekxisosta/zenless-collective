import { http, HttpResponse } from "msw"
import payments from "../../json/payments.json"
import orders from "../../json/orders.json"
import products from "../../json/products.json"
import product_inventory from "../../json/product_inventory.json"
import users from "../../json/users.json"

export const reportHandlers = [
  http.get("/api/admin/reports", () => {
    const completedPayments = payments.filter(p => p.status === "completed")

    const revenueByMonth = completedPayments.reduce((acc, p) => {
      const month = new Date(p.paid_at ?? p.created_at).toLocaleString("en-PH", { month: "short", year: "numeric" })
      acc[month] = (acc[month] ?? 0) + p.amount
      return acc
    }, {})

    const revenueByMethod = ["cod", "gcash", "card", "paypal"].map(method => ({
      method,
      count: completedPayments.filter(p => p.method === method).length,
      total: completedPayments.filter(p => p.method === method).reduce((s, p) => s + p.amount, 0),
    }))

    const topProducts = products
      .map(p => ({ ...p, inventory: product_inventory.find(i => i.product_id === p.id) }))
      .sort((a, b) => (b.inventory?.sold ?? 0) - (a.inventory?.sold ?? 0))
      .slice(0, 5)

    const ordersByStatus = ["pending", "paid", "shipped", "completed", "cancelled"].map(status => ({
      status,
      count: orders.filter(o => o.status === status).length,
    }))

    return HttpResponse.json({
      totalRevenue:   completedPayments.reduce((s, p) => s + p.amount, 0),
      totalOrders:    orders.length,
      totalCustomers: users.filter(u => u.role === "user").length,
      revenueByMonth,
      revenueByMethod,
      topProducts,
      ordersByStatus,
    })
  }),
]