// import axios from 'axios'
// import { METHOD } from './types/types'
import { DocumentNode } from 'graphql'
import { request } from 'graphql-request'
const baseURL = 'http://localhost:8000/graphql'

// interface Key {
//   MESSAGES: any | unknown
//   MESSAGE: string
//   USERS: string
//   USER: string
// }

export const fetcher = (
  query: DocumentNode,
  variables: { [key: string]: any } = {}
) => request(baseURL, query, variables)

export const QueryKeys = {
  MESSAGES: 'MESSAGES',
  MESSAGE: 'MESSAGE',
  USERS: 'USERS',
  USER: 'USER',
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

// export default fetcher
