import { useState } from "react";
import { useAuth } from "../../auth";
import { AvatarPicker, Section } from "../components";
import { ProfileSection, AddressSection, SecuritySection } from "../sections";
import { useProfile } from "../context";
import { RetryComponent } from "../../../shared";
import avatars from "../../../data/avatars.json";

export default function ProfilePage() {
  const { user }      = useAuth()
  const [pickerOpen, setPickerOpen] = useState(false)

  const {
    profile, addresses, loading, error, refetch,
    updateProfile, updateAvatar,
    updatePassword,
    addAddress, updateAddress, deleteAddress,
  } = useProfile()

  const avatarId      = profile?.avatar_id ?? 1
  const currentAvatar = avatars.find(a => a.id === avatarId)

  const handleSelectAvatar = async (id) => {
    try {
      await updateAvatar(id)
    } catch {}
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", padding: "2.5rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>Loading profile…</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: "100vh", padding: "2.5rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <RetryComponent errorType="FETCH_ERROR" onRetry={refetch} />
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentAvatar?.url}
              alt={currentAvatar?.label}
              className="object-cover"
              style={{ width: "72px", height: "72px", borderRadius: "50%", border: "3px solid var(--color-primary)" }}
            />
            <button
              onClick={() => setPickerOpen(true)}
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
              style={{ width: "22px", height: "22px", backgroundColor: "var(--color-primary)", color: "#fff", border: "2px solid var(--color-bg)", cursor: "pointer", fontSize: "0.65rem" }}
            >
              ✎
            </button>
          </div>
          <div>
            <h1 style={{ color: "var(--color-text)", fontWeight: 800, fontSize: "1.25rem" }}>
              {profile?.name ?? user?.name ?? "Guest"}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>
              {profile?.email ?? user?.email ?? "—"}
            </p>
          </div>
        </div>

        <Section title="Personal Information">
          <ProfileSection profile={profile} onUpdate={updateProfile} />
        </Section>

        <Section title="Saved Addresses">
          <AddressSection
            addresses={addresses}
            onAdd={addAddress}
            onUpdate={updateAddress}
            onDelete={deleteAddress}
          />
        </Section>

        <Section title="Security">
          <SecuritySection onUpdatePassword={updatePassword} />
        </Section>

      </div>

      {pickerOpen && (
        <AvatarPicker
          currentAvatarId={avatarId}
          onSelect={async (id) => {
            await handleSelectAvatar(id)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}