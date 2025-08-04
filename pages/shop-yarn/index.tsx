import ButtonBlack from '@/components/button-black'
import ButtonWhite from '@/components/button-white'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import Image from 'next/image'
import router from 'next/router'

export async function getServerSideProps() {
  const raw = await db.select().from(products)

  const data = raw.map((p) => ({
    ...p,
    createdAt: p.createdAt?.toISOString(),
  }))

  return { props: { data } }
}

export default function ShopYarn({ data }: { data: any[] }) {
  return (
    <section className="my-6 w-full mx-auto max-w-screen-2xl">
      <div className="px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-6 w-full">
          {/* <h1 className="text-2xl font-bold">Product List</h1> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((product) => (
            <div key={product.id} className=" p-4 w-full">
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
              <h3 className="font-bold text-lg mt-2">{product.name}</h3>
              <h3 className="text-sm text-gray-700 line-clamp-2">{product.description}</h3>
              <p className="font-semibold mt-1">IDR{product.price.toLocaleString('id-ID')}</p>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 w-full">
                <ButtonBlack className="w-full sm:w-1/2">+ Add to Cart</ButtonBlack>
                <ButtonWhite className="w-full sm:w-1/2" onClick={() => router.push(`/shop-yarn/${product.id}`)}>Details</ButtonWhite>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
