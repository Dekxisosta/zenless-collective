import { http, HttpResponse } from "msw"
import { getSessionUserId } from "./session"

const mockUsers = {
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Dekxisosta",
    email: "admin@zenlesscollective.ph",
    phone: "+63 912 345 6789",
    avatar_id: 4,
    role: "admin",
  },
}

const mockAddressesByUser = {
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": [
    {
      id: 1,
      user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
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
      user_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
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
  ],
}

export { mockUsers }

function getSessionUser() {
  const id = getSessionUserId()
  if (!id || !mockUsers[id]) return null
  return mockUsers[id]
}

export const userHandlers = [

  // GET /api/users/me
  http.get("/api/users/me", () => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    return HttpResponse.json(user)
  }),

  // PATCH /api/users/me
  http.patch("/api/users/me", async ({ request }) => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    Object.assign(user, body)
    return HttpResponse.json(user)
  }),

  // GET /api/users/me/addresses
  http.get("/api/users/me/addresses", () => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    return HttpResponse.json(mockAddressesByUser[user.id] ?? [])
  }),

  // POST /api/users/me/addresses
  http.post("/api/users/me/addresses", async ({ request }) => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    const body = await request.json()
    const addresses = mockAddressesByUser[user.id] ?? []
    if (body.is_default) addresses.forEach(a => { a.is_default = false })
    const newAddress = { id: addresses.length + 1, user_id: user.id, ...body }
    addresses.push(newAddress)
    mockAddressesByUser[user.id] = addresses
    return HttpResponse.json(newAddress, { status: 201 })
  }),

  // PATCH /api/users/me/addresses/:id
  http.patch("/api/users/me/addresses/:id", async ({ params, request }) => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    const addresses = mockAddressesByUser[user.id] ?? []
    const addr = addresses.find(a => a.id === parseInt(params.id))
    if (!addr) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    const body = await request.json()
    if (body.is_default) addresses.forEach(a => { a.is_default = false })
    Object.assign(addr, body)
    return HttpResponse.json(addr)
  }),

  // DELETE /api/users/me/addresses/:id
  http.delete("/api/users/me/addresses/:id", ({ params }) => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    const addresses = mockAddressesByUser[user.id] ?? []
    const idx = addresses.findIndex(a => a.id === parseInt(params.id))
    if (idx === -1) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    addresses.splice(idx, 1)
    return HttpResponse.json({ message: "Deleted" })
  }),

  // PATCH /api/users/me/password
  http.patch("/api/users/me/password", async ({ request }) => {
    const user = getSessionUser()
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    const { new_password } = await request.json()
    if (!new_password || new_password.length < 8) {
      return HttpResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 })
    }
    return HttpResponse.json({ message: "Password updated." })
  }),
]