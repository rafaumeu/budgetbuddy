import fastify from 'fastify'
import { transactionRoutes } from './routes/transactions'


const app = fastify()

app.register(transactionRoutes)
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running on http://localhost:3333')
  })
