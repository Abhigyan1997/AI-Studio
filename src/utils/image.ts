// Utility functions for image manipulation

export async function downscaleImageIfNeeded(
  file: File,
  maxDim = 1920,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const dataUrl = await readFileAsDataURL(file)
  const img = await loadImage(dataUrl)

  const { width, height } = img
  const maxSide = Math.max(width, height)
  if (maxSide <= maxDim) {
    return { dataUrl, width, height }
  }

  const scale = maxDim / maxSide
  const targetW = Math.round(width * scale)
  const targetH = Math.round(height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = targetW
  canvas.height = targetH

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")

  // High-quality scaling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(img, 0, 0, targetW, targetH)

  const out = canvas.toDataURL("image/jpeg", 0.92)
  return { dataUrl: out, width: targetW, height: targetH }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
