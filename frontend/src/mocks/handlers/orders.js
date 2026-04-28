import { http, HttpResponse } from "msw"
import orders from "../json/orders.json"
import order_items from "../json/order_items.json"
import payments from "../json/payments.json"

const getTotal = (order_id) =>
  order_items
    .filter(i => i.order_id === order_id)
    .reduce((sum, i) => sum + i.subtotal, 0)

export const orderHandlers = [

  // GET /api/orders
  http.get("/api/orders", () => {
    const result = orders.map(o => ({
      ...o,
      total: getTotal(o.id),
      items: order_items.filter(i => i.order_id === o.id),
      payment: payments.find(p => p.order_id === o.id) ?? null,
    }))
    return HttpResponse.json(result)
  }),

  // GET /api/orders/:id
  http.get("/api/orders/:id", ({ params }) => {
    const order = orders.find(o => o.id === parseInt(params.id))
    if (!order) return HttpResponse.json({ message: "Not found" }, { status: 404 })

    return HttpResponse.json({
      ...order,
      total: getTotal(order.id),
      items: order_items.filter(i => i.order_id === order.id),
      payment: payments.find(p => p.order_id === order.id) ?? null,
    })
  }),

  // POST /api/orders
  http.post("/api/orders", async ({ request }) => {
    const body = await request.json()
    const { items = [], ...orderData } = body

    const newOrder = {
      id: orders.length + 1,
      status: "pending",
      created_at: new Date().toISOString(),
      ...orderData,
    }
    orders.push(newOrder)

    // Insert items into order_items
    const newItems = items.map((item, i) => ({
      id: order_items.length + i + 1,
      order_id: newOrder.id,
      product_id:    item.product_id,
      product_name:  item.product_name,
      product_price: item.product_price,
      quantity:      item.quantity,
      subtotal:      item.subtotal,
      created_at:    newOrder.created_at,
    }))
    order_items.push(...newItems)

    return HttpResponse.json({
      ...newOrder,
      total: getTotal(newOrder.id),
      items: newItems,
      payment: null,
    }, { status: 201 })
  }),
  ]