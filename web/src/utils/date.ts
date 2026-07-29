import { format, formatDistanceToNow } from "date-fns"

/**
 * Safely parses ISO date strings from backend API into a JS Date object.
 * If backend returns UTC ISO string without explicit 'Z' or timezone offset,
 * this function appends 'Z' to prevent parsing as local time.
 */
export function parseUtcDate(dateInput: string | Date | undefined | null): Date {
  if (!dateInput) return new Date()
  if (dateInput instanceof Date) return dateInput

  let str = String(dateInput).trim()
  if (!str) return new Date()

  // Normalize ISO format and ensure UTC indicator 'Z' if missing
  if (str.includes("T") && !str.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(str)) {
    str += "Z"
  } else if (!str.includes("T") && !str.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(str)) {
    str = str.replace(" ", "T") + "Z"
  }

  const parsed = new Date(str)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

export function formatDateAgo(dateInput: string | Date | undefined | null): string {
  const date = parseUtcDate(dateInput)
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatDate(
  dateInput: string | Date | undefined | null,
  formatPattern: string = "MMM d, yyyy"
): string {
  const date = parseUtcDate(dateInput)
  return format(date, formatPattern)
}
