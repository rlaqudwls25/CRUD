import MsgList from '../components/MsgList'
import { fetcher } from '../fetcher'
import { Message, Users, METHOD } from '../types/types'
import { GET_MESSAGES } from '../graphql/messages'
import { GET_USERS } from '../graphql/user'

const Home = ({ smsgs, users }: { smsgs: Message[]; users: Users }) => {
  return <MsgList smsgs={smsgs} users={users} />
}

export default Home

export const getServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES)
  const { users } = await fetcher(GET_USERS)

  console.log('messages', { smsgs })
  console.log('users', { users })

  return { props: { smsgs, users } }
}
