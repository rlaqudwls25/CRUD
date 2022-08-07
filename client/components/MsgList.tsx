import React, { useEffect, useState, useRef } from 'react'
import { Message, Users, METHOD } from '../types/types'
import { useRouter } from 'next/router'
import { fetcher, QueryKeys } from '../fetcher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CREATE_MESSAGE, GET_MESSAGES } from '../graphql/messages'
import MsgItem from './MsgItem'
import MsgInput from './MsgInput'
import Loading from './Loading'
// import useInfiniteScroll from '../hooks/useInfiniteScroll'

const MsgList = ({ smsgs, users }: { smsgs: Message[]; users: Users }) => {
  const [msgs, setMsgs] = useState<Message[]>(smsgs)
  const [isEditId, setIsEditId] = useState<string | null>(null)
  // const [next, setNext] = useState(true)
  const {
    query: { userId = '' },
  } = useRouter()
  // const fetchMoreElement = useRef<HTMLDivElement>(null)
  // const intersecting = useInfiniteScroll(fetchMoreElement)
  const [loading, setLoading] = useState<boolean>(false)
  const client = useQueryClient()

  // useEffect(() => {
  //   if (intersecting && next) {
  //     getMessages()
  //   }
  // }, [intersecting])

  // useEffect(() => {
  //   getMessages()
  // }, [])

  const { data, error, isError } = useQuery([QueryKeys.MESSAGE], () =>
    fetcher(GET_MESSAGES)
  )

  useEffect(() => {
    setMsgs(data?.messages || [])
  }, [data?.messages])

  // if (isError) {
  //   return null
  // }

  // const getMessages = async (): Promise<void> => {
  //   try {
  //     setLoading(true)
  //     const newMsgs = await fetcher(METHOD.GET, '/messages', {
  //       params: { cursor: msgs[msgs.length - 1]?.id || '' },
  //     })

  //     if (newMsgs.length === 0) {
  //       setNext(false)
  //       return
  //     }

  //     setMsgs((msgs) => [...msgs, ...newMsgs])
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const { mutate: onCreate } = useMutation(
    ({ text }: { text: string }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueriesData([QueryKeys.MESSAGES], (old: any) => {
          return {
            messages: [...old.messages, createMessage],
          }
        })
      },
    }
  )

  // const onCreate = async (text: string): Promise<void> => {
  //   try {
  //     setLoading(true)
  //     const newMsg = await fetcher(METHOD.POST, '/messages', { text, userId })

  //     if (!newMsg) throw Error('something wrong')
  //     setMsgs((msgs) => [newMsg, ...msgs])
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const onUpdate = async (
  //   text: string,
  //   id?: string
  // ): Promise<Message[] | undefined> => {
  //   try {
  //     setLoading(true)
  //     const newMsg = await fetcher(METHOD.PUT, `/messages/${id}`, {
  //       text,
  //       userId,
  //     })

  //     const targetIndex = msgs.findIndex((msg) => msg.id === id)
  //     if (targetIndex < 0) return msgs

  //     msgs.splice(targetIndex, 1, newMsg)

  //     setMsgs((msgs) => [...msgs])

  //     doneEdit()
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const onDelete = async (id: string): Promise<Message[] | undefined> => {
  //   try {
  //     setLoading(true)
  //     const deleteId = await fetcher(METHOD.DELETE, `/messages/${id}`, {
  //       params: { userId },
  //     })

  //     const targetIndex = msgs.findIndex((msg) => msg.id === deleteId + '')

  //     if (targetIndex < 0) return msgs

  //     msgs.splice(targetIndex, 1)

  //     setMsgs((msgs) => [...msgs])
  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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
                  // onUpdate={onUpdate}
                  // onDelete={() => onDelete(x.id)}
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
