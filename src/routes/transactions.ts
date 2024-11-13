import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

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
    const transactions = await knex('transactions').where({
      session_id: sessionId, 
      id
    }).first()
    return { transactions } 
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

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const {title, amount, type} = createTransactionBodySchema.parse(req.body)
    let sessionId = req.cookies.sessionId

    if(!sessionId) {
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
      session_id: sessionId
    })

    return reply.status(201).send()
  })

}