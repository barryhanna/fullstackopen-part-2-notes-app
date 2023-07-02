import React from 'react'

const NoteForm = ({ addNote }) => {
  const [newNote, setNewNote] = React.useState('')

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        addNote(e.target.note.value)
        setNewNote('')
      }}
    >
      <div>
        <input
          value={newNote}
          id="note"
          name="note"
          onChange={handleNoteChange}
        />
        <button type="submit">Save</button>
      </div>
    </form>
  )
}

export default NoteForm
