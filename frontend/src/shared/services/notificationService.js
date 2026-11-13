import { apiFetch } from '../../utils/api';

/**
 * Unified Shared Notification Service
 * Used across Customer, Owner, Staff, and Admin panels.
 */
export const notificationService = {
  async getNotifications() {
    return apiFetch('/notifications');
  },

  async markAsRead(notificationId) {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_notifications') || '[]');
        const updated = stored.map((n) => (n.id === notificationId ? { ...n, is_read: 1 } : n));
        localStorage.setItem('adilabad_notifications', JSON.stringify(updated));
      } catch (e) {}
    }
    return apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' });
  },

  async broadcastAlert(alertData) {
    return apiFetch('/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
  }
};
