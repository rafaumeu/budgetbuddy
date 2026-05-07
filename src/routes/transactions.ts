import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// ── Shared schemas ────────────────────────────────────────────────────
const categoryEnum = z.enum([
  'FOOD',
  'TRANSPORT',
  'HOUSING',
  'EDUCATION',
  'HEALTH',
  'ENTERTAINMENT',
  'SALARY',
  'FREELANCE',
  'INVESTMENT',
  'OTHER',
])

const transactionRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  amount: z.coerce.number(),
  category: z.string(),
  created_at: z.string(),
  session_id: z.string().optional(),
})

const authCookieNote =
  'Requires a `sessionId` cookie. Obtain one by calling POST /transactions first.'

// ── Routes ────────────────────────────────────────────────────────────
export async function transactionRoutes(app: import('fastify').FastifyInstance) {
  // 1. List all transactions for the current session
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
      schema: {
        tags: ['Transactions'],
        summary: 'List transactions',
        description: `Returns all transactions for the authenticated session. ${authCookieNote}`,
        response: {
          200: z.object({
            transactions: z.array(transactionRowSchema),
          }),
        },
      },
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  // 2. Get a single transaction by ID
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
      schema: {
        tags: ['Transactions'],
        summary: 'Get transaction by ID',
        description: `Fetch a single transaction. ${authCookieNote}`,
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            transaction: transactionRowSchema.nullable(),
          }),
        },
      },
    },
    async (request) => {
      const { sessionId } = request.cookies
      const { id } = request.params as { id: string }

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transaction }
    },
  )

  // 3. Summary (total balance)
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
      schema: {
        tags: ['Transactions'],
        summary: 'Get balance summary',
        description: `Returns the total sum of all transactions. ${authCookieNote}`,
        response: {
          200: z.object({
            summary: z.object({
              amount: z.coerce.number().nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return { summary }
    },
  )

  // 4. Transactions by category
  app.get(
    '/category/:category',
    {
      preHandler: [checkSessionIdExists],
      schema: {
        tags: ['Transactions'],
        summary: 'List transactions by category',
        description: `Returns transactions filtered by category. ${authCookieNote}`,
        params: z.object({
          category: categoryEnum,
        }),
        response: {
          200: z.object({
            transactions: z.array(transactionRowSchema),
          }),
        },
      },
    },
    async (request) => {
      const { sessionId } = request.cookies
      const { category } = request.params as { category: string }

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .where('category', category)
        .select()

      return { transactions }
    },
  )

  // 5. Monthly summary
  app.get(
    '/summary/monthly',
    {
      preHandler: [checkSessionIdExists],
      schema: {
        tags: ['Transactions'],
        summary: 'Get monthly summary',
        description: `Returns monthly breakdown by category. ${authCookieNote}`,
        response: {
          200: z.object({
            monthly: z.array(
              z.object({
                month: z.string(),
                category: z.string(),
                total: z.coerce.number(),
                count: z.coerce.number(),
              }),
            ),
            overall: z.object({
              amount: z.coerce.number().nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { sessionId } = request.cookies

      const monthlySummary = await knex('transactions')
        .select(
          knex.raw("strftime('%Y-%m', created_at) as month"),
          'category',
          knex.raw('SUM(amount) as total'),
          knex.raw('COUNT(*) as count'),
        )
        .where('session_id', sessionId)
        .groupBy('month', 'category')
        .orderBy('month', 'desc')

      const overallTotal = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()

      return {
        monthly: monthlySummary,
        overall: overallTotal,
      }
    },
  )

  // 6. Create transaction (no auth — creates session if needed)
  app.post(
    '/',
    {
      schema: {
        tags: ['Transactions'],
        summary: 'Create a transaction',
        description:
          'Creates a new transaction. If no `sessionId` cookie is present, a new session is created and returned as a cookie.',
        body: z.object({
          title: z.string(),
          amount: z.number(),
          type: z.enum(['credit', 'debit']),
          category: categoryEnum.optional().default('OTHER'),
        }),
        response: {
          201: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { title, amount, type, category } = request.body as {
        title: string
        amount: number
        type: 'credit' | 'debit'
        category: string
      }

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = crypto.randomUUID()
        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        category,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )
}
