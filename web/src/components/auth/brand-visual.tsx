import { motion } from "framer-motion"
import { BookOpen, Feather, Sparkles, Star, TrendingUp, Users } from "lucide-react"

interface BrandVisualProps {
  badgeText?: string
  headline?: string
  subheadline?: string
}

export function BrandVisual({
  badgeText = "Editorial & Creator Platform",
  headline = "Discover stories that inspire.",
  subheadline = "Create, publish, and manage your content with Blog Hub. Join thousands of writers sharing perspectives that shape the world.",
}: BrandVisualProps) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 lg:p-12 text-slate-900 dark:text-white selection:bg-primary selection:text-primary-foreground">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />

      {/* Radial ambient glow orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-20 -top-20 z-0 size-96 rounded-full bg-primary/35 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-20 -bottom-20 z-0 size-96 rounded-full bg-indigo-600/30 blur-3xl"
      />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:28px_28px]"
        style={{
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 60%, transparent 100%)",
        }}
      />

      {/* Top Bar Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <BookOpen className="size-5" aria-hidden />
        </div>
        <div>
          <div className="flex items-center gap-2 font-bold tracking-tight text-white text-xl">
            Blog Hub
          </div>
          <p className="text-xs text-slate-400 font-medium">Publishing & Community for Creators</p>
        </div>
      </div>

      {/* Center Editorial Showcase */}
      <div className="relative z-10 my-auto py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3.5 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-md border border-primary/30 shadow-inner"
        >
          <Sparkles className="size-3.5 text-primary-foreground" />
          {badgeText}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-tight text-white leading-tight lg:text-4xl drop-shadow-sm"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-slate-300 leading-relaxed max-w-lg"
        >
          {subheadline}
        </motion.p>

        {/* Editorial Feature Quote Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary-foreground border border-primary/30">
              <Feather className="size-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs italic text-slate-200 leading-relaxed">
                &ldquo;Blog Hub gave our editorial team the clarity and audience reach we needed to build a thriving publication.&rdquo;
              </p>
              <p className="text-[11px] font-semibold text-slate-400">
                — Elena Rostova, Founder of Modern Digest
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">2.5M+</div>
                <div className="text-[10px] text-slate-400">Monthly Readers</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <div>
                <div className="font-bold text-white">50k+</div>
                <div className="text-[10px] text-slate-400">Active Writers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust & Footer Note */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img
              className="size-7 rounded-full border-2 border-slate-900 object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Author avatar"
            />
            <img
              className="size-7 rounded-full border-2 border-slate-900 object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Author avatar"
            />
            <img
              className="size-7 rounded-full border-2 border-slate-900 object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="Author avatar"
            />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-slate-400 text-[11px] font-medium">Empowering creators worldwide</p>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">Blog Hub &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}
