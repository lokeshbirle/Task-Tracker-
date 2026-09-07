import axiosClient from './axiosClient'

export const commentsApi = {
  getForTask: (taskId) => axiosClient.get(`/tasks/${taskId}/comments`),
  add: (taskId, text) => axiosClient.post(`/tasks/${taskId}/comments`, { text }),
}
