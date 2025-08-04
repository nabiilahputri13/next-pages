import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import toast from 'react-hot-toast'
import ButtonBlack from '@/components/button-black'

export async function getServerSideProps(context: any) {
  const { id } = context.params
  const raw = await db.select().from(products).where(eq(products.id, id))
  const product = raw[0]

  if (!product) {
    return { notFound: true }
  }

  return {
    props: {
      product: {
        ...product,
        createdAt: product.createdAt?.toISOString(),
      },
    },
  }
}

export default function UpdateProductPage({ product }: { product: any }) {
  const router = useRouter()
  const [name, setName] = useState(product.name || '')
  const [label, setLabel] = useState(product.label || '')
  const [price, setPrice] = useState(product.price.toString() || '')
  const [description, setDescription] = useState(product.description || '')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.imageUrl || null)

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(product.imageUrl || null)
    }
  }, [image, product.imageUrl])

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

    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      body: formData,
    })

    if (res.ok) {
      toast.success('Product updated!')
      setTimeout(() => router.push('/admin/products'), 1500)
    } else {
      toast.error('Update failed')
      
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Product</h1>
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
          Update Product
        </ButtonBlack>
      </form>
    </div>
  )
}