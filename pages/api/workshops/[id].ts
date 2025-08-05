import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import path from 'path'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid ID' })

  if (req.method === 'GET') {
    try {
      const data = await db.select().from(workshops).where(eq(workshops.id, id))
      if (!data.length) return res.status(404).json({ message: 'Workshop not found' })
      return res.status(200).json(data[0])
    } catch (err) {
      console.error('GET error:', err)
      return res.status(500).json({ error: 'Failed to fetch workshop' })
    }
  }

  if (req.method === 'PUT') {
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
    })

    try {
      const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err)
          else resolve([fields, files])
        })
      })

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
      const label = Array.isArray(fields.label) ? fields.label[0] : fields.label
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description
      const priceStr = Array.isArray(fields.price) ? fields.price[0] : fields.price
      const dateStr = Array.isArray(fields.date) ? fields.date[0] : fields.date
      const place = Array.isArray(fields.place) ? fields.place[0] : fields.place

      const price = parseInt(priceStr || '0')
      const date = dateStr ? new Date(dateStr) : undefined

      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
      let imageUrl: string | undefined

      if (imageFile) {
        const fileName = path.basename(imageFile.filepath)
        imageUrl = `/uploads/${fileName}`
      }

      if (!name || !label || !price || !date || !place) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      await db.update(workshops)
        .set({
          name,
          label,
          description,
          price,
          date,
          place,
          ...(imageUrl && { imageUrl }),
        })
        .where(eq(workshops.id, id))

      return res.status(200).json({ message: 'Workshop updated' })
    } catch (err) {
      console.error('Update error:', err)
      return res.status(500).json({ error: 'Failed to update workshop' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(workshops).where(eq(workshops.id, id))
      return res.status(200).json({ message: 'Workshop deleted' })
    } catch (err) {
      console.error('Delete error:', err)
      return res.status(500).json({ error: 'Failed to delete workshop' })
    }
  }

  return res.status(405).end()
}
