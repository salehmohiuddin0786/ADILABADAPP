import React, { useState } from 'react';
import Head from 'next/head';
import { Users, Shield, UserCheck, Plus, CheckCircle2, Lock, Mail, Phone, Calendar } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';

export default function AdminStaffManagementPage() {
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: 'Prakash Rao',
      email: 'prakash@adilabadapp.com',
      role: 'MODERATOR',
      assignedQueue: 'Merchant KYC & Trade Licenses',
      activeTasks: 3,
      status: 'active',
      joined: '2026-02-10'
    },
    {
      id: 2,
      name: 'Anjali Sharma',
      email: 'anjali@adilabadapp.com',
      role: 'SUPPORT_STAFF',
      assignedQueue: 'Citizen Reports & Disputes',
      activeTasks: 2,
      status: 'active',
      joined: '2026-03-01'
    },
    {
      id: 3,
      name: 'K. Venkatesh',
      email: 'venkatesh@adilabadapp.com',
      role: 'CONTENT_MANAGER',
      assignedQueue: 'Homepage Banners & Event Verification',
      activeTasks: 1,
      status: 'active',
      joined: '2026-04-15'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'MODERATOR', assignedQueue: 'Listing Moderation' });

  const handleAdd = (e) => {
    e.preventDefault();
    setStaffMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newStaff,
        activeTasks: 0,
        status: 'active',
        joined: new Date().toISOString().slice(0, 10)
      }
    ]);
    setShowAddModal(false);
    setNewStaff({ name: '', email: '', role: 'MODERATOR', assignedQueue: 'Listing Moderation' });
  };

  return (
    <AdminLayout title="Staff & Operational Task Force Management">
      <Head>
        <title>Staff Management — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Staff Task Force & Delegation
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Assign moderation queues, verification tasks, and customer support responsibilities to operational staff.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Staff Member</th>
                  <th className="py-3.5 px-4">Role Authority</th>
                  <th className="py-3.5 px-4">Assigned Operational Queue</th>
                  <th className="py-3.5 px-4">Active Tasks</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {staffMembers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center justify-center font-bold">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{s.name}</p>
                          <p className="text-[11px] text-slate-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800 text-[10px] font-mono font-bold">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{s.assignedQueue}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{s.activeTasks} pending</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => alert(`Reviewing activity log for ${s.name}`)}
                        className="text-xs font-bold text-brand-400 hover:text-brand-300"
                      >
                        Inspect Queue
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Staff */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white">Enroll Staff Member</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Staff Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Operational Role *</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="SUPPORT_STAFF">SUPPORT_STAFF</option>
                    <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assigned Operational Queue</label>
                  <input
                    type="text"
                    value={newStaff.assignedQueue}
                    onChange={(e) => setNewStaff({ ...newStaff, assignedQueue: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30"
                  >
                    Enroll Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
