import type { StyleOption } from "../types"

interface SummaryCardProps {
  imageDataUrl?: string | null
  prompt: string
  style: StyleOption
}

export function SummaryCard({ imageDataUrl, prompt, style }: SummaryCardProps) {
  return (
    <section aria-labelledby="summary-title" className="w-full">
      <h2 id="summary-title" className="mb-2 text-lg font-semibold text-gray-900">
        Summary
      </h2>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <div className="flex items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {imageDataUrl ? (
              <img
                src={imageDataUrl || "/placeholder.svg"}
                alt="Uploaded preview"
                className="h-40 w-full object-contain"
              />
            ) : (
              <EmptyPreview />
            )}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Style</p>
              <p className="text-sm text-gray-900">{style}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Prompt</p>
              <p className="text-pretty text-sm leading-relaxed text-gray-900">{prompt || "No prompt yet."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyPreview() {
  return (
    <div className="flex h-40 w-full flex-col items-center justify-center gap-2 text-center">
      <svg className="size-8 text-gray-400" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21 19V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12h18Zm2 0a2 2 0 01-2 2H3a2 2 0 01-2-2h22ZM7 9h10v2H7V9Z"
        />
      </svg>
      <p className="text-xs text-gray-500">No image yet. Upload to preview.</p>
    </div>
  )
}
