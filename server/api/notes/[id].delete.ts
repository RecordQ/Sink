export default eventHandler(async (event) => {
  rateLimit(event, { windowMs: 60000, maxRequests: 20 })
  
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

  await KV.delete(`note:${id}`)

  return { success: true, id }
})
