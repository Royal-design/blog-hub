export function getInitials(
  name?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  username?: string | null
): string {
  if (firstName || lastName) {
    const first = firstName?.trim()[0] || ""
    const last = lastName?.trim()[0] || ""
    const initials = (first + last).toUpperCase()
    if (initials) return initials
  }

  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    if (parts[0].length >= 2) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }

  if (username?.trim()) {
    const clean = username.trim().replace(/^@/, "")
    if (clean.length >= 2) {
      return clean.substring(0, 2).toUpperCase()
    }
    return clean.substring(0, 1).toUpperCase()
  }

  return "BH"
}
