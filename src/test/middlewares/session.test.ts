import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
import type { FastifyRequest, FastifyReply } from 'fastify'

function mockRequestReply(cookies: Record<string, string> = {}) {
  const request = {
    cookies,
  } as unknown as FastifyRequest

  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply

  return { request, reply }
}

describe('checkSessionIdExists middleware', () => {
  it('should return 401 when sessionId cookie is missing', async () => {
    const { request, reply } = mockRequestReply()

    await checkSessionIdExists(request, reply)

    expect(reply.status).toHaveBeenCalledWith(401)
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Unauthorized.',
    })
  })

  it('should return 401 when sessionId cookie is empty string', async () => {
    const { request, reply } = mockRequestReply({ sessionId: '' })

    await checkSessionIdExists(request, reply)

    expect(reply.status).toHaveBeenCalledWith(401)
    expect(reply.send).toHaveBeenCalledWith({
      error: 'Unauthorized.',
    })
  })

  it('should not return 401 when sessionId cookie is present', async () => {
    const { request, reply } = mockRequestReply({
      sessionId: 'valid-session-id',
    })

    await checkSessionIdExists(request, reply)

    expect(reply.status).not.toHaveBeenCalled()
    expect(reply.send).not.toHaveBeenCalled()
  })

  it('should call next (not reply) when sessionId is present', async () => {
    const { request, reply } = mockRequestReply({
      sessionId: 'abc-123',
    })

    const result = await checkSessionIdExists(request, reply)

    // When session is valid, middleware returns undefined (passes through)
    expect(result).toBeUndefined()
  })
})
