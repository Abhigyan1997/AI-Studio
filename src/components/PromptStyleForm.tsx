"use client"
import type { StyleOption } from "../types"

interface PromptStyleFormProps {
  prompt: string
  onPromptChange: (v: string) => void
  style: StyleOption
  onStyleChange: (v: StyleOption) => void
  styles?: StyleOption[]
}

const DEFAULT_STYLES: StyleOption[] = ["Editorial", "Streetwear", "Vintage", "Minimal", "Avant-garde"]

export function PromptStyleForm({
  prompt,
  onPromptChange,
  style,
  onStyleChange,
  styles = DEFAULT_STYLES,
}: PromptStyleFormProps) {
  return (
    <section aria-labelledby="prompt-style-title" className="w-full">
      <h2 id="prompt-style-title" className="mb-2 text-lg font-semibold text-gray-900">
        Prompt & Style
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-800">Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the transformation you'd like..."
            rows={6}
            className="min-h-[120px] resize-y rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 outline-none ring-blue-600/50 transition focus:ring-2"
            aria-label="Prompt"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-800">Style</span>
          <select
            value={style}
            onChange={(e) => onStyleChange(e.target.value as StyleOption)}
            className="h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none ring-blue-600/50 transition focus:ring-2"
            aria-label="Style"
          >
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Choose a style direction to guide the generation.</p>
        </label>
      </div>
    </section>
  )
}
