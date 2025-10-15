import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Notes() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const { data, error } = await supabase.from('notes').select('*')
    if (error) console.error(error)
    else setNotes(data)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  )
}
