import React from 'react'

const NoteForm = ({ addNote }) => {
  const [newNote, setNewNote] = React.useState('')

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addNote(e.target.note.value)
          setNewNote('')
        }}
      >
        <input
          value={newNote}
          id="note"
          name="note"
          onChange={handleNoteChange}
          placeholder="write note content here"
        />
        <button id="saveNote" type="submit">
          save
        </button>
      </form>
    </div>
  )
}

export default NoteForm
