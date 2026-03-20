import type { z } from 'zod'
import { LinkSchema } from '@@/schemas/link'
import { hashPassword } from '@@/server/utils/crypto'

export default eventHandler(async (event) => {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: 'Preview mode cannot edit links.',
    })
  }
  const link = await readValidatedBody(event, LinkSchema.parse)
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  const existingLink: z.infer<typeof LinkSchema> | null = await KV.get(`link:${link.slug}`, { type: 'json' })
  if (existingLink) {
    const newLink = {
      ...existingLink,
      ...link,
      id: existingLink.id, // don't update id
      createdAt: existingLink.createdAt, // don't update createdAt
      updatedAt: Math.floor(Date.now() / 1000),
      password: link.password ? await hashPassword(link.password) : existingLink.password,
    }
    const expiration = getExpiration(event, newLink.expiration)
    await KV.put(`link:${newLink.slug}`, JSON.stringify(newLink), {
      expiration,
      metadata: {
        expiration,
        url: newLink.url,
        comment: newLink.comment,
      },
    })
    setResponseStatus(event, 201)
    const shortLink = `${getRequestProtocol(event)}://${getRequestHost(event)}/${newLink.slug}`
    return { link: newLink, shortLink }
  }
})
