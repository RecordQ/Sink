import { NoteSchema } from '@@/schemas/note'

export default eventHandler(async (event) => {
  rateLimit(event, { windowMs: 60000, maxRequests: 30 })
  
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      status: 400,
      statusText: 'Note ID is required',
    })
  }

  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  const existingNote = await KV.get(`note:${id}`, { type: 'json' })

  if (!existingNote) {
    throw createError({
      status: 404,
      statusText: 'Note not found',
    })
  }

  const noteData = await readValidatedBody(event, NoteSchema.parse)
  const now = new Date().toISOString()

  const note = {
    ...existingNote,
    title: noteData.title,
    content: noteData.content,
    updatedAt: now,
  }

  await KV.put(`note:${id}`, JSON.stringify(note), {
    metadata: {
      title: note.title,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    },
  })

  return note
})
