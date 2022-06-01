import { gql } from 'apollo-server-express'

const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    user: User!
    timeStamp: Float
  }

  extend type Query {
    messages(cursor: ID): [Message!]!
    messages(id: ID!): Message!
  }

  extend type Mutation {
    createMessages(text: String!, userId: ID!): Message!
    updateMessages(id: ID!, text: String!, userId: ID!): Message!
    deleteMessages(id: ID!, userId: ID!): ID!
  }
`

export default messageSchema
