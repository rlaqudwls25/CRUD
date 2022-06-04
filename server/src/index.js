import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import messagesRoute from './routes/messages.js'
import userRoute from './routes/user.js'
import schema from './schema/index.js'
import resolvers from './resolvers/index.js'
import { readDB } from './dbController.js'

//express에서 json형태로 사용
/** Rest API */
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

/** Rest API */
// const routes = [...messagesRoute, ...userRoute];

// routes.forEach(({ method, route, handler }) => {
//   app[method](route, handler);
// });

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
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

await app.listen({ port: 8000 })
console.log('server listening on 8000..')
