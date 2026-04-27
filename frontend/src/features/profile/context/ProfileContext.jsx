import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "../../auth"

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile]     = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [profileRes, addressRes] = await Promise.all([
        fetch("/api/users/me",           { credentials: "include" }),
        fetch("/api/users/me/addresses", { credentials: "include" }),
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

  // fetch on mount and whenever auth user changes
  useEffect(() => { fetchProfile() }, [fetchProfile, user])

  const updateProfile = async (data) => {
    const res = await fetch("/api/users/me", {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update profile")
    const updated = await res.json()
    setProfile(updated)
    return updated
  }

  const updateAvatar = async (avatar_id) => updateProfile({ avatar_id })

  const updatePassword = async (new_password) => {
    const res = await fetch("/api/users/me/password", {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? "Failed to update password")
    }
    return res.json()
  }

  const addAddress = async (data) => {
    const res = await fetch("/api/users/me/addresses", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to add address")
    const newAddr = await res.json()
    setAddresses(prev => {
      const updated = data.is_default ? prev.map(a => ({ ...a, is_default: false })) : [...prev]
      return [...updated, newAddr]
    })
    return newAddr
  }

  const updateAddress = async (id, data) => {
    const res = await fetch(`/api/users/me/addresses/${id}`, {
      method: "PATCH", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update address")
    const updated = await res.json()
    setAddresses(prev => prev.map(a => a.id === id
      ? updated
      : data.is_default ? { ...a, is_default: false } : a
    ))
    return updated
  }

  const deleteAddress = async (id) => {
    const res = await fetch(`/api/users/me/addresses/${id}`, {
      method: "DELETE", credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to delete address")
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  return (
    <ProfileContext.Provider value={{
      profile, addresses, loading, error,
      refetch: fetchProfile,
      updateProfile, updateAvatar, updatePassword,
      addAddress, updateAddress, deleteAddress,
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider")
  return ctx
}