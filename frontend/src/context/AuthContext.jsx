import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
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
      } else {
        localStorage.removeItem('adilabad_token');
        setUser(null);
      }
    } catch (error) {
      console.warn('Session expired or invalid token:', error.message);
      localStorage.removeItem('adilabad_token');
      localStorage.removeItem('adilabad_mock_user');
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
      const msg = error.message || 'Failed to login';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, phone, password, accountType = 'user') => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password, accountType })
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
      const msg = error.message || 'Failed to register';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = async (customRedirect) => {
    try {
      // Invalidate on backend
      await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    } catch (e) {
      // Proceed with client side cleanup regardless
    }

    localStorage.removeItem('adilabad_token');
    localStorage.removeItem('adilabad_mock_user');
    sessionStorage.clear();
    setUser(null);
    setFavorites([]);
    addToast('You have been logged out securely.', 'info');

    // Determine target redirect page
    let target = customRedirect;
    if (!target) {
      const currentPath = router.pathname;
      if (currentPath.startsWith('/admin')) {
        target = '/admin/login';
      } else if (currentPath.startsWith('/owner')) {
        target = '/owner/login';
      } else if (currentPath.startsWith('/staff') || currentPath.startsWith('/customer')) {
        target = '/login';
      } else {
        target = '/login';
      }
    }

    router.replace(target);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      if (res.success) {
        setUser((prev) => ({ ...prev, ...res.user }));
        addToast('Profile updated successfully!', 'success');
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (error) {
      const msg = error.message || 'Failed to update profile';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const res = await apiFetch('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ current_password, new_password })
      });
      if (res.success) {
        addToast('Password changed successfully!', 'success');
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message };
    } catch (error) {
      const msg = error.message || 'Failed to change password';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await apiFetch('/auth/avatar', {
        method: 'POST',
        body: formData
      });
      if (res.success && res.avatar_url) {
        setUser((prev) => ({ ...prev, avatar_url: res.avatar_url }));
        addToast('Avatar updated successfully!', 'success');
        return { success: true, avatar_url: res.avatar_url };
      }
      return { success: false, message: res.message };
    } catch (error) {
      const msg = error.message || 'Failed to upload avatar';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
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

  const isAdmin = Boolean(
    user && (
      user.role === 'admin' ||
      user.role === 'SUPER_ADMIN' ||
      user.primary_role === 'SUPER_ADMIN' ||
      user.primary_role === 'ADMIN' ||
      (Array.isArray(user.roles) && user.roles.some((r) => ['SUPER_ADMIN', 'ADMIN'].includes(r)))
    )
  );

  const isOwner = Boolean(
    user && (
      isAdmin ||
      user.role === 'owner' ||
      user.role === 'BUSINESS_OWNER' ||
      user.role === 'INDIVIDUAL_OWNER' ||
      user.primary_role === 'BUSINESS_OWNER' ||
      user.primary_role === 'INDIVIDUAL_OWNER' ||
      user.primary_role === 'PROPERTY_OWNER' ||
      user.primary_role === 'SERVICE_PROVIDER' ||
      user.primary_role === 'EMPLOYER' ||
      (Array.isArray(user.roles) &&
        user.roles.some((r) =>
          ['BUSINESS_OWNER', 'INDIVIDUAL_OWNER', 'PROPERTY_OWNER', 'SERVICE_PROVIDER', 'EMPLOYER'].includes(r)
        ))
    )
  );

  const isStaff = Boolean(
    user && (
      isAdmin ||
      user.role === 'staff' ||
      user.primary_role === 'MODERATOR' ||
      user.primary_role === 'SUPPORT_STAFF' ||
      user.primary_role === 'CONTENT_MANAGER' ||
      (Array.isArray(user.roles) &&
        user.roles.some((r) => ['MODERATOR', 'SUPPORT_STAFF', 'CONTENT_MANAGER'].includes(r)))
    )
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        isAuthenticated: !!user,
        isAdmin,
        isOwner,
        isStaff,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        uploadAvatar,
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
