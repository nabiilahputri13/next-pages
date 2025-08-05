// pages/admin/workshops.tsx
import ButtonBlack from '@/components/button-black'
import ButtonWhite from '@/components/button-white'
import { db } from '@/lib/db'
import { workshops } from '@/lib/db/schema'
import Image from 'next/image'
import router from 'next/router'
import toast from 'react-hot-toast'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { GetServerSidePropsContext } from 'next'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await requireAdmin(context)
  if ('redirect' in auth) return auth

  const raw = await db.select().from(workshops)
  const data = raw.map((w) => ({
    ...w,
    createdAt: w.createdAt?.toISOString(),
    date: w.date?.toISOString(),
  }))

  return {
    props: {
      data,
    },
  }
}

export default function WorkshopsPage({ data }: { data: any[] }) {
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this workshop?')
    if (!confirmDelete) return

    const res = await fetch(`/api/workshops/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      toast.success('Workshop deleted successfully!')
      setTimeout(() => {
        router.push('/admin/workshops')
      }, 1500)
    } else {
      toast.error('Failed to delete workshop')
    }
  }

  return (
    <section className="my-6 px-4 mx-auto max-w-screen-xl">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-6 w-full">
          <h1 className="text-2xl font-bold">Workshop List</h1>
          <ButtonBlack onClick={() => router.push('/admin/create-workshop')}>
            + Add New Workshop
          </ButtonBlack>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((workshop) => (
            <div key={workshop.id} className="border p-4 w-full">
              <Image
                src={workshop.imageUrl}
                alt={workshop.name}
                width={300}
                height={300}
                className="w-full h-64 object-cover mb-2"
              />
              <span className="text-xs bg-gray-200 px-2 py-1 mt-4 inline-block w-max">
                {workshop.label}
              </span>
              <h2 className="font-bold text-lg mt-2">{workshop.name}</h2>
              <h3 className="text-sm text-gray-700 line-clamp-2">{workshop.description}</h3>
              
              <p className="font-semibold mt-1">IDR{workshop.price.toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-500 mt-1">
                📍 {workshop.place}
              </p>
              <p className="text-sm text-gray-500">
                📅 {format(new Date(workshop.date), "EEEE, MMMM do yyyy", { locale: id })}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 w-full">
                <ButtonBlack
                  className="w-full sm:w-1/2"
                  onClick={() => router.push(`/admin/update-workshop/${workshop.id}`)}
                >
                  Update
                </ButtonBlack>
                <ButtonWhite
                  className="w-full sm:w-1/2"
                  onClick={() => handleDelete(workshop.id)}
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
