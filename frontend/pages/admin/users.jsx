import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Users, Search, CheckCircle2, XCircle } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';
import { useToast } from '../../src/context/ToastContext';

export default function AdminUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiFetch(`/admin/users${q}`);
      if (res && res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res && Array.isArray(res)) {
        setUsers(res);
      } else {
        setUsers([]);
      }
    } catch (err) {
      addToast(err.message, 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await apiFetch(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: currentStatus === 1 ? 0 : 1 })
      });
      if (res.success) {
        addToast(res.message, 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="User Management">
      <Head>
        <title>Manage Users — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Registered Users & Roles ({users.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage resident accounts, owner privileges, and administrator governance in Adilabad.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              placeholder="Search user by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition"
          >
            Search
          </button>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Name & Email</th>
                  <th className="py-4 px-4">Mobile</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Favorites</th>
                  <th className="py-4 px-4">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(Array.isArray(users) ? users : []).map((u) => {
                  const isActive = u.is_active === 1 || u.is_active === true || u.is_active === undefined;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-950/80 border border-brand-700/60 text-brand-300 flex items-center justify-center font-bold text-xs shadow">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-mono text-slate-300">{u.phone || '—'}</td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            u.role === 'admin' || u.role === 'SUPER_ADMIN'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                              : u.role === 'owner'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs font-bold text-brand-400">{u.favorites_count || 0}</td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                              : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                          }`}
                        >
                          {isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {u.role !== 'admin' && u.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(u.id, isActive ? 1 : 0)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                              isActive
                                ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 hover:bg-rose-900/80'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/80'
                            }`}
                          >
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
