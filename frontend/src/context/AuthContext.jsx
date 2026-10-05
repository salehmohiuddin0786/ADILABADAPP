import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { addToast } = useToast();

  const fetchProfile = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adilabad_token') : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        // Also fetch user's saved favorites
        try {
          const favRes = await apiFetch('/favorites');
          if (favRes.success && favRes.data?.all) {
            setFavorites(favRes.data.all);
          }
        } catch (e) {
          // ignore favorites error
        }
      }
    } catch (error) {
      console.warn('Session expired or invalid token:', error.message);
      localStorage.removeItem('adilabad_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email, password) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (res.success && res.token) {
        localStorage.setItem('adilabad_token', res.token);
        setUser(res.user);
        addToast(res.message || 'Logged in successfully!', 'success');
        await fetchProfile();
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      addToast(error.message || 'Failed to login', 'error');
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password })
      });

      if (res.success && res.token) {
        localStorage.setItem('adilabad_token', res.token);
        setUser(res.user);
        addToast('Registration successful! Welcome to Adilabad App.', 'success');
        await fetchProfile();
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      addToast(error.message || 'Failed to register', 'error');
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adilabad_token');
    setUser(null);
    setFavorites([]);
    addToast('Logged out successfully', 'info');
  };

  const toggleFavorite = async (item_type, item_id) => {
    if (!user) {
      addToast('Please log in to save items to your favorites.', 'info');
      return false;
    }

    try {
      const res = await apiFetch('/favorites', {
        method: 'POST',
        body: JSON.stringify({ item_type, item_id: parseInt(item_id, 10) })
      });

      if (res.success) {
        addToast(res.message, 'success');
        // Refresh favorites list
        const favRes = await apiFetch('/favorites');
        if (favRes.success && favRes.data?.all) {
          setFavorites(favRes.data.all);
        }
        return res.is_favorited;
      }
    } catch (error) {
      addToast(error.message || 'Failed to update favorite', 'error');
      return false;
    }
  };

  const isFavorited = (item_type, item_id) => {
    return favorites.some(
      (f) => f.item_type === item_type && parseInt(f.item_id, 10) === parseInt(item_id, 10)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser: fetchProfile,
        favorites,
        toggleFavorite,
        isFavorited
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
