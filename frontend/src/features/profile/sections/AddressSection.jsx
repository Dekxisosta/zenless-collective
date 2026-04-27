// features/profile/sections/AddressSection.jsx
import { useState } from "react"
import { Field, SaveButton, selectStyle } from "../components/ProfileUI"

const EMPTY_FORM = {
  label: "Home", full_name: "", phone: "",
  address_line1: "", address_line2: "",
  city: "", province: "", zip_code: "",
  country: "Philippines", is_default: false,
}

export default function AddressSection({ addresses, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm]     = useState(false)
  const [status, setStatus]         = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [confirming, setConfirming] = useState(null)
  const [localAddresses, setLocalAddresses] = useState(addresses)

  // sync when parent addresses change
  useState(() => { setLocalAddresses(addresses) }, [addresses])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async () => {
    setStatus("saving")
    try {
      const newAddr = await onAdd(form)

      // if new address is default, unset all others locally
      setLocalAddresses(prev => {
        const updated = form.is_default
          ? prev.map(a => ({ ...a, is_default: false }))
          : [...prev]
        return [...updated, newAddr]
      })

      setShowForm(false)
      setForm(EMPTY_FORM)
      setStatus(null)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus(null), 2500)
    }
  }

  const handleSetDefault = async (addr) => {
    try {
      await onUpdate(addr.id, { ...addr, is_default: true })
      setLocalAddresses(prev =>
        prev.map(a => ({ ...a, is_default: a.id === addr.id }))
      )
    } catch {}
  }

  const handleDelete = async (id) => {
    try {
      await onDelete(id)
      setLocalAddresses(prev => prev.filter(a => a.id !== id))
      setConfirming(null)
    } catch {}
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {localAddresses.length === 0 && !showForm && (
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
          No saved addresses yet.
        </p>
      )}

      {localAddresses.map((addr) => (
        <div
          key={addr.id}
          style={{
            padding: "0.875rem 1rem",
            borderRadius: "var(--radius)",
            border: addr.is_default
              ? "1px solid var(--color-primary)"
              : "1px solid var(--color-border)",
            backgroundColor: "var(--color-bg)",
            transition: "border-color 0.2s",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>

              {/* label + default badge */}
              <div className="flex items-center gap-2">
                <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "0.8rem" }}>
                  {addr.label}
                </p>
                {addr.is_default && (
                  <span style={{
                    fontSize: "0.62rem", fontWeight: 700,
                    padding: "0.1rem 0.5rem",
                    borderRadius: "999px",
                    backgroundColor: "var(--color-primary)",
                    color: "#fff",
                  }}>
                    Default
                  </span>
                )}
              </div>

              <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", lineHeight: 1.7 }}>
                {addr.full_name} · {addr.phone}<br />
                {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}<br />
                {addr.city}, {addr.province} {addr.zip_code} · {addr.country}
              </p>
            </div>

            {/* actions */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr)}
                  style={ghostBtn}
                >
                  Set Default
                </button>
              )}
              {confirming === addr.id ? (
                <div className="flex gap-1">
                  <button onClick={() => handleDelete(addr.id)} style={dangerBtn}>Confirm</button>
                  <button onClick={() => setConfirming(null)} style={ghostBtn}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirming(addr.id)} style={dangerBtn}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div style={{
          padding: "1rem",
          borderRadius: "var(--radius)",
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-bg)",
          display: "flex", flexDirection: "column", gap: "0.875rem"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <label style={{ color: "var(--color-text-muted)", fontSize: "0.72rem", fontWeight: 600 }}>Label</label>
              <select name="label" value={form.label} onChange={handleChange} style={selectStyle}>
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
            </div>
            <Field label="Full Name"      name="full_name"     value={form.full_name}     onChange={handleChange} />
            <Field label="Phone"          name="phone"         value={form.phone}         onChange={handleChange} type="tel" />
            <Field label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} />
            <Field label="Address Line 2 (optional)" name="address_line2" value={form.address_line2} onChange={handleChange} />
            <Field label="City"           name="city"          value={form.city}          onChange={handleChange} />
            <Field label="Province"       name="province"      value={form.province}      onChange={handleChange} />
            <Field label="ZIP Code"       name="zip_code"      value={form.zip_code}      onChange={handleChange} />
          </div>

          {/* is_default warning */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
                id="is_default"
              />
              <label htmlFor="is_default" style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>
                Set as default address
              </label>
            </div>
            {form.is_default && localAddresses.some(a => a.is_default) && (
              <p style={{ color: "#f59e0b", fontSize: "0.75rem", paddingLeft: "1.4rem" }}>
                ⚠ This will replace your current default address.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <SaveButton status={status} onClick={handleSubmit} />
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }} style={ghostBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} style={ghostBtn}>
          + Add Address
        </button>
      )}
    </div>
  )
}

const dangerBtn = {
  padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 600,
  backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
  color: "#ef4444", borderRadius: "var(--radius)", cursor: "pointer",
}

const ghostBtn = {
  padding: "0.4rem 1rem", fontSize: "0.8rem", background: "none",
  border: "1px solid var(--color-border)", color: "var(--color-text-muted)",
  borderRadius: "var(--radius)", cursor: "pointer",
}