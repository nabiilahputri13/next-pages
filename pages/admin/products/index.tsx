// pages/admin/products.tsx
import ButtonBlack from '@/components/button-black'
import ButtonWhite from '@/components/button-white'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import Image from 'next/image'
import router from 'next/router'
import toast from 'react-hot-toast'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { GetServerSidePropsContext } from 'next'

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


export default function ProductsPage({ data }: { data: any[] }) {
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this product?')
    if (!confirmDelete) return

    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      toast.success('Product deleted successfully!')
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } else {
      toast.error('Failed to delete product')
    }
  }

  return (
    <section className="my-6 px-4 mx-auto max-w-screen-xl">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-6 w-full">
          <h1 className="text-2xl font-bold">Product List</h1>
          <ButtonBlack onClick={() => router.push('/admin/create-product')}>
            + Add New Product
          </ButtonBlack>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((product) => (
            <div key={product.id} className="border p-4 w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover mb-2"
              />
              <span className="text-xs bg-gray-200 px-2 py-1 mt-4 inline-block w-max">
                {product.label}
              </span>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <h3 className="text-sm text-gray-700 line-clamp-2">{product.description}</h3>
              <p className="text-gray-600">Rp{product.price}</p>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 w-full">
                <ButtonBlack
                  className="w-full sm:w-1/2"
                  onClick={() => router.push(`/admin/update-product/${product.id}`)}
                >
                  Update
                </ButtonBlack>
                <ButtonWhite
                  className="w-full sm:w-1/2"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </ButtonWhite>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
