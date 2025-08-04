// import { authOptions } from '@/lib/auth/options'
// import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
// import { getServerSession } from 'next-auth'

// export async function requireAdmin<T>(
//   context: GetServerSidePropsContext,
//   getProps: () => Promise<GetServerSidePropsResult<T>>
// ): Promise<GetServerSidePropsResult<T>> {
//   const session = await getServerSession(context.req, context.res, authOptions)

//   if (!session || session.user.role !== 'admin') {
//     return {
//       redirect: {
//         destination: '/unauthorized', // bisa juga ke /login
//         permanent: false,
//       },
//     }
//   }

//   return await getProps()
// }

import { getServerSession } from 'next-auth'
import { authOptions } from './options'
import { GetServerSidePropsContext } from 'next'

export async function requireAdmin(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}, // ✅ kosongin props supaya aman
  }
}
