// pages/admin/update-workshop/[id].tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import toast from 'react-hot-toast'
import ButtonBlack from '@/components/button-black'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { GetServerSidePropsContext } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await requireAdmin(context)
  if ('redirect' in auth) return auth

  const id = context.params?.id as string

  const raw = await db.select().from(workshops).where(eq(workshops.id, id))
  const workshop = raw[0]

  if (!workshop) {
    return { notFound: true }
  }

  return {
    props: {
      workshop: {
        ...workshop,
        date: workshop.date?.toISOString(),
        createdAt: workshop.createdAt?.toISOString(),
      },
    },
  }
}

export default function UpdateWorkshopPage({ workshop }: { workshop: any }) {
  const router = useRouter()

  const [name, setName] = useState(workshop.name || '')
  const [label, setLabel] = useState(workshop.label || '')
  const [description, setDescription] = useState(workshop.description || '')
  const [place, setPlace] = useState(workshop.place || '')
  const [date, setDate] = useState(workshop.date?.substring(0, 10) || '')
  const [price, setPrice] = useState(workshop.price.toString() || '')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(workshop.imageUrl || null)

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(workshop.imageUrl || null)
    }
  }, [image, workshop.imageUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('label', label)
    formData.append('description', description)
    formData.append('place', place)
    formData.append('date', date)
    formData.append('price', price)
    if (image) {
      formData.append('image', image)
    }

    const res = await fetch(`/api/workshops/${workshop.id}`, {
      method: 'PUT',
      body: formData,
    })

    if (res.ok) {
      toast.success('Workshop updated!')
      setTimeout(() => router.push('/admin/workshops'), 1500)
    } else {
      toast.error('Update failed')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Workshop</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
        <div>
          <label className="text-l font-semibold">Workshop Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label className="text-l font-semibold">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label className="text-l font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 h-32 resize-y w-full mt-2"
          />
        </div>

        <div>
          <label className="text-l font-semibold">Place</label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label className="text-l font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label className="text-l font-semibold">Price (IDR)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label className="text-l font-semibold">Workshop Image</label>
          <div
            className="w-full border p-4 flex flex-col items-center mt-2 cursor-pointer"
            onClick={() => document.getElementById('imageInput')?.click()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files?.[0]) {
                setImage(e.dataTransfer.files[0])
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-70 object-cover rounded"
              />
            ) : (
              <div className="w-full h-70 bg-gray-300 flex items-center justify-center">
                <span className="text-3xl text-white">+ Add Image</span>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              {image ? image.name : 'Click image to change'}
            </p>
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        <ButtonBlack type="submit" className="w-full">
          Update Workshop
        </ButtonBlack>
      </form>
    </div>
  )
}
