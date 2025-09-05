import type { GenerateRequest, Generation } from "../types"

export async function mockGenerate(
  body: GenerateRequest,
  opts?: { signal?: AbortSignal },
): Promise<Generation | { message: string }> {
  const signal = opts?.signal

  // Simulate network latency between 1000-2000ms
  const delay = 1000 + Math.floor(Math.random() * 1000)
  await wait(delay, signal)

  // 20% chance of "Model overloaded" response
  const overloaded = Math.random() < 0.2
  if (overloaded) {
    return { message: "Model overloaded" }
  }

  // Return a "generated" item (imageUrl reuses input for demo)
  const id = crypto.randomUUID?.() ?? String(Date.now())
  const createdAt = new Date().toISOString()
  return {
    id,
    imageUrl: body.imageDataUrl,
    prompt: body.prompt,
    style: body.style,
    createdAt,
  }
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)
    const onAbort = () => {
      cleanup()
      reject(new DOMException("Aborted", "AbortError"))
    }
    const cleanup = () => {
      clearTimeout(timer)
      signal?.removeEventListener("abort", onAbort)
    }
    if (signal) {
      if (signal.aborted) {
        cleanup()
        reject(new DOMException("Aborted", "AbortError"))
      } else {
        signal.addEventListener("abort", onAbort)
      }
    }
  })
}
