import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import loginService from './services/login'
import NoteForm from './components/NoteForm'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Notes from './components/Notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  const padding = {
    padding: 5,
  }

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      loginService.setToken(user.token)
    }
  }, [])

  const addNote = (note) => {
    noteFormRef.current.toggleVisibility()
    const noteObject = {
      content: note,
      important: Math.random() > 0.5,
    }

    noteService.create(noteObject, user.token).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
    })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote, user.token)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== id))
        console.log(error)
      })
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      loginService.setToken(user.token)
      setUser(user)
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">
          Home
        </Link>
        <Link style={padding} to="/notes">
          Notes
        </Link>
        <Link style={padding} to="/users">
          Users
        </Link>
      </div>

      <Routes>
        <Route
          path="/notes"
          element={
            <Notes
              notesToShow={notesToShow}
              showAll={showAll}
              setShowAll={setShowAll}
              toggleImportanceOf={toggleImportanceOf}
            />
          }
        />
      </Routes>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && (
        <Togglable buttonLabel="Login">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      )}

      {user && (
        <div>
          <p>
            {user.name} logged in{' '}
            <button
              onClick={() => {
                loginService.logout()
                setUser(null)
              }}
            >
              Logout
            </button>
          </p>
          <Togglable buttonLabel="New Note" ref={noteFormRef}>
            <NoteForm addNote={addNote} />
          </Togglable>
        </div>
      )}

      <Footer />
    </Router>
  )
}

export default App
