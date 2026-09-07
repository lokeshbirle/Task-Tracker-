import axiosClient from './axiosClient'

export const dashboardApi = {
  // Backend inspects the caller's role and returns org-wide stats for Admin, personal stats for Employee
  getStats: () => axiosClient.get('/dashboard/stats'),
}
