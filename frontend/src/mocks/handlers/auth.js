import { http, HttpResponse } from "msw"
import { setSessionUser, clearSession, getSessionUserId } from "./session"
import users from "../json/users.json"
import { mockUsers } from "../handlers/users"


export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json()
    const newUser = { ...body, id: crypto.randomUUID(), role: "user", avatar_id: 1 }
    users.push(newUser)
    mockUsers[newUser.id] = newUser  // 👈 add to the lookup map
    setSessionUser(newUser.id)
    return HttpResponse.json({ user: newUser })
  }),
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json()
    const user = users.find(u => u.email === email)
    if (!user) return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 })
    setSessionUser(user.id)
    return HttpResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json()
    const newUser = { ...body, id: crypto.randomUUID(), role: "user" }
    users.push(newUser)
    setSessionUser(newUser.id)
    return HttpResponse.json({ user: newUser })
  }),

  http.get("/api/auth/me", () => {
    const userId = getSessionUserId()
    if (!userId) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    const user = users.find(u => u.id === userId)
    if (!user) return HttpResponse.json({ message: "User not found" }, { status: 404 })
    return HttpResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  }),

  http.post("/api/auth/logout", () => {
    clearSession()
    return HttpResponse.json({ message: "Logged out" })
  }),
]