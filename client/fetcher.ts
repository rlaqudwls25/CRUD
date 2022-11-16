// import axios from 'axios'
// import { METHOD } from './types/types'
import { DocumentNode } from 'graphql/language/ast'
import { request } from 'graphql-request'
import { Message } from './types/types'
const URL = 'http://localhost:8000/graphql'

export const fetcher = (
  query: DocumentNode,
  variables: { [key: string]: any } = {}
) => request(URL, query, variables)

export const QueryKeys = {
  MESSAGES: 'MESSAGES',
  MESSAGE: 'MESSAGE',
  USERS: 'USERS',
  USER: 'USER',
}

export const findMsgIndex = (pages: { messages: Message[] }[], id: number) => {
  let msgIdx = -1
  const pageId = pages.findIndex(({ messages }) => {
    msgIdx = messages.findIndex((msg: any) => msg.id === id)
    if (msgIdx > -1) {
      return true
    } else {
      return false
    }
  })
  return { pageId, msgIdx }
}

// axios.defaults.baseURL = 'http://localhost:8000'

// const fetcher = async (
//   method: METHOD,
//   url: string,
//   ...rest: { [key: string]: any }[]
// ) => {
//   const res = await axios[method](url, ...rest)
//   return res.data
// }

// axios.get()

// export default fetcher
