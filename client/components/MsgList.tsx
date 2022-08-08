import React, { useEffect, useState, useRef } from 'react'
import { Message, Users, METHOD } from '../types/types'
import { useRouter } from 'next/router'
import { fetcher, QueryKeys } from '../fetcher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from '../graphql/messages'
import MsgItem from './MsgItem'
import MsgInput from './MsgInput'
import Loading from './Loading'
// import useInfiniteScroll from '../hooks/useInfiniteScroll'

const MsgList = ({ smsgs, users }: { smsgs: Message[]; users: Users }) => {
  const [msgs, setMsgs] = useState<Message[]>(smsgs)
  const [isEditId, setIsEditId] = useState<string | null>(null)
  // const [next, setNext] = useState(true)
  // const intersecting = useInfiniteScroll(fetchMoreElement)
  // const fetchMoreElement = useRef<HTMLDivElement>(null)
  const {
    query: { userId = '' },
  } = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const client = useQueryClient()

  const { data, error, isError } = useQuery([QueryKeys.MESSAGES], () =>
    fetcher(GET_MESSAGES)
  )

  useEffect(() => {
    if (!data?.messages) return
    setMsgs(data?.messages)
  }, [data?.messages])

  const { mutate: onCreate } = useMutation(
    ({ text }: { text: string }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueriesData([QueryKeys.MESSAGES], (old: any) => {
          setLoading(true)
          return {
            messages: [createMessage, ...old.messages],
          }
        })
        setLoading(false)
      },
      onError: () => {
        console.error('에러 발생')
      },
    }
  )

  const { mutate: onUpdate } = useMutation(
    ({ text, id }: { text: string; id: number }) =>
      fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueryData([QueryKeys.MESSAGES], (old: any) => {
          setLoading(true)
          const targetIndex = old.messages.findIndex(
            (msg: any) => msg.id === updateMessage.id
          )
          if (targetIndex < 0) return old
          const newMsgs = [...old.messages]
          newMsgs.splice(targetIndex, 1, updateMessage)
          return {
            messages: newMsgs,
          }
        })
        doneEdit()
        setLoading(false)
      },
      onError: () => {
        console.error('에러 발생')
      },
    }
  )

  const { mutate: onDelete } = useMutation(
    (id: { id: string }) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deleteId }) => {
        client.setQueriesData([QueryKeys.MESSAGES], (old: any) => {
          const targetIndex = old.messages.findIndex(
            (msg: any) => msg.id === deleteId
          )
          if (targetIndex < 0) return old

          const newMsgs = [...old.messages]
          newMsgs.splice(targetIndex, 1)

          return {
            messages: newMsgs,
          }
        })
      },
    }
  )

  const doneEdit = () => setIsEditId(null)

  return (
    <>
      <MsgInput mutate={onCreate} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ul className="messages">
            {msgs &&
              msgs.map((x) => (
                <MsgItem
                  key={x.id}
                  {...x}
                  onUpdate={onUpdate}
                  onDelete={() => onDelete(x.id)}
                  startEdit={() => setIsEditId(x.id)}
                  isEditing={isEditId === x.id}
                  myId={userId}
                  user={users.find((user: any) => user.id === x.userId)}
                />
              ))}
          </ul>
          {/* <div ref={fetchMoreElement} /> */}
        </>
      )}
    </>
  )
}

export default MsgList
