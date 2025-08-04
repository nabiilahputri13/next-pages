'use client'

import { useState } from 'react'
import ButtonBlack from '@/components/button-black'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      toast.success('Login successful!')
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      console.error(err)
      setError('Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-black text-white p-10 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome back to YARNIT!</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 text-black rounded bg-white focus:outline-none"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-black rounded bg-white focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <ButtonBlack type="submit" className="w-full mt-5 justify-center rounded-xl border-white">Login</ButtonBlack>
          </div>
        </form>

        <p className="text-center text-sm mt-8">
          Haven’t had an account? <a href="/register" className="underline hover:text-gray-300">Register</a>
        </p>
      </div>
    </div>
  )
}
