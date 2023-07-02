const LoginForm = ({
  username,
  password,
  handleLogin,
  setShowLoginForm,
  setPassword,
  setUsername,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">Login</button>
    <button type="button" onClick={(e) => setShowLoginForm(false)}>
      Cancel
    </button>
  </form>
)

export default LoginForm
