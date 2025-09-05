// Types for the AI Studio app

export type StyleOption = "Editorial" | "Streetwear" | "Vintage" | "Minimal" | "Avant-garde"

export interface GenerateRequest {
  imageDataUrl: string
  prompt: string
  style: StyleOption
}

export interface Generation {
  id: string
  imageUrl: string
  prompt: string
  style: StyleOption
  createdAt: string // ISO string
}
