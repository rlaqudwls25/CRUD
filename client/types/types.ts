export interface Message {
  id: string
  userId: string
  timestamp: number
  text: string
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
