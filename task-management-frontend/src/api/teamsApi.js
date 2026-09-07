import axiosClient from './axiosClient'

export const teamsApi = {
  getAll: () => axiosClient.get('/teams'),
  getById: (id) => axiosClient.get(`/teams/${id}`),
  getTasks: (id) => axiosClient.get(`/teams/${id}/tasks`),
  create: (payload) => axiosClient.post('/teams', payload),          // Admin only
  update: (id, payload) => axiosClient.put(`/teams/${id}`, payload), // Admin only
  remove: (id) => axiosClient.delete(`/teams/${id}`),                // Admin only, soft delete
  addMember: (id, userId) => axiosClient.post(`/teams/${id}/members`, { userId }),
  removeMember: (id, userId) => axiosClient.delete(`/teams/${id}/members/${userId}`),
}
