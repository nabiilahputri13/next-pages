import { GetServerSideProps } from 'next'
import { db } from '@/lib/db'
import { patterns } from '@/lib/db/schema'
import Image from 'next/image'
import { eq } from 'drizzle-orm'


export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id as string

  const result = await db.select().from(patterns).where(eq(patterns.id, id))
  const pattern = result[0]

  if (!pattern) {
    return { notFound: true }
  }

  return {
    props: {
      pattern: {
        ...pattern,
        createdAt: pattern.createdAt?.toISOString(),
      },
    },
  }
}

export default function PatternDetail({ pattern }: { pattern: any }) {
  return (
    <div className="max-w-screen-lg mx-auto p-6 flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-1/2 relative h-[400px]">
        <Image
          src={pattern.imageUrl}
          alt={pattern.name}
          fill
          className="object-cover rounded"
        />
        <p className="text-sm mt-2 text-center">Pattern by: Claire J</p>
      </div>

      <div className="w-full lg:w-1/2">
        <span className="px-2 py-1 border text-xs rounded">Intermediate</span>
        <h1 className="text-3xl font-bold mt-2">{pattern.name}</h1>

        {/* ⭐ Rating Stars */}
        <div className="flex items-center mt-2 mb-4 text-3xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < pattern.rating ? 'text-yellow-500' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>

        <p className="text-gray-700 mb-4">{pattern.description}</p>

          <hr className="my-6 border-t border-black" />

        <div className="mb-4">
          <p className="font-bold text-sm text-orange-900 mb-1">Recommended yarn</p>
          <p>Designated wool</p>
          <p>Soft Trope</p>
          <p>Back to Basic All Cotton</p>
        </div>

        <div className="mb-6">
          <p className="font-bold text-sm text-orange-900 mb-1">Colors used</p>
          <div className="flex items-center gap-4">
            <div className="w-5 h-5  bg-[#C3BC8E]" />
            <div className="w-5 h-5  bg-[#D77F32]" />
          </div>
        </div>

        <button className="bg-black text-white w-full py-3 font-semibold">
          BUY PATTERN FOR IDR{pattern.price.toLocaleString('id-ID')}
        </button>
        <p className="text-xs text-center text-gray-500 mt-1">
          After payment, pattern will automatically be downloaded in the page.
        </p>
      </div>

      <hr className="my-6 border-t border-black" />

      <section>
        <div className="flex flex-col sm:flex-row sm:justify-center items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">More Like</h1>
          <h1 className="text-2xl font-bold text-orange-900">{pattern.name}</h1>
        </div>
      </section>
    </div>
  )
}
