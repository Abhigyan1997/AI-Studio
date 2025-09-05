"use client"
import type { Generation } from "../types"

interface HistoryListProps {
  items: Generation[]
  onSelect: (item: Generation) => void
}

export function HistoryList({ items, onSelect }: HistoryListProps) {
  return (
    <section aria-labelledby="history-title" className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 id="history-title" className="text-lg font-semibold text-gray-900">
          History
        </h2>
        <span className="text-xs text-gray-500">Last 5 results</span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-md">
          No history yet. Generate to see results here.
        </div>
      ) : (
        <ul
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
          role="listbox"
          aria-label="Previous generations"
        >
          {items.map((item) => (
            <li key={item.id}>
              <button
                className="group w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-left outline-none ring-blue-600/50 transition hover:shadow-md focus:ring-2"
                onClick={() => onSelect(item)}
                role="option"
                aria-label={`Load generation from ${new Date(item.createdAt).toLocaleString()}`}
              >
                <div className="aspect-square w-full bg-gray-50">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt="Previous generation thumbnail"
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs text-gray-700">{item.style}</p>
                  <p className="line-clamp-2 text-xs text-gray-500">{item.prompt}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
