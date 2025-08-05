// pages/admin/patterns.tsx
import ButtonBlack from '@/components/button-black'
import ButtonWhite from '@/components/button-white'
import { db } from '@/lib/db'
import { patterns } from '@/lib/db/schema'
import Image from 'next/image'
import router from 'next/router'
import toast from 'react-hot-toast'

export async function getServerSideProps() {
  const raw = await db.select().from(patterns)

  const data = raw.map((p) => ({
    ...p,
    createdAt: p.createdAt?.toISOString(), 
  }))

  return { props: { data } }
}

export default function patternsPage({ data }: { data: any[] }) {
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this pattern?')
    if (!confirmDelete) return

    const res = await fetch(`/api/patterns/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      alert('pattern deleted successfully')
      router.reload() // refresh the pattern list
    } else {
      alert('Failed to delete pattern')
    }
  }

  return (
    <section className="my-6 w-full mx-auto max-w-screen-2xl">
      <div className="p-8">
        {/* <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-6 w-full"> */}
          {/* <h1 className="text-2xl font-bold">Pattern List</h1>
          <ButtonBlack onClick={() => router.push('/admin/create-pattern')}>
            + Add New Pattern
          </ButtonBlack> */}
        {/* </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((pattern) => (
            <div key={pattern.id} className=" p-4 w-full">
              <div className="relative w-full h-120">
                            <Image
                              src={pattern.imageUrl}
                              alt={pattern.name}
                              fill
                              className="object-cover "
                            />
                          </div>
              <span className="text-xs bg-gray-200 px-2 py-1 mt-4 inline-block w-max">
                {pattern.label}
              </span>
              <h2 className="font-bold text-lg mt-2">{pattern.name}</h2>
              <h3 className="text-sm text-gray-700 line-clamp-2">{pattern.description}</h3>
              <p className="font-semibold mt-1">IDR{pattern.price.toLocaleString('id-ID')}</p>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 w-full">
                              <ButtonBlack className="w-full sm:w-1/2">+ Add to Cart</ButtonBlack>
                              <ButtonWhite className="w-full sm:w-1/2" onClick={() => router.push(`/find-pattern/${pattern.id}`)}>Details</ButtonWhite>
                            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}