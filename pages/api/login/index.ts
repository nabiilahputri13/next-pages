import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { usersTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))

    const user = users[0]

    if (!user) {
      return res.status(404).json({ error: 'Username does not exist' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password is incorrect' })
    }

    return res.status(200).json({ message: 'Login successful' })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
