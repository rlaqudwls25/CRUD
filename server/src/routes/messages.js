import { readDB, writeDB } from '../dbController.js';
import { v4 } from 'uuid';

const getMsgs = () => readDB('messages');
const setMsgs = () => writeDB('messages');

const messagesRoute = [
  {
    method: 'get',
    route: '/messages',
    handler: (req, res) => {
      const mags = getMsgs();
      res.send(mags);
    },
  },

  {
    method: 'get',
    route: '/messages/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();

        const msg = msgs.find((msg) => msg.id === id);

        res.send(msg);
      } catch (error) {
        console.log(error);
      }
    },
  },
  {
    method: 'post',
    route: '/messages',
    handler: ({ body }, res) => {
      try {
        const msgs = getMsgs();
        const newMsg = {
          id: v4(),
          text: body.text,
          userId: body.userId,
          time: Date.now(),
        };
        msgs.unshift(newMsg);
        setMsgs(msgs);
        res.send(newMsg);
      } catch (error) {
        console.log(error);
      }
    },
  },
  {
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();

        const targetIndex = msgs.findIndex((msg) => msg.id === id);

        if (targetIndex < 0) throw `수정할 메시지가 없습니다.`;
        if (msgs[targetIndex].userId !== body.userId)
          throw `사용자가 다릅니다.`;

        msgs.splice(targetIndex, 1, {
          ...msgs[targetIndex],
          text: body.text,
        });

        setMsgs(msgs);
        res.send(msgs);
      } catch (error) {
        res.status(500).send({ error: error });
      }
    },
  },
  {
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        if (targetIndex < 0) throw `수정할 메시지가 없습니다.`;
        if (msgs[targetIndex].userId !== body.userId)
          throw `사용자가 다릅니다.`;
        const msgs = getMsgs();

        const targetIndex = msgs.findIndex((msg) => msg.id === id);

        msgs.splice(targetIndex, 1);
        setMsgs(msgs);
        res.send(id);
      } catch (error) {}
    },
  },
];

export default messagesRoute;
