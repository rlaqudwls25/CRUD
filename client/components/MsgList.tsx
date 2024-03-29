import React, { useEffect, useState, useRef } from 'react'
import { Message, MsgQueryData } from '../types/types'
import { useRouter } from 'next/router'
import { fetcher, QueryKeys, findMsgIndex } from '../fetcher'
import {
  QueryClient,
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

const MsgList = ({ smsgs }: { smsgs: Message[] }) => {
  const [msgs, setMsgs] = useState<Object[]>([{ messages: smsgs }])
  const [isEditId, setIsEditId] = useState<string | null>(null)
  const fetchMoreElement = useRef<HTMLDivElement>(null)
  const intersecting = useInfiniteScroll(fetchMoreElement)

  const {
    query: { userId = '' },
  } = useRouter()
  const client = useQueryClient()

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    [QueryKeys.MESSAGES],
    ({ pageParam = '' }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: (res) => {
        return res.messages?.[res.messages.length - 1]?.id
      },
    }
  )

  // const data2 = QueryClient.

  useEffect(() => {
    if (!data?.pages) return
    // const mergedMsgs = data.pages.flatMap((d) => d.messages)
    setMsgs(data.pages)
  }, [data?.pages])

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage()
  }, [intersecting, hasNextPage])

  const { mutate: onCreate } = useMutation(
    ({ text }: { text: string }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData<MsgQueryData>([QueryKeys.MESSAGES], (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' }
          return {
            pageParams: old?.pageParams,
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
          }
        })
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
        doneEdit()
        client.setQueryData<MsgQueryData>([QueryKeys.MESSAGES], (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' }
          const { pageId, msgIdx } = findMsgIndex(old.pages, updateMessage.id)
          if (pageId < 0 || msgIdx < 0) return old
          const newPages = [...old.pages]
          newPages[pageId] = { messages: [...newPages[pageId].messages] }
          newPages[pageId].messages.splice(msgIdx, 1, updateMessage)
          return {
            pageParams: old.pageParams,
            pages: newPages,
          }
        })
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
        client.setQueryData<MsgQueryData>([QueryKeys.MESSAGES], (old) => {
          if (!old) return { pages: [{ messages: [] }], pageParams: '' }
          const { pageId, msgIdx } = findMsgIndex(old.pages, deleteId)
          if (pageId < 0 || msgIdx < 0) return old
          const newPages = [...old.pages]
          newPages[pageId] = { messages: [...newPages[pageId].messages] }
          newPages[pageId].messages.splice(msgIdx, 1)

          return {
            pageParams: old.pageParams,
            pages: newPages,
          }
        })
      },
      onError: () => {
        console.error('에러 발생')
      },
    }
  )

  const doneEdit = () => setIsEditId(null)

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <MsgInput mutate={onCreate} />
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
              />
            ))
          )}
        </ul>
        <div ref={fetchMoreElement} />
      </>
    </>
  )
}

export default MsgList
