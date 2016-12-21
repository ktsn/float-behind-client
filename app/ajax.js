import axios from 'axios'

export default axios.create({
  baseURL: process.env.NODE_ENV !== 'production'
    ? 'http://localhost.floatbehind.ninja:3000/api/v1'
    : 'https://app.floatbehind.ninja/api/v1',

  withCredentials: true
})
