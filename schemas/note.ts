import { z } from 'zod'

export const NoteSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(200),
  content: z.string().max(50000),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Note = z.infer<typeof NoteSchema>
