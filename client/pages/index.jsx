import React from 'react';
import MsgList from '../components/MsgList';
import fetcher from '../fetcher';
import './index.jsx';

const Home = ({ getSMsgs, getUsers }) => {
  return <MsgList getSMsgs={getSMsgs} getUsers={getUsers} />;
};

export default Home;

export const getServerSideProps = async () => {
  const getSMsgs = await fetcher('get', '/messages');
  const getUsers = await fetcher('get', '/user');

  return { props: { getSMsgs, getUsers } };
};
