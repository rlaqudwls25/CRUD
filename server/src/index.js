import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import messagesRoute from './routes/messages.js'
import userRoute from './routes/user.js'

const app = express()

//express에서 json형태로 사용
/** Rest API */
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

/** Rest API */
// const routes = [...messagesRoute, ...userRoute];

// routes.forEach(({ method, route, handler }) => {
//   app[method](route, handler);
// });

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models: {
      messages: '',
      user: '',
    },
  },
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(8000, () => {
  console.log('server')
})
