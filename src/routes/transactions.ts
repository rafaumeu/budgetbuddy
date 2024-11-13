import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()
    return { transactions }
  })

  app.get('/:id', async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),  
    })
    const { id } = getTransactionParamsSchema.parse(req.params) 
    const transactions = await knex('transactions').where('id', id).first()
    return { transactions } 
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions').sum('amount', { as: 'amount'})
    return { summary }
  })

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const {title, amount, type} = createTransactionBodySchema.parse(req.body)
    let sessionId = req.cookies.session_id

    if(!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('session_id', sessionId, {
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