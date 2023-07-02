import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = (newObject, token) => {
  const request = axios.post(baseUrl, newObject, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return request.then((response) => response.data)
}

const update = (id, newObject, token) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return request.then((response) => response.data)
}

// eslint-disable-next-line
export default {
  getAll,
  create,
  update,
}
