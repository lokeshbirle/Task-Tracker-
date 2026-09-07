import axiosClient from './axiosClient'

export const tasksApi = {
  // GET /api/tasks returns everything for Admin, only "my tasks" for Employee - backend decides, not us
  getAll: () => axiosClient.get('/tasks'),
  getById: (id) => axiosClient.get(`/tasks/${id}`),
  create: (payload) => axiosClient.post('/tasks', payload),                     // Admin only
  update: (id, payload) => axiosClient.put(`/tasks/${id}`, payload),            // Admin only
  updateStatus: (id, status, blockedReason) =>
    axiosClient.patch(`/tasks/${id}/status`, { status, blockedReason }),        // Admin or assignee
  reassign: (id, userId) => axiosClient.patch(`/tasks/${id}/assign`, { userId }), // Admin only
  remove: (id) => axiosClient.delete(`/tasks/${id}`),                          // Admin only, soft delete
}
