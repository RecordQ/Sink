import { z } from 'zod'

export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  
  const { limit, cursor } = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().max(1024).default(100),
    cursor: z.string().trim().max(1024).optional(),
  }).parse)

  const list = await KV.list({
    prefix: 'note:',
    limit,
    cursor: cursor || undefined,
  })

  if (Array.isArray(list.keys)) {
    list.notes = await Promise.all(list.keys.map(async (key: { name: string }) => {
      const { value: note } = await KV.getWithMetadata(key.name, { type: 'json' })
      return note
    }))
  }

  delete list.keys
  return list
})
