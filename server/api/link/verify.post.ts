import { hashPassword } from '@@/server/utils/crypto'
import { withQuery } from 'ufo'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    slug: z.string().trim(),
    password: z.string().trim(),
    query: z.record(z.string(), z.any()).optional().default({}),
  }).safeParse)

  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const { slug, password, query } = body.data
  const { caseSensitive, linkCacheTtl, redirectWithQuery } = useRuntimeConfig(event)
  const { cloudflare } = event.context
  const { KV } = cloudflare.env

  const getLink = async (key: string) =>
    await KV.get(`link:${key}`, { type: 'json', cacheTtl: linkCacheTtl })

  const lowerCaseSlug = slug.toLowerCase()
  let link = await getLink(caseSensitive ? slug : lowerCaseSlug)

  if (!caseSensitive && !link && lowerCaseSlug !== slug) {
    link = await getLink(slug)
  }

  if (!link) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  if (link.password !== await hashPassword(password)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  event.context.link = link
  try {
    await useAccessLog(event)
  }
  catch (error) {
    console.error('Failed write access log:', error)
  }

  const target = redirectWithQuery ? withQuery(link.url, query) : link.url
  return { url: target, isEncrypted: link.isEncrypted }
})
