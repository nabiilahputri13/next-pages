import { GetServerSideProps, InferGetServerSidePropsType } from "next"

type ListNotes = {
  id: number
  title: string
  description: string
  created_at: string
  updated_at: string
}

type Notes = {
  status: string
  message: string
  data: ListNotes[]
}

export const getServerSideProps: GetServerSideProps<{ note: ListNotes | null }> = async (context) => {
  const { id } = context.params || {}

  try {
    const res = await fetch("https://service.pace11.my.id/api/notes")

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText)
      return { notFound: true }
    }

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      const raw = await res.text()
      console.error("Invalid content:", raw)
      return { notFound: true }
    }

    const json: Notes = await res.json()

    const note = json.data.find((item) => item.id.toString() === id?.toString()) || null

    if (!note) {
      return { notFound: true }
    }

    return {
      props: { note }
    }
  } catch (error) {
    console.error("Error fetching note:", error)
    return { notFound: true }
  }
}

export default function NoteServerPage({
  note
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!note) {
    return <div>Note not found.</div>
  }

  return (
    <div className="container mx-auto p-4">
    <div className="p-4 bg-white shadow-sm rounded">
      <h1 className="text-xl font-bold">{note.title}</h1>
      <p>{note.description}</p>
       <p className="text-sm text-gray-500 mt-2">
          Created at: {note.created_at}
        </p>
        <p className="text-sm text-gray-500">Updated at: {note.updated_at}</p>

    </div>
    </div>
  )
}