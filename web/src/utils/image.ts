const CLOUDINARY_UPLOAD_RE = /res\.cloudinary\.com\/[^/]+\/image\/upload\//

export const RESPONSIVE_WIDTHS = [400, 600, 900, 1200, 1600] as const
export const DEFAULT_IMAGE_WIDTH = 900
export const DEFAULT_THUMB_WIDTH = 160
export const LQIP_WIDTH = 32

export function isCloudinaryUrl(url: string): boolean {
  return CLOUDINARY_UPLOAD_RE.test(url)
}

type CloudinaryOptions = {
  width?: number
  height?: number
  crop?: "fill" | "scale" | "pad" | "thumb"
  quality?: "auto" | number
  blur?: number
}

export function getCloudinaryTransformedUrl(
  url: string,
  options: CloudinaryOptions = {}
): string {
  if (!isCloudinaryUrl(url)) return url

  const marker = "/image/upload/"
  const markerIndex = url.indexOf(marker)
  if (markerIndex === -1) return url

  const params: string[] = []
  if (options.width) params.push(`w_${Math.round(options.width)}`)
  if (options.height) params.push(`h_${Math.round(options.height)}`)
  if (options.crop) params.push(`c_${options.crop}`)
  if (options.blur) params.push(`e_blur:${Math.round(options.blur)}`)
  params.push(
    options.quality === undefined || options.quality === "auto"
      ? "q_auto"
      : `q_${options.quality}`
  )
  params.push("f_auto")

  const insertAt = markerIndex + marker.length
  return `${url.slice(0, insertAt)}${params.join(",")}/${url.slice(insertAt)}`
}

export function getOptimizedImageUrl(
  url: string | null | undefined,
  width?: number
): string {
  if (!url) return ""
  return getCloudinaryTransformedUrl(url, {
    width: width ?? DEFAULT_IMAGE_WIDTH,
    crop: "fill",
  })
}

export function getLqipUrl(url: string | null | undefined): string {
  if (!url) return ""
  return getCloudinaryTransformedUrl(url, {
    width: LQIP_WIDTH,
    crop: "scale",
    quality: 20,
    blur: 400,
  })
}

export function getResponsiveSrcSet(url: string | null | undefined): string | undefined {
  if (!url || !isCloudinaryUrl(url)) return undefined
  return RESPONSIVE_WIDTHS.map(
    (width) =>
      `${getCloudinaryTransformedUrl(url, { width, crop: "fill" })} ${width}w`
  ).join(", ")
}
