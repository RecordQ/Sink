import type { H3Event } from 'h3'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(event: H3Event, config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }) {
  const ip = getRequestHeader(event, 'cf-connecting-ip') 
    || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]
    || 'unknown'

  const now = Date.now()
  const key = `${ip}:${event.path}`
  
  // Lazy cleanup: remove expired entries
  if (requestCounts.size > 1000) {
    for (const [k, record] of requestCounts.entries()) {
      if (now > record.resetTime) {
        requestCounts.delete(k)
      }
    }
  }
  
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return true
  }

  if (record.count >= config.maxRequests) {
    throw createError({
      status: 429,
      statusText: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
    })
  }

  record.count++
  return true
}
