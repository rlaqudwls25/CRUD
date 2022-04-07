import { readDB } from '../dbController.js';

const getUsers = () => readDB('user');

const userRoute = [
  {
    method: 'get',
    route: '/user',
    handler: (req, res) => {
      const users = getUsers();
      res.send(users);
    },
  },

  {
    method: 'get',
    route: '/user/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const users = getUsers();
        const user = users[id];
        if (!user) throw Error`user가 없습니다`;

        res.send(user);
      } catch (error) {
        res.status(500).send({ error: error });
      }
    },
  },
];

export default userRoute;
