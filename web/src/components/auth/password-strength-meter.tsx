import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

interface PasswordStrengthMeterProps {
  password?: string
}

export function PasswordStrengthMeter({ password = "" }: PasswordStrengthMeterProps) {
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains a letter", valid: /[a-zA-Z]/.test(password) },
    { label: "Contains a number or symbol", valid: /[0-9!@#$%^&*()]/.test(password) },
  ]

  const calculateStrength = () => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    if (score <= 1) return 1 // Weak
    if (score <= 3) return 2 // Fair
    if (score <= 4) return 3 // Good
    return 4 // Strong
  }

  const strength = calculateStrength()

  const getLabel = () => {
    switch (strength) {
      case 1:
        return { text: "Weak", color: "text-rose-600 dark:text-rose-400 font-bold", bg: "bg-rose-600" }
      case 2:
        return { text: "Fair", color: "text-amber-600 dark:text-amber-400 font-bold", bg: "bg-amber-500" }
      case 3:
        return { text: "Good", color: "text-blue-600 dark:text-blue-400 font-bold", bg: "bg-blue-600" }
      case 4:
        return { text: "Strong", color: "text-emerald-600 dark:text-emerald-400 font-bold", bg: "bg-emerald-600" }
      default:
        return { text: "", color: "text-slate-500", bg: "bg-slate-300 dark:bg-slate-700" }
    }
  }

  const labelInfo = getLabel()

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="space-y-2.5 pt-1.5"
    >
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-700 dark:text-slate-200">Password Strength</span>
        <span className={labelInfo.color}>{labelInfo.text}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-2 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className="h-full rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden"
          >
            <motion.div
              className={`h-full ${step <= strength ? labelInfo.bg : "bg-transparent"}`}
              initial={{ width: 0 }}
              animate={{ width: step <= strength ? "100%" : "0%" }}
              transition={{ duration: 0.25 }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            {req.valid ? (
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[3]" />
            ) : (
              <X className="size-3.5 text-slate-400 dark:text-slate-500 shrink-0 stroke-[2]" />
            )}
            <span className={req.valid ? "text-slate-900 dark:text-slate-100 font-bold" : "text-slate-600 dark:text-slate-400 font-medium"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
