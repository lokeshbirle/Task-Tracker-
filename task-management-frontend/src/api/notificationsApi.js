import axiosClient from './axiosClient'

export const notificationsApi = {
  getMine: () => axiosClient.get('/notifications'),
  markRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
}
