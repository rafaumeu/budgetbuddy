  import { app } from './app'


  app
    .listen({
      port: 3333,
      host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost'
    })
    .then(() => {
      console.log('HTTP Server Running on http://localhost:3333')
    })
