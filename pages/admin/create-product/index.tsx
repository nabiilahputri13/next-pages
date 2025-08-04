import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import ButtonBlack from '@/components/button-black'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { GetServerSidePropsContext } from 'next'
import { products } from '@/lib/db/schema'
import { db } from '@/lib/db'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await requireAdmin(context)
  if ('redirect' in auth) return auth

  const raw = await db.select().from(products)
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

export default function CreateProductPage() {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [image])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('label', label)
    formData.append('price', price)
    formData.append('description', description)
    if (image) formData.append('image', image)

    const res = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      toast.success('Product created!')
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } else {
      toast.error('Failed to create product')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
        <div>
          <label htmlFor="name" className="text-l font-semibold">Product name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="label" className="text-l font-semibold">Product label</label>
          <input
            type="text"
            placeholder="Product Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="border p-2 w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-l font-semibold">Product description</label>
          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border p-2 h-32 resize-y w-full mt-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="text-l font-semibold">Product price</label>
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
          <label htmlFor="image" className="text-l font-semibold">Product image</label>
          <div
            className="w-full border p-4 flex flex-col items-center mt-2"
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
                className="w-full h-70 object-cover"
              />
            ) : (
              <div className="w-full h-70 bg-gray-300 flex items-center justify-center">
                <span className="text-3xl text-white">+ Add Image</span>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              {image ? image.name : ''}
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
          Create Product
        </ButtonBlack>
      </form>
    </div>
  )
}
