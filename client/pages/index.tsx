import MsgList from '../components/MsgList';
import fetcher from '../fetcher';
// import './index.jsx';
import { Message, Users, METHOD } from '../types/types';

const Home = ({
  getSMsgs,
  getUsers,
}: {
  getSMsgs: Message[];
  getUsers: Users;
}) => {
  return <MsgList getSMsgs={getSMsgs} getUsers={getUsers} />;
};

export default Home;

export const getServerSideProps = async () => {
  const getSMsgs = await fetcher(METHOD.GET, '/messages');
  const getUsers = await fetcher(METHOD.GET, '/user');

  return { props: { getSMsgs, getUsers } };
};
