import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'
import { Hydrate } from '@tanstack/react-query'
import './index.scss'

const App = ({ Component, pageProps }) => {
  const clientRef = useRef(null)

  const getClient = () => {
    if (!clientRef.current) {
      clientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
      return clientRef.current
    }
  }
  return (
    <QueryClientProvider client={getClient()}>
      <Hydrate state={pageProps.dehydratedState}>
        {/* server side 에서 받아온 property를 data가 없고 html만 남아있는 */}
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx)
  return { pageProps }
}

export default App
