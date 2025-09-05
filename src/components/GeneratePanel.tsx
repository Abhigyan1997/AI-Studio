"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import type { Generation, StyleOption } from "../types"
import { mockGenerate } from "../lib/mockApi"
import { Spinner } from "./Spinner"

interface GeneratePanelProps {
  imageDataUrl?: string | null
  prompt: string
  style: StyleOption
  onGenerated: (gen: Generation) => void
}

export function GeneratePanel({ imageDataUrl, prompt, style, onGenerated }: GeneratePanelProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const canGenerate = useMemo(() => Boolean(imageDataUrl && prompt.trim()), [imageDataUrl, prompt])

  const abort = useCallback(() => {
    controllerRef.current?.abort()
    setStatus("Aborted")
    setLoading(false)
  }, [])

  const generate = useCallback(async () => {
    if (!imageDataUrl || !prompt.trim()) return
    setLoading(true)
    setStatus("Submitting...")
    const controller = new AbortController()
    controllerRef.current = controller

    try {
      const result = await retryWithBackoff(
        () => mockGenerate({ imageDataUrl, prompt, style }, { signal: controller.signal }),
        3, // max attempts
        controller.signal,
      )

      if ("message" in result) {
        // Final failure after retries still returned overloaded
        setStatus(result.message)
      } else {
        setStatus("Done")
        onGenerated(result)
      }
    } catch (err) {
      if (isAbortError(err)) {
        setStatus("Aborted")
      } else {
        setStatus("Failed")
      }
    } finally {
      setLoading(false)
    }
  }, [imageDataUrl, onGenerated, prompt, style])

  return (
    <section aria-labelledby="generate-title" className="w-full">
      <h2 id="generate-title" className="mb-2 text-lg font-semibold text-gray-900">
        Generate
      </h2>
      <div className="flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div aria-live="polite" className="text-sm text-gray-600">
          {status ? status : "Ready"}
        </div>
        <div className="flex items-center gap-2">
          {!loading ? (
            <button
              type="button"
              className={[
                "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-medium text-white transition",
                canGenerate
                  ? "bg-blue-600 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed",
              ].join(" ")}
              onClick={generate}
              disabled={!canGenerate}
            >
              Generate
            </button>
          ) : (
            <>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-3 text-sm font-medium text-white outline-none ring-blue-600/50 transition focus:ring-2"
                onClick={abort}
              >
                Abort
              </button>
              <div className="ml-2">
                <Spinner label="Generating" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function isAbortError(err: unknown) {
  return err instanceof DOMException && err.name === "AbortError"
}

async function retryWithBackoff<T extends Generation | { message: string }>(
  fn: () => Promise<T>,
  maxAttempts: number,
  signal?: AbortSignal,
): Promise<T> {
  let attempt = 0
  let lastResult: T | null = null

  while (attempt < maxAttempts) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError")
    // eslint-disable-next-line no-await-in-loop
    const result = await fn()
    if ("message" in result) {
      lastResult = result
      attempt += 1
      if (attempt >= maxAttempts) break
      // Backoff with jitter
      const delay = 500 * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 200)
      // eslint-disable-next-line no-await-in-loop
      await wait(delay, signal)
      continue
    }
    return result
  }
  // after retries, return last overloaded message or throw
  return lastResult as T
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
