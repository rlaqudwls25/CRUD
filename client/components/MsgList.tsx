import React, { useEffect, useState, useRef } from 'react'
import { Message, Users, METHOD } from '../types/types'
import { useRouter } from 'next/router'
import { fetcher, QueryKeys } from '../fetcher'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from '../graphql/messages'
import MsgItem from './MsgItem'
import MsgInput from './MsgInput'
import Loading from './Loading'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

const MsgList = ({ smsgs, users }: { smsgs: Message[]; users: Users }) => {
  const [msgs, setMsgs] = useState<Object[]>([{ messages: smsgs }])
  const [isEditId, setIsEditId] = useState<string | null>(null)
  const fetchMoreElement = useRef<HTMLDivElement>(null)
  const intersecting = useInfiniteScroll(fetchMoreElement)

  // console.log('msgs', msgs)

  const {
    query: { userId = '' },
  } = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const client = useQueryClient()

  const { mutate: onCreate } = useMutation(
    ({ text }: { text: string }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        console.log(createMessage)
        client.setQueriesData([QueryKeys.MESSAGES], (old: any) => {
          console.log('old', old)
          // setLoading(true)
          return {
            messages: [createMessage, ...old.messages],
          }
        })
        // setLoading(false)
      },
      // onError: () => {
      //   console.error('에러 발생')
      // },
    }
  )

  const { mutate: onUpdate } = useMutation(
    ({ text, id }: { text: string; id: number }) =>
      fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        doneEdit()
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
        setLoading(false)
      },
      onError: () => {
        console.error('에러 발생')
        setLoading(false)
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

  const { data, error, isError, hasNextPage, fetchNextPage } = useInfiniteQuery(
    [QueryKeys.MESSAGES],
    ({ pageParam = '' }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: (res) => {
        return res.messages?.[res.messages.length - 1]?.id
      },
    }
  )

  useEffect(() => {
    if (!data?.pages) return
    // const mergedMsgs = data.pages.flatMap((d) => d.messages)
    // console.log('data.pages', data.pages)
    setMsgs(data.pages)
  }, [data?.pages])

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage()
  }, [intersecting, hasNextPage])

  const doneEdit = () => setIsEditId(null)

  return (
    <>
      <MsgInput mutate={onCreate} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ul className="messages">
            {msgs?.map(({ messages }: any) =>
              messages?.map((x: any) => (
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
              ))
            )}
          </ul>
          <div ref={fetchMoreElement} />
        </>
      )}
    </>
  )
}

export default MsgList
