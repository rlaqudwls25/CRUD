import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRef } from 'react'
import './index.scss'

const App = ({ Component, pageProps }) => {
  const clientRef = useRef(null)

  const getClient = () => {
    if (!clientRef.current) {
      clientRef.current = new QueryClient()
      return clientRef.current
    }
  }
  return (
    <QueryClientProvider client={getClient()}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx)
  return { pageProps }
}

export default App
