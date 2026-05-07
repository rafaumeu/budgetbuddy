import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export default fp(async (app) => {
  app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'BudgetBuddy API',
        description:
          'Personal transaction manager for tracking finances. ' +
          'Most endpoints require a `sessionId` cookie — call POST /transactions first to obtain one.',
        version: '1.0.0',
      },
    },
  })
  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
    staticCSP: true,
  })
})
