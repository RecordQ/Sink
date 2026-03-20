import { z } from 'zod'

export const NoteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(2000),
  content: z.string().max(50000),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isProtected: z.boolean().optional(),
})

export const NoteUpdateSchema = z.object({
  title: z.string().max(2000).optional(),
  content: z.string().max(50000).optional(),
  isProtected: z.boolean().optional(),
})

export type Note = z.infer<typeof NoteSchema>
