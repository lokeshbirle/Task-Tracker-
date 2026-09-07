import axiosClient from './axiosClient'

// All Admin-only, mirrors UserController (@PreAuthorize hasRole('ADMIN') on the whole controller)
export const usersApi = {
  getAll: () => axiosClient.get('/users'),
  getById: (id) => axiosClient.get(`/users/${id}`),
  create: (payload) => axiosClient.post('/users', payload),
  update: (id, payload) => axiosClient.put(`/users/${id}`, payload),
  updateStatus: (id, status) => axiosClient.patch(`/users/${id}/status`, { status }),
}
