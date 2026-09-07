import axiosClient from './axiosClient'

export const authApi = {
  login: (email, password) => axiosClient.post('/auth/login', { email, password }),
  register: (payload) => axiosClient.post('/auth/register', payload),
  logout: () => axiosClient.post('/auth/logout'),
}
