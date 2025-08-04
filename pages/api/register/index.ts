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
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.insert(usersTable).values({
      username,
      password: hashedPassword,
    })

    return res.status(200).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
