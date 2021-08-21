import React from 'react';
import MsgItem from './MsgItem';

const UserIds = ['jin', 'tom'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];
const msgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    userId: getRandomUserId(),
    timestamp: 1234567890123 + i * 1000 * 60,
    text: `${i + 1} text mock`,
  }))
  .reverse();

const MsgList = () => {
  return (
    <ul className="messages">
      {msgs.map((x) => (
        <MsgItem key={x.id} {...x} />
      ))}
    </ul>
  );
};

export default MsgList;
