import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { ZodError } from 'zod'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { transactionRoutes } from './routes/transactions'
import swaggerPlugin from './plugins/swagger'
import rateLimit from '@fastify/rate-limit'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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
app.register(swaggerPlugin)

app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}))
app.register(rateLimit, { max: 100, timeWindow: '1 minute' })

app.register(transactionRoutes, {
  prefix: 'transactions',
})
