import { gql } from 'apollo-server-express'
import messageSchema from './message.js'
import userSchema from './user.js'

const linkSchema = gql`
  type Mutation {
    _: Boolean
  }

  type Query {
    _: Boolean
  }
`

export default [linkSchema, messageSchema, userSchema]
