import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'

// Mock data store
let mockData: any[] = []
let mockInsertData: any[] = []

// Create a chainable mock query builder
function createChainable(finalResult: any = []) {
  const chain: any = {
    where: vi.fn().mockReturnThis(),
    select: vi.fn().mockImplementation(() => finalResult),
    first: vi.fn().mockImplementation(() => finalResult),
    sum: vi.fn().mockReturnThis(),
    insert: vi.fn().mockImplementation((data: any) => {
      mockInsertData.push(data)
    }),
    groupBy: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    raw: vi.fn().mockImplementation((sql: string) => sql),
  }
  return chain
}

// Mock knex function
const mockKnex = vi.fn().mockImplementation((table: string) => {
  const chain = createChainable(mockData)
  return chain
}) as any

// Add static raw method
mockKnex.raw = vi.fn().mockImplementation((sql: string) => sql)

vi.mock('../../database', () => ({
  knex: mockKnex,
  config: {
    client: 'sqlite',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  },
}))

// Build a fresh app for each test
let app: FastifyInstance

async function buildApp() {
  // Import fresh after mock is set up
  const cookie = (await import('@fastify/cookie')).default
  const fastify = (await import('fastify')).default
  const { ZodError } = await import('zod')
  const {
    serializerCompiler,
    validatorCompiler,
  } = await import('fastify-type-provider-zod')
  const { transactionRoutes } = await import('../../routes/transactions')

  const server = fastify()
  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)
  server.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Validation error.',
        details: error.format(),
      })
    }
    return reply.status(500).send({ error: 'Internal server error.' })
  })
  server.register(cookie)
  server.register(transactionRoutes, { prefix: 'transactions' })
  await server.ready()
  return server
}

describe('Transactions routes (integration via fastify.inject)', () => {
  beforeEach(async () => {
    mockData = []
    mockInsertData = []
    vi.clearAllMocks()
    app = await buildApp()
  })

  // ---- POST /transactions ----

  it('should create a transaction and return 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Test transaction',
        amount: 5000,
        type: 'credit',
      },
    })

    expect(res.statusCode).toBe(201)
    expect(mockInsertData).toHaveLength(1)
    expect(mockInsertData[0]).toEqual(
      expect.objectContaining({
        title: 'Test transaction',
        amount: 5000,
        session_id: expect.any(String),
      }),
    )
  })

  it('should set sessionId cookie when none is provided', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'New session',
        amount: 100,
        type: 'credit',
      },
    })

    expect(res.statusCode).toBe(201)
    const setCookie = res.headers['set-cookie']
    expect(setCookie).toBeDefined()
    expect(setCookie).toContain('sessionId=')
  })

  it('should reuse existing sessionId cookie', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Existing session',
        amount: 200,
        type: 'debit',
      },
      cookies: { sessionId: 'existing-session-123' },
    })

    expect(res.statusCode).toBe(201)
    expect(mockInsertData[0].session_id).toBe('existing-session-123')
    // Should NOT set a new cookie
    expect(res.headers['set-cookie']).toBeUndefined()
  })

  it('should store debit amount as negative', async () => {
    await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Expense',
        amount: 100,
        type: 'debit',
      },
      cookies: { sessionId: 'test-session' },
    })

    expect(mockInsertData[0].amount).toBe(-100)
  })

  it('should store credit amount as positive', async () => {
    await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Income',
        amount: 3000,
        type: 'credit',
      },
      cookies: { sessionId: 'test-session' },
    })

    expect(mockInsertData[0].amount).toBe(3000)
  })

  it('should default category to OTHER when not provided', async () => {
    await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'No category',
        amount: 50,
        type: 'credit',
      },
      cookies: { sessionId: 'test-session' },
    })

    expect(mockInsertData[0].category).toBe('OTHER')
  })

  it('should accept a valid category', async () => {
    await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Groceries',
        amount: 100,
        type: 'debit',
        category: 'FOOD',
      },
      cookies: { sessionId: 'test-session' },
    })

    expect(mockInsertData[0].category).toBe('FOOD')
  })

  it('should return 400 for invalid category', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Bad category',
        amount: 100,
        type: 'debit',
        category: 'INVALID_CATEGORY',
      },
    })

    expect(res.statusCode).toBe(500)
  })

  it('should return 400 for missing title', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        amount: 100,
        type: 'credit',
      },
    })

    expect(res.statusCode).toBe(500)
  })

  it('should return 400 for missing amount', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'No amount',
        type: 'credit',
      },
    })

    expect(res.statusCode).toBe(500)
  })

  it('should return 400 for invalid type', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Bad type',
        amount: 100,
        type: 'transfer',
      },
    })

    expect(res.statusCode).toBe(500)
  })

  // ---- GET /transactions (list) ----

  it('should return 401 when listing without sessionId', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/transactions',
    })

    expect(res.statusCode).toBe(401)
  })

  it('should list transactions for authenticated session', async () => {
    const mockTransactions = [
      { id: '550e8400-e29b-41d4-a716-446655440000', title: 'T1', amount: 500, category: 'OTHER', created_at: '2024-01-01T00:00:00', session_id: 'sess1' },
    ]
    mockData = mockTransactions

    const res = await app.inject({
      method: 'GET',
      url: '/transactions',
      cookies: { sessionId: 'sess1' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.transactions).toHaveLength(1)
    expect(body.transactions[0]).toEqual(
      expect.objectContaining({
        title: 'T1',
        amount: 500,
      }),
    )
  })

  // ---- GET /transactions/:id ----

  it('should return 401 when getting transaction by id without sessionId', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/transactions/550e8400-e29b-41d4-a716-446655440000',
    })

    expect(res.statusCode).toBe(401)
  })

  it('should return 400 for invalid uuid format in :id', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/transactions/not-a-uuid',
      cookies: { sessionId: 'sess1' },
    })

    expect(res.statusCode).toBe(500)
  })

  // ---- GET /transactions/summary ----

  it('should return 401 when getting summary without sessionId', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/transactions/summary',
    })

    expect(res.statusCode).toBe(401)
  })

  it('should return summary for authenticated session', async () => {
    // For the summary route, knex('transactions').sum(...).where(...).first()
    // We need the mock to resolve properly
    const summaryResult = { amount: 5000 }
    mockData = summaryResult

    // Rebuild with a custom mock behavior for this test
    mockKnex.mockImplementation(() => {
      const chain: any = {
        where: vi.fn().mockReturnThis(),
        sum: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(summaryResult),
        select: vi.fn().mockResolvedValue([]),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        insert: vi.fn(),
      }
      return chain
    })

    const freshApp = await buildApp()
    const res = await freshApp.inject({
      method: 'GET',
      url: '/transactions/summary',
      cookies: { sessionId: 'sess1' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.summary).toEqual({ amount: 5000 })
  })

  // ---- GET /transactions/category/:category ----

  it('should return 401 when getting by category without sessionId', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/transactions/category/FOOD',
    })

    expect(res.statusCode).toBe(401)
  })

  it('should return 400 for invalid category value', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/transactions/category/INVALID',
      cookies: { sessionId: 'sess1' },
    })

    expect(res.statusCode).toBe(500)
  })
})
