import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import loginService from './services/login'
import NoteForm from './components/NoteForm'
import { Alert, Nav, Navbar, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const padding = {
    padding: 20,
  }

  const noteFormRef = useRef()

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

  useEffect(() => {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }, [message])

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
        setMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setMessage(null)
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
      setMessage(`welcome ${user}`)
    } catch (error) {
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                home
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/notes">
                notes
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                users
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user ? (
                <em style={padding}>{user} logged in</em>
              ) : (
                <Link style={padding} to="/login">
                  login
                </Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <h1>Notes</h1>
      {message && <Alert variant="success">{message}</Alert>}

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

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <Table striped>
        <tbody>
          {notesToShow.map((note) => (
            <td key={note.id}>
              <Note
                key={note.id}
                note={note}
                toggleImportance={() => toggleImportanceOf(note.id)}
              />
            </td>
          ))}
        </tbody>
      </Table>

      <Footer />
    </div>
  )
}

export default App
