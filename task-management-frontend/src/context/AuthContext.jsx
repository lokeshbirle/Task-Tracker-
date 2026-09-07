import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session on page refresh - token/user are the only things we persist client-side
  useEffect(() => {
    const storedUser = localStorage.getItem('tm_user')
    const storedToken = localStorage.getItem('tm_token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await authApi.login(email, password)
    localStorage.setItem('tm_token', data.token)
    localStorage.setItem('tm_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    localStorage.setItem('tm_token', data.token)
    localStorage.setItem('tm_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // JWTs are stateless server-side; logout is really a client-side token discard,
      // so we clear local state regardless of whether the network call succeeds.
    }
    localStorage.removeItem('tm_token')
    localStorage.removeItem('tm_user')
    setUser(null)
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
