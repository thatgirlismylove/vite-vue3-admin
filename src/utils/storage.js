const TOKEN_KEY = 'token_key'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token) => {
  return new Promise((resolve) => {
    localStorage.setItem(TOKEN_KEY, token)
    resolve(token)
  })
}

export const removeToken = () => {
  return new Promise((resolve) => {
    localStorage.removeItem(TOKEN_KEY)
    resolve()
  })
}
