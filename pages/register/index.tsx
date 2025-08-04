'use client'

import { useState } from 'react'
import ButtonBlack from '@/components/button-black'
import ButtonWhite from '@/components/button-white'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function Register() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!username || !password || !confirmPassword) {
    setError('Please fill in all fields.')
    return
  }

  if (password.length < 8) {
    setError('Password must be at least 8 characters.')
    return
  }

  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  if (!hasLetter || !hasNumber) {
    setError('Password must contain both letters and numbers.')
    return
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  setError('')

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Registration failed.')
      return
    }

    toast.success('Registration successful!')
    setTimeout(() => { 
      router.push('/login')
    }, 2000)
  } catch (err) {
    console.error(err)
    setError('Something went wrong.')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-black text-white p-10 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">Start your yarn journey with YARNIT!</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 text-black rounded bg-white focus:outline-none"
              placeholder="Create username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-black rounded bg-white focus:outline-none"
              placeholder="Create password"
            />
            <p className="text-xs text-gray-400 mt-1">
            Password must be at least 8 characters and contain letters and numbers.
            </p>

          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1">
              Retype Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 text-black rounded bg-white focus:outline-none"
              placeholder="Retype password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div>
            <ButtonBlack type="submit" className="w-full mt-5 justify-center rounded-xl border-white">
              Register
            </ButtonBlack>
          </div>
        </form>
      </div>
    </div>
  )
}
