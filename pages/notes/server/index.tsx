import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"

type ListNotes = {
    id: string
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

export const getServerSideProps = (async () => {
    const notes = await fetch('https://service.pace11.my.id/api/notes').then(
        (res) => res.json(),
    )
    return {
        props: { notes }
    }
}) satisfies GetServerSideProps<{ notes: Notes }>

export default function NoteServerPage( { notes }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return ( 
        <div className="container mx-auto p-4">
    <div className="grid grid-cols-4 gap-4">
        {notes?.data.map((note: ListNotes) => (
            <Link 
            href={`/notes/server/${note.id}`}
            key={ note.id } 
            className="p-4 bg-white shadow-sm rounded">
                <h1>{ note.title }</h1>
                <p>{ note.description} </p>
            </Link>
        ))}
    </div>
    </div>
    )
}