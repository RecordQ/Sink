export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      status: 400,
      statusText: 'Note ID is required',
    })
  }

  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  const note = await KV.get(`note:${id}`, { type: 'json' })

  if (!note) {
    throw createError({
      status: 404,
      statusText: 'Note not found',
    })
  }

  return note
})
