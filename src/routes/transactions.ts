import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

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

export async function transactionRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get('/:id', {
    preHandler: [checkSessionIdExists]
  },
  async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { sessionId } = req.cookies

    const { id } = getTransactionParamsSchema.parse(req.params)
    const transaction = await knex('transactions').where({
      session_id: sessionId,
      id
    }).first()
    return { transaction }
  })

  app.get('/summary', {
    preHandler: [checkSessionIdExists]
  },
  async (req) => {
    const { sessionId } = req.cookies
    const summary = await knex('transactions').sum('amount', { as: 'amount'})
    .where('session_id', sessionId)
    .first()
    return { summary }
  })

  app.get('/category/:category', {
    preHandler: [checkSessionIdExists]
  },
  async (req) => {
    const getCategoryParamsSchema = z.object({
      category: categoryEnum,
    })

    const { sessionId } = req.cookies
    const { category } = getCategoryParamsSchema.parse(req.params)

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .where('category', category)
      .select()

    return { transactions }
  })

  app.get('/summary/monthly', {
    preHandler: [checkSessionIdExists]
  },
  async (req) => {
    const { sessionId } = req.cookies

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
  })

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
      category: categoryEnum.optional().default('OTHER'),
    })

    const { title, amount, type, category } = createTransactionBodySchema.parse(req.body)
    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }
    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        category,
        session_id: sessionId
      })

    return reply.status(201).send()
  })

}
