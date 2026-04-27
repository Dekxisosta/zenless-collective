import { http, HttpResponse } from "msw"
import { setSessionUser, clearSession } from "./session"
import users from "../json/users.json"

export const authHandlers = [

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
    setSessionUser(newUser.id)
    return HttpResponse.json({ user: newUser })
  }),

  http.get("/api/auth/me", () => {
    const userId = getSessionUserId()
    if (!userId) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    return HttpResponse.json({ id: userId })
  }),

  http.post("/api/auth/logout", () => {
    clearSession()
    return HttpResponse.json({ message: "Logged out" })
  }),
]