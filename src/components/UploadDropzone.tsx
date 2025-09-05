"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { downscaleImageIfNeeded } from "../utils/image"

interface UploadDropzoneProps {
  onImageReady: (dataUrl: string, dims: { width: number; height: number }) => void
}

export function UploadDropzone({ onImageReady }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const onFiles = useCallback(
    async (files: FileList | null) => {
      setError(null)
      if (!files || files.length === 0) return
      const file = files[0]

      if (!/image\/(png|jpeg)/.test(file.type)) {
        setError("Please upload a PNG or JPG image.")
        return
      }
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > 10) {
        setError("File too large. Max 10MB.")
        return
      }
      try {
        const { dataUrl, width, height } = await downscaleImageIfNeeded(file, 1920)
        onImageReady(dataUrl, { width, height })
        statusRef.current?.focus()
      } catch (e) {
        setError("Failed to load image.")
      }
    },
    [onImageReady],
  )

  const handleKeyActivate = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      inputRef.current?.click()
    }
  }, [])

  return (
    <section aria-labelledby="upload-title" className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 id="upload-title" className="text-lg font-semibold text-gray-900">
          Upload & Preview
        </h2>
        <span className="text-xs text-gray-500">PNG/JPG • ≤ 10MB</span>
      </div>

      <div
        className={[
          "group relative w-full rounded-xl border border-dashed p-6 transition",
          dragActive ? "border-blue-600 bg-blue-50/60" : "border-gray-300 bg-white",
          "shadow-md",
        ].join(" ")}
        role="button"
        tabIndex={0}
        aria-label="Upload image by drag and drop or press Enter to browse"
        onKeyDown={handleKeyActivate}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          onFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => onFiles(e.currentTarget.files)}
        />
        <div className="pointer-events-none flex flex-col items-center justify-center gap-2 text-center">
          <svg className="size-10 text-blue-600" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 16a1 1 0 01-1-1V9.41l-1.3 1.3a1 1 0 11-1.4-1.42l3-3a1 1 0 011.4 0l3 3a1 1 0 11-1.4 1.42L13 9.41V15a1 1 0 01-1 1Z"
            />
            <path
              fill="currentColor"
              d="M6 20a4 4 0 01-4-4V8a4 4 0 014-4h2a1 1 0 010 2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-2a1 1 0 112 0v2a4 4 0 01-4 4H6Z"
            />
          </svg>
          <p className="text-sm text-gray-700">
            Drag and drop your image here, or{" "}
            <span className="font-medium text-blue-600 underline underline-offset-2">browse</span>
          </p>
          <p className="text-xs text-gray-500">We’ll automatically downscale if larger than 1920px.</p>
        </div>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="mt-2 text-sm text-gray-600">
        {error ? (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        ) : (
          <span className="sr-only">Image ready</span>
        )}
      </div>
    </section>
  )
}
