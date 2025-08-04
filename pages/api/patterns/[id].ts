import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import path from 'path'
import { db } from '@/lib/db'
import { patterns } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    const data = await db.select().from(patterns).where(eq(patterns.id, id as string))
    if (!data.length) return res.status(404).json({ message: 'pattern not found' })
    return res.status(200).json(data[0])
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
      const price = parseInt(priceStr || '0')

      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
      let imageUrl: string | undefined

      if (imageFile) {
        const fileName = path.basename(imageFile.filepath)
        imageUrl = `/uploads/${fileName}`
      }

      await db.update(patterns)
        .set({
          name,
          label,
          description,
          price,
          ...(imageUrl && { imageUrl }), // only update image if uploaded
        })
        .where(eq(patterns.id, id as string))

      return res.status(200).json({ message: 'pattern updated' })
    } catch (err) {
      console.error('Update error:', err)
      return res.status(500).json({ error: 'Failed to update pattern' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(patterns).where(eq(patterns.id, id as string))
      return res.status(200).json({ message: 'Deleted' })
    } catch (err) {
      return res.status(500).json({ error: 'Delete failed' })
    }
  }

  return res.status(405).end()
}
