import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import RootLayout from '@/layout'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const path = router.pathname
  const noLayoutRoutes = ['/register', '/login', '/checkout']
  const hideLayout = noLayoutRoutes.includes(path)
  const metaTitle = path === '/' ? 'home' : path.replace('/', '')

  return (
    <SessionProvider session={session}>
      <RootLayout metaTitle={metaTitle} hideLayout={hideLayout}>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  )
}
