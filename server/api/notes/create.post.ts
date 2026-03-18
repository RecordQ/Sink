import { NoteSchema } from '@@/schemas/note'

export default eventHandler(async (event) => {
  rateLimit(event, { windowMs: 60000, maxRequests: 30 })
  
  const noteData = await readValidatedBody(event, NoteSchema.parse)

  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  
  const id = noteData.id || crypto.randomUUID()
  const now = new Date().toISOString()

  const note = {
    id,
    title: noteData.title,
    content: noteData.content,
    createdAt: noteData.createdAt || now,
    updatedAt: now,
  }

  await KV.put(`note:${id}`, JSON.stringify(note), {
    metadata: {
      title: note.title,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    },
  })

  setResponseStatus(event, 201)
  return note
})
