import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';
import fetcher from '../fetcher';

const UserIds = ['jin', 'tom'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];
// const originalMsgs = Array(50)
//   .fill(0)
//   .map((_, i) => ({
//     id: i + 1,
//     userId: getRandomUserId(),
//     timestamp: 1234567890123 + i * 1000 * 60,
//     text: `${i + 1} text mock`,
//   }))
//   .reverse();

const MsgList = () => {
  const [msgs, setMsgs] = useState([]);
  const [isEditId, setIsEditId] = useState(null);
  const {
    query: { userId = '' },
  } = useRouter();

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    const msgs = await fetcher('get', '/messages');

    setMsgs(msgs);
  };

  const onCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });

    console.log('newMsg', newMsg);

    if (!newMsg) throw Error('something wrong');
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });

    console.log('newmsg', newMsg);

    const targetIndex = msgs.findIndex((msg) => msg.id === id);
    if (targetIndex < 0) return msgs;

    msgs.splice(targetIndex, 1, newMsg);

    console.log(msgs);

    setMsgs(msgs);

    doneEdit();
  };

  const onDelete = (id) => {
    const targetIndex = msgs.findIndex((msg) => msg.id === id);

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
            />
          ))}
      </ul>
    </>
  );
};

export default MsgList;
