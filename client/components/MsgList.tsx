import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
import fetcher from '../fetcher';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { Message, Users } from '../types/types';

const MsgList = ({
  getSMsgs,
  getUsers,
}: {
  getSMsgs: Message[];
  getUsers: Users;
}) => {
  const [msgs, setMsgs] = useState<Message[]>(getSMsgs);
  const [isEditId, setIsEditId] = useState<string | null>(null);
  const [next, setNext] = useState(true);
  const {
    query: { userId = '' },
  } = useRouter();
  const fetchMoreElement = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreElement);

  useEffect(() => {
    if (intersecting && next) {
      getMessages();
    }
  }, [intersecting]);

  const getMessages = async () => {
    const newMsgs = await fetcher('get', '/messages', {
      params: { cursor: msgs[msgs.length - 1]?.id || '' },
    });

    if (newMsgs.length === 0) {
      setNext(false);
      return;
    }

    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  const onCreate = async (text: string) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });

    if (!newMsg) throw Error('something wrong');
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text: string, id?: string) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });

    const targetIndex = msgs.findIndex((msg) => msg.id === id);
    if (targetIndex < 0) return msgs;

    msgs.splice(targetIndex, 1, newMsg);

    setMsgs((msgs) => [...msgs]);

    doneEdit();
  };

  const onDelete = async (id: string) => {
    const deleteId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });

    const targetIndex = msgs.findIndex((msg) => msg.id === deleteId + '');

    if (targetIndex < 0) return msgs;

    msgs.splice(targetIndex, 1);

    setMsgs((msgs) => [...msgs]);
  };

  const doneEdit = () => setIsEditId(null);

  return (
    <>
      <MsgInput mutate={onCreate} />
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
              user={getUsers[x.userId]}
            />
          ))}
      </ul>
      <div ref={fetchMoreElement} />
    </>
  );
};

export default MsgList;