import axiosClient from './axiosClient'

export const activityApi = {
  getForTask: (taskId) => axiosClient.get(`/tasks/${taskId}/activity`),
}
