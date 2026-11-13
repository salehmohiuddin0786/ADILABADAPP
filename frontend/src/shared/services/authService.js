import { apiFetch } from '../../utils/api';

/**
 * Unified Authentication & Identity Service
 * Single identity across all 5 portals: Public, Customer, Owner, Admin, Staff.
 */
export const authService = {
  async login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(name, email, phone, password) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password })
    });
  },

  async getCurrentUser() {
    return apiFetch('/auth/me');
  },

  async updateProfile(profileData) {
    return apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('adilabad_user') || localStorage.getItem('adilabad_mock_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adilabad_user');
      localStorage.removeItem('adilabad_mock_user');
      localStorage.removeItem('adilabad_token');
    }
  }
};
