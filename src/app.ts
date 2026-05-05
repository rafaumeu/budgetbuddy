import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { transactionRoutes } from './routes/transactions'

export const app = fastify()

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation error.',
      details: error.format(),
    })
  }

  return reply.status(500).send({ error: 'Internal server error.' })
})

app.register(cookie)
app.register(transactionRoutes, {
  prefix: 'transactions'
})