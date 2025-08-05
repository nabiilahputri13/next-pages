import { GetServerSideProps } from 'next'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import Image from 'next/image'
import { eq } from 'drizzle-orm'


export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string

  const result = await db.select().from(products).where(eq(products.id, id))
  const product = result[0]

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

export default function productDetail({ product }: { product: any }) {
  return (
    <div className="max-w-screen-lg mx-auto p-6 flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-1/2 relative h-[400px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="w-full lg:w-1/2">
        <span className="px-2 py-1 border text-xs rounded">Intermediate</span>
        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

        {/* ⭐ Rating Stars */}
        <div className="flex items-center mt-2 mb-4 text-3xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < product.rating ? 'text-yellow-500' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>

        <p className="text-gray-700 mb-4">{product.description}</p>

       

        <button className="bg-black text-white w-full py-3 font-semibold">
          BUY PRODUCT FOR IDR{product.price.toLocaleString('id-ID')}
        </button>
        <p className="text-xs text-center text-gray-500 mt-1">
          After payment, product will automatically be downloaded in the page.
        </p>
      </div>

      <hr className="my-6 border-t border-black" />

      <section>
        <div className="flex flex-col justify-center items-center mb-6 w-full">
  <h1 className="text-2xl font-bold">More Like</h1>
  <h1 className="text-2xl font-bold text-orange-900 mt-2">{product.name}</h1>
</div>

      </section>
    </div>
  )
}
