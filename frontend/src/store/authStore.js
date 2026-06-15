import { create } from 'zustand'
import authService from '../services/authService'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('token', data.token)       // ← is this line there?
    localStorage.setItem('user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, isAuthenticated: true })
    return data
  },

  register: async (credentials) => {
    const data = await authService.register(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, isAuthenticated: true })
    return data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser))
    set({ user: updatedUser })
  },
}))