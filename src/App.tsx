"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { UploadDropzone } from "./components/UploadDropzone"
import { PromptStyleForm } from "./components/PromptStyleForm"
import { SummaryCard } from "./components/SummaryCard"
import { GeneratePanel } from "./components/GeneratePanel"
import { HistoryList } from "./components/HistoryList"
import type { Generation, StyleOption } from "./types"
import { safeGetItem, safeSetItem } from "./utils/storage"

const HISTORY_KEY = "ai-studio-history"

export default function App() {
  // Core state
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null)
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState<StyleOption>("Editorial")

  // History
  const [history, setHistory] = useState<Generation[]>(() => safeGetItem<Generation[]>(HISTORY_KEY, []))

  useEffect(() => {
    safeSetItem(HISTORY_KEY, history.slice(0, 5))
  }, [history])

  const handleImageReady = useCallback((dataUrl: string, dims: { width: number; height: number }) => {
    setImageDataUrl(dataUrl)
    setImageDims(dims)
  }, [])

  const handleGenerated = useCallback((gen: Generation) => {
    setHistory((prev) => [gen, ...prev].slice(0, 5))
  }, [])

  const restoreFromHistory = useCallback((item: Generation) => {
    setImageDataUrl(item.imageUrl)
    setPrompt(item.prompt)
    setStyle(item.style)
  }, [])

  const headerLabel = useMemo(() => "AI Studio", [])

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-balance text-2xl font-bold text-gray-900 sm:text-3xl">{headerLabel}</h1>
        <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">Demo</span>
      </header>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <UploadDropzone onImageReady={handleImageReady} />
          <PromptStyleForm prompt={prompt} onPromptChange={setPrompt} style={style} onStyleChange={setStyle} />
          <SummaryCard imageDataUrl={imageDataUrl ?? undefined} prompt={prompt} style={style} />
          <GeneratePanel
            imageDataUrl={imageDataUrl ?? undefined}
            prompt={prompt}
            style={style}
            onGenerated={handleGenerated}
          />
        </div>

        <div className="space-y-6">
          <section aria-labelledby="preview-title" className="w-full">
            <h2 id="preview-title" className="mb-2 text-lg font-semibold text-gray-900">
              Live Preview
            </h2>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
              {imageDataUrl ? (
                <img
                  src={imageDataUrl || "/placeholder.svg"}
                  alt="Live preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <EmptyState />
              )}
            </div>
            {imageDims ? (
              <p className="mt-2 text-xs text-gray-500">
                {imageDims.width} × {imageDims.height}px
              </p>
            ) : null}
          </section>

          <HistoryList items={history} onSelect={restoreFromHistory} />
        </div>
      </main>

      <footer className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} AI Studio</p>
        <p className="hidden sm:block">Accessible. Responsive. Minimal.</p>
      </footer>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
      <svg className="size-10 text-gray-300" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h7a1 1 0 100-2H5a1 1 0 01-1-1v-2.586l3.293-3.293a1 1 0 011.414 0L12 16l3.293-3.293a1 1 0 011.414 0L20 15.586V17a1 1 0 01-1 1h-3a1 1 0 100 2h3a3 3 0 003-3V7a3 3 0 00-3-3zm-8 7a3 3 0 110-6 3 3 0 010 6z"
        />
      </svg>
      <p className="max-w-xs text-pretty text-sm text-gray-600">
        Upload an image to get started. We’ll generate a scaled preview if it’s larger than 1920px.
      </p>
    </div>
  )
}
