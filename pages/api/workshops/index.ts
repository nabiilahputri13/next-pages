import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import path from 'path'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const form = formidable({
      uploadDir: './public/uploads',
      keepExtensions: true,
    })

    const [fields, files] = await new Promise<any[]>((resolve, reject) => {
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
    const date = new Date(dateStr || '')

    const image = Array.isArray(files.image) ? files.image[0] : files.image

    if (!name || !label || !price || !image || !dateStr || !place) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' })
    }

    const fileName = path.basename(image.filepath)
    const imageUrl = `/uploads/${fileName}`

    await db.insert(workshops).values({
      name,
      label,
      price,
      imageUrl,
      description,
      date,
      place,
    })

    return res.status(200).json({ message: 'Workshop created' })

  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ error: 'Upload failed' })
  }
}
