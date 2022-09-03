export interface Message {
  id: string
  userId: string
  timestamp: number
  text: string
  user: User
}

export interface User {
  id: string
  nickname: string
}

export interface Users {
  [key: string]: any
}

export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export type Mutate = ({ text, id }: { text: string; id?: string }) => void

export interface MsgQueryData {
  pages: { messages: Message[] }[]
  pageParams?: string
}
