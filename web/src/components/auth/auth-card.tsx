import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-full max-w-[456px] lg:max-w-[480px] rounded-3xl border border-slate-300/80 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 p-5 sm:p-8 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 backdrop-blur-2xl transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="space-y-2 text-left mb-6 sm:mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed"
        >
          {description}
        </motion.p>
      </div>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-5"
      >
        {children}
      </motion.div>

      {/* Footer Links */}
      {footer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800"
        >
          {footer}
        </motion.div>
      )}
    </motion.div>
  )
}
