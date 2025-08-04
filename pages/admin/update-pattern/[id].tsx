import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/lib/db'
import { patterns } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import toast from 'react-hot-toast'
import ButtonBlack from '@/components/button-black'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { GetServerSidePropsContext } from 'next'


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await requireAdmin(context)
  if ('redirect' in auth) return auth

  const raw = await db.select().from(patterns)
  const data = raw.map((p) => ({
    ...p,
    createdAt: p.createdAt?.toISOString(),
  }))

  return {
    props: {
      data, // ✅ cukup kirim datanya aja
    },
  }
}

export default function UpdatepatternPage({ pattern }: { pattern: any }) {
  const router = useRouter()
  const [name, setName] = useState(pattern.name || '')
  const [label, setLabel] = useState(pattern.label || '')
  const [price, setPrice] = useState(pattern.price.toString() || '')
  const [description, setDescription] = useState(pattern.description || '')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(pattern.imageUrl || null)

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(pattern.imageUrl || null)
    }
  }, [image, pattern.imageUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('label', label)
    formData.append('description', description)
    formData.append('price', price)
    if (image) {
      formData.append('image', image)
    }

    const res = await fetch(`/api/patterns/${pattern.id}`, {
      method: 'PUT',
      body: formData,
    })

    if (res.ok) {
      toast.success('Pattern updated!')
      setTimeout(() => router.push('/admin/patterns'), 1500)
    } else {
      toast.error('Update failed')
      
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update pattern</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
        <div>
          <label htmlFor="name" className="text-l font-semibold">Pattern name</label>
          <input
            type="text"
            placeholder="Pattern Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="label" className="text-l font-semibold">Pattern label</label>
          <input
            type="text"
            placeholder="Pattern Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-l font-semibold">Pattern description</label>
          <textarea
            placeholder="Pattern Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 h-32 resize-y w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="text-l font-semibold">Pattern price</label>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="image" className="text-l font-semibold">Pattern image</label>
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
                className="w-full h-130 object-cover"
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
          Update pattern
        </ButtonBlack>
      </form>
    </div>
  )
}