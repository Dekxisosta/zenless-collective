// features/profile/sections/SecuritySection.jsx
import { useState } from "react"
import { Field, SaveButton } from "../components/ProfileUI"

export default function SecuritySection({ onUpdatePassword }) {
  const [form, setForm]     = useState({ new_password: "", confirm_password: "" })
  const [status, setStatus] = useState(null)
  const [error, setError]   = useState(null)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    setError(null)
    if (form.new_password !== form.confirm_password) return setError("Passwords do not match.")
    if (form.new_password.length < 8) return setError("Password must be at least 8 characters.")
    setStatus("saving")
    try {
      await onUpdatePassword(form.new_password)
      setStatus("saved")
      setForm({ new_password: "", confirm_password: "" })
      setTimeout(() => setStatus(null), 2500)
    } catch (err) {
      setError(err.message)
      setStatus(null)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
        <Field label="New Password"     name="new_password"     value={form.new_password}     onChange={handleChange} type="password" />
        <Field label="Confirm Password" name="confirm_password" value={form.confirm_password} onChange={handleChange} type="password" />
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>{error}</p>}
      <div className="flex items-center gap-3">
        <SaveButton status={status} onClick={handleSubmit} label="Update Password" />
        {status === "saved" && <span style={{ color: "#10b981", fontSize: "0.8rem" }}>✓ Password updated</span>}
      </div>
    </div>
  )
}