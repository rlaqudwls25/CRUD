import React, { useState } from 'react';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';

const UserIds = ['jin', 'tom'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];
const originMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    userId: getRandomUserId(),
    timestamp: 1234567890123 + i * 1000 * 60,
    text: `${i + 1} text mock`,
  }))
  .reverse();

const MsgList = () => {
  const [msgs, setMsg] = useState(originMsgs);

  const onCreate = (text) => {
    const newmsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsg((msgs) => [newmsg, ...msgs]);
  };

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem key={x.id} {...x} />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
