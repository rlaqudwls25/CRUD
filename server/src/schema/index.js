import { gql } from 'apollo-server-express'
import messageSchema from './message'
import userSchema from './user'

const linkSchema = gql`
  type Mutation {
    _: boolean
  }

  type Query {
    _: boolean
  }
`

export default [linkSchema, messageSchema, userSchema]
