import MsgList from '../components/MsgList'
import { fetcher } from '../fetcher'
import { Message, Users, METHOD } from '../types/types'
import { GET_MESSAGES } from '../graphql/messages'
import { GET_USERS } from '../graphql/user'

const Home = ({
  getSMsgs,
  getUsers,
}: {
  getSMsgs: Message[]
  getUsers: Users
}) => {
  return <MsgList getSMsgs={getSMsgs} getUsers={getUsers} />
}

export default Home

export const getServerSideProps = async () => {
  const getSMsgs = await fetcher(GET_MESSAGES)
  const getUsers = await fetcher(GET_USERS)

  return { props: { getSMsgs, getUsers } }
}
