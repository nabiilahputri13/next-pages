'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const Navbar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Workshop', href: '/workshop' },
    { name: 'Shop Yarn', href: '/shop-yarn' },
    { name: 'Find Pattern', href: '/find-pattern' },
    { name: 'Notes', href: '/notes/server' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="w-full bg-black text-white py-4">
      <div className="w-full grid grid-cols-3 items-center px-6">
        {/* Left (kosong tapi ambil ruang untuk center balance) */}
        <div></div>

        {/* Center navItems */}
        <ul className="flex justify-center space-x-6 font-semibold text-l tracking-wide">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-stone-400'
                    : 'hover:text-stone-400'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Cart + Profile */}
        <div className="flex justify-end items-center space-x-4 font-semibold text-l tracking-wide">
          {session?.user && (
            <>
              <Link href="/cart" className="hover:opacity-80">
                <img
                  src="https://img.icons8.com/?size=100&id=zhda2EVBCvHY&format=png&color=ffffff"
                  alt="Cart"
                  className="w-6 h-6"
                />
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hover:opacity-80 flex items-center"
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=ffffff"
                    alt="Profile"
                    className="w-6 h-6"
                  />
                  <span className="ml-2">
                    Hi, {session.user.name?.split(' ')[0]}!
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-black z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold">{session.user.name}</p>
                      <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
