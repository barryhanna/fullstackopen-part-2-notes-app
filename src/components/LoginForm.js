import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup } from 'react-bootstrap'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin(username, password)
        setUsername('')
        setPassword('')
      }}
    >
      <FormGroup>
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />

        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />

        <Button variant="primary" id="login-button" type="submit">
          Login
        </Button>
      </FormGroup>
    </Form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}

export default LoginForm
