import MsgList from '../components/MsgList'
import { fetcher } from '../fetcher'
import { Message, Users } from '../types/types'
import { GET_MESSAGES } from '../graphql/messages'
import { GET_USERS } from '../graphql/user'

const Home = ({ smsgs }: { smsgs: Message[] }) => {
  return <MsgList smsgs={smsgs} />
}

export default Home

export const getServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES)
  // const { users } = await fetcher(GET_USERS)

  // const [{ messages: smsgs }, { users }] = await Promise.all([
  //   fetcher(GET_MESSAGES),
  //   fetcher(GET_USERS),
  // ])

  return { props: { smsgs } }
}
