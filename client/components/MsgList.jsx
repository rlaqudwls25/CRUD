import React, { useState } from 'react';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';

const UserIds = ['jin', 'tom'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];
const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    userId: getRandomUserId(),
    timestamp: 1234567890123 + i * 1000 * 60,
    text: `${i + 1} text mock`,
  }))
  .reverse();

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const [isEditId, setIsEditId] = useState(null);

  const onCreate = (text) => {
    const newmsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };

    setMsgs((msgs) => [newmsg, ...msgs]);
  };

  const onUpdate = (text, id) => {
    const targetIndex = msgs.findIndex((msg) => msg.id === id);
    if (targetIndex < 0) return msgs;
    const sliceMsg = msgs.splice(targetIndex, 1, {
      ...msgs[targetIndex],
      text,
    });
    setMsgs((msgs) => [...msgs, sliceMsg]);
    // doneEdit();
  };

  const onDelete = (id) => {
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsg = [...msgs];
      newMsg.splice(targetIdx, 1);
      return newMsg;
    });
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
            />
          ))}
      </ul>
    </>
  );
};

export default MsgList;
