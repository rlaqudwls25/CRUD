import MsgList from '../components/MsgList'
import { fetcher } from '../fetcher'
import { Message, Users } from '../types/types'
import { GET_MESSAGES } from '../graphql/messages'
import { GET_USERS } from '../graphql/user'

const Home = ({ smsgs }: { smsgs: Message[] }) => {
  return <MsgList smsgs={smsgs} />
}

export default Home

/**
 * seo에 필요한 페이지면 getServerSideProps 사용 다만 남발하면 서버가 모든 요청을 계산하고
 * 캐시가 힘들기에 비효율적이다/
 */
export const getServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES)
  // const { users } = await fetcher(GET_USERS)

  // const [{ messages: smsgs }, { users }] = await Promise.all([
  //   fetcher(GET_MESSAGES),
  //   fetcher(GET_USERS),
  // ])

  return { props: { smsgs } }
}
