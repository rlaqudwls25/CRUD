import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './schema/index.js'
import resolvers from './resolvers/index.js'
import { readDB } from './dbController.js'
// import messagesRoute from './routes/messages.js'
// import userRoute from './routes/user.js'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    db: {
      messages: readDB('messages'),
      users: readDB('user'),
    },
  },
})

const app = express()
await server.start()

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,
  },
})

await app.listen({ port: 8000 })
console.log('server listening on 8000..')

// RestFul API
// import messagesRoute from './routes/messages.js'
// import userRoute from './routes/user.js'

//express에서 json형태로 사용
// const app = express()
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json()) //express에서 json형태로 사용

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// )

// const routes = [...messagesRoute, ...userRoute]

// routes.forEach(({ method, route, handler }) => {
//   app[method](route, handler)
// })

// app.listen(8000, () => {
//   console.log('server')
// })
