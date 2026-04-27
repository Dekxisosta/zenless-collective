// features/profile/hooks/useProfile.js
import { useState, useEffect, useCallback } from "react"

export function useProfile() {
  const [profile, setProfile]     = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  // ── FETCH ──────────────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [profileRes, addressRes] = await Promise.all([
        fetch("/api/users/me",            { credentials: "include" }),
        fetch("/api/users/me/addresses",  { credentials: "include" }),
      ])
      if (!profileRes.ok) throw new Error("Failed to fetch profile")
      setProfile(await profileRes.json())
      setAddresses(addressRes.ok ? await addressRes.json() : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  // ── PROFILE UPDATE ─────────────────────────────────────────────────────────
  const updateProfile = async (data) => {
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update profile")
    const updated = await res.json()
    setProfile(updated)
    return updated
  }

  // ── AVATAR UPDATE ──────────────────────────────────────────────────────────
  const updateAvatar = async (avatar_id) => {
    return updateProfile({ avatar_id })
  }

  // ── PASSWORD UPDATE ────────────────────────────────────────────────────────
  const updatePassword = async (current_password, new_password) => {
    const res = await fetch("/api/users/me/password", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password, new_password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? "Failed to update password")
    }
    return res.json()
  }

  // ── ADDRESS CRUD ───────────────────────────────────────────────────────────
  const addAddress = async (data) => {
    const res = await fetch("/api/users/me/addresses", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to add address")
    const newAddr = await res.json()
    setAddresses(prev => [...prev, newAddr])
    return newAddr
  }

  const updateAddress = async (id, data) => {
    const res = await fetch(`/api/users/me/addresses/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update address")
    const updated = await res.json()
    setAddresses(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }

  const deleteAddress = async (id) => {
    const res = await fetch(`/api/users/me/addresses/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to delete address")
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  return {
    profile, addresses, loading, error,
    refetch: fetchProfile,
    updateProfile,
    updateAvatar,
    updatePassword,
    addAddress,
    updateAddress,
    deleteAddress,
  }
}