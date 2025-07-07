'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Workshop', href: '/workshop' },
    { name: 'Shop Yarn', href: '/shop-yarn' },
    { name: 'Find Pattern', href: '/find-pattern' }, 
  ]

  return (
    <ul className="flex font-semibold space-x-4">
      {navItems.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={`transition-colors duration-200 ${
              pathname === item.href ? 'text-stone-400' : 'hover:text-stone-400'
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}

      {session?.user && (
        <>
          <li className="text-stone-400">Hi, {session.user.name?.split(' ')[0]}</li>
          <li>
            <button
              onClick={() => signOut()}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </ul>
  )
}

export default Navbar
