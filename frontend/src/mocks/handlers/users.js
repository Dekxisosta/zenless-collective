import { http, HttpResponse } from "msw"

let mockUser = {
  id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  name: "Dekxisosta",
  email: "rroquxii@gmail.com",
  phone: "+63 912 345 6789",
  avatar_id: 1,
  role: "user",
}

const mockAddresses = [
  {
    id: 1,
    user_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    label: "Home",
    full_name: "Dekxisosta",
    phone: "+63 912 345 6789",
    address_line1: "123 Rizal Street",
    address_line2: "Brgy. Poblacion",
    city: "Cabuyao",
    province: "Laguna",
    zip_code: "4025",
    country: "Philippines",
    is_default: true,
  },
  {
    id: 2,
    user_id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    label: "Office",
    full_name: "Dekxisosta",
    phone: "+63 912 345 6789",
    address_line1: "456 EDSA Ave",
    address_line2: "Unit 3B",
    city: "Mandaluyong",
    province: "Metro Manila",
    zip_code: "1550",
    country: "Philippines",
    is_default: false,
  },
]

export const userHandlers = [

  // GET /api/users/me
  http.get("/api/users/me", () => {
    return HttpResponse.json(mockUser)
  }),

  // PATCH /api/users/me
  http.patch("/api/users/me", async ({ request }) => {
    const body = await request.json()
    mockUser = { ...mockUser, ...body }
    return HttpResponse.json(mockUser)
  }),

  // GET /api/users/me/addresses
  http.get("/api/users/me/addresses", () => {
    return HttpResponse.json(mockAddresses)
  }),

  // POST /api/users/me/addresses
  http.post("/api/users/me/addresses", async ({ request }) => {
    const body = await request.json()
    if (body.is_default) {
      mockAddresses.forEach(a => { a.is_default = false })
    }
    const newAddress = { id: mockAddresses.length + 1, ...body }
    mockAddresses.push(newAddress)
    return HttpResponse.json(newAddress, { status: 201 })
  }),

  // PATCH /api/users/me/addresses/:id
  http.patch("/api/users/me/addresses/:id", async ({ params, request }) => {
    const body = await request.json()
    const addr = mockAddresses.find(a => a.id === parseInt(params.id))
    if (!addr) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    if (body.is_default) {
      mockAddresses.forEach(a => { a.is_default = false })
    }
    Object.assign(addr, body)
    return HttpResponse.json(addr)
  }),

  // DELETE /api/users/me/addresses/:id
  http.delete("/api/users/me/addresses/:id", ({ params }) => {
    const idx = mockAddresses.findIndex(a => a.id === parseInt(params.id))
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    mockAddresses.splice(idx, 1)
    return HttpResponse.json({ message: "Deleted" })
  }),

  // PATCH /api/users/me/password
  http.patch("/api/users/me/password", async ({ request }) => {
    const { new_password } = await request.json()
    if (!new_password || new_password.length < 8) {
      return HttpResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 })
    }
    return HttpResponse.json({ message: "Password updated." })
  }),
]