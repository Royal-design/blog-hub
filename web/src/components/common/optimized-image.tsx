import * as React from "react"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_THUMB_WIDTH,
  getLqipUrl,
  getOptimizedImageUrl,
  getResponsiveSrcSet,
} from "@/utils/image"

export interface OptimizedImageProps {
  src?: string | null
  alt?: string
  eager?: boolean
  sizes?: string
  width?: number | string
  height?: number | string
  className?: string
  imgClassName?: string
  fallback?: React.ReactNode
  title?: string
}

export function OptimizedImage({
  src,
  alt = "",
  eager = false,
  sizes,
  width,
  height,
  className,
  imgClassName,
  fallback,
  title,
}: OptimizedImageProps) {
  const [prevSrc, setPrevSrc] = React.useState(src)
  const [loaded, setLoaded] = React.useState(false)
  const [errored, setErrored] = React.useState(false)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setLoaded(false)
    setErrored(false)
  }

  const srcWidth = typeof width === "number" ? width : sizes ? DEFAULT_IMAGE_WIDTH : DEFAULT_THUMB_WIDTH
  const srcSet = sizes ? getResponsiveSrcSet(src) : undefined
  const blurUrl = getLqipUrl(src)

  if (!src || errored) {
    return (
      <div
        className={cn(
          "grid size-full place-items-center overflow-hidden bg-muted",
          className
        )}
      >
        {fallback ?? (
          <ImageOff
            className="size-5 text-muted-foreground/40"
            aria-hidden
          />
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("relative size-full overflow-hidden bg-muted", className)}
      style={
        blurUrl
          ? {
              backgroundImage: `url("${blurUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {!loaded && <div aria-hidden className="shimmer" />}

      <img
        src={getOptimizedImageUrl(src, srcWidth)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        title={title}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={cn(
          "size-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
    </div>
  )
}
