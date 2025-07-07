import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import RootLayout from '@/layout'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  const router = useRouter()
  const metaTitle = router.pathname === '/' ? 'home' : router.pathname.replace('/', '')

  return (
    <SessionProvider session={session}>
    <RootLayout metaTitle={metaTitle}>
      <Component {...pageProps}/>
    </RootLayout>
    </SessionProvider>
  )
}
