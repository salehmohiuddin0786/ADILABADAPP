import React, { useState } from 'react';
import Head from 'next/head';
import {
  Users,
  Shield,
  UserCheck,
  Plus,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Calendar,
  Clock,
  Activity,
  FileText,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { useToast } from '../../src/context/ToastContext';

export default function AdminStaffManagementPage() {
  const { addToast } = useToast();
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: 'Prakash Rao',
      email: 'prakash@adilabadapp.com',
      role: 'MODERATOR',
      assignedQueue: 'Merchant KYC & Trade Licenses',
      activeTasks: 3,
      status: 'active',
      joined: '2026-02-10',
      tasks: [
        {
          id: 'TSK-101',
          title: 'Adilabad Cotton Mills - Trade License Renewal',
          category: 'Merchant KYC Verification',
          priority: 'HIGH',
          submitted: '45 mins ago',
          notes: 'Uploaded Form 4 and Telangana Municipal Trade Certificate ADB-MUNC-TL-4912.'
        },
        {
          id: 'TSK-102',
          title: 'New Diamond Jewellery - Owner GSTIN Verification',
          category: 'Identity & Legal Audit',
          priority: 'MEDIUM',
          submitted: '2 hours ago',
          notes: 'GST portal API cross-referenced; awaiting Aadhaar OTP confirmation.'
        },
        {
          id: 'TSK-103',
          title: 'Sree Balaji Agro Traders - Storefront Geo-Coordinates Audit',
          category: 'Location & Map Verification',
          priority: 'NORMAL',
          submitted: '3 hours ago',
          notes: 'Coordinates on Cinema Road need satellite boundary confirmation.'
        }
      ],
      logs: [
        {
          id: 'LOG-1',
          action: 'Approved Rental Escrow Release',
          details: 'Verified John Deere 5050D Tractor booking security escrow release of ₹8,000.',
          time: '18 minutes ago',
          type: 'success'
        },
        {
          id: 'LOG-2',
          action: 'Verified Vendor Trade License',
          details: 'Cleared verification documents for Adilabad Cotton Heritage (Store ID: #104).',
          time: '1 hour ago',
          type: 'info'
        },
        {
          id: 'LOG-3',
          action: 'Flagged Suspected Duplicate Listing',
          details: 'Reported duplicate advertisement "Used Submersible Borewell Motor" for seller review.',
          time: '3 hours ago',
          type: 'warning'
        },
        {
          id: 'LOG-4',
          action: 'Completed Morning Queue Audit',
          details: 'Reviewed 14 merchant submissions in "Merchant KYC & Trade Licenses" backlog.',
          time: 'Today, 09:30 AM',
          type: 'info'
        },
        {
          id: 'LOG-5',
          action: 'Updated User Verification Tier',
          details: 'Elevated Ramesh Balaji to Verified Business Owner after physical shop inspection.',
          time: 'Yesterday, 05:45 PM',
          type: 'success'
        }
      ]
    },
    {
      id: 2,
      name: 'Anjali Sharma',
      email: 'anjali@adilabadapp.com',
      role: 'SUPPORT_STAFF',
      assignedQueue: 'Citizen Reports & Disputes',
      activeTasks: 2,
      status: 'active',
      joined: '2026-03-01',
      tasks: [
        {
          id: 'TSK-201',
          title: 'Reported Misleading Price on Commercial Plot #41',
          category: 'Citizen Report',
          priority: 'HIGH',
          submitted: '1 hour ago',
          notes: 'Caller claims owner quote differs from advertised ₹45,00,000 price.'
        },
        {
          id: 'TSK-202',
          title: 'Rental Return Dispute: Equipment Cleanliness',
          category: 'Rental Escrow Dispute',
          priority: 'MEDIUM',
          submitted: '4 hours ago',
          notes: 'Owner withheld ₹1,500 cleaning fee; customer provided return photos.'
        }
      ],
      logs: [
        {
          id: 'LOG-201',
          action: 'Resolved Citizen Complaint #982',
          details: 'Mediated dispute between DJ Sound renter and venue owner. Resolved amicably.',
          time: '2 hours ago',
          type: 'success'
        },
        {
          id: 'LOG-202',
          action: 'Forwarded Copyright Report',
          details: 'Sent brand trademark report to Super Admin legal review queue.',
          time: '5 hours ago',
          type: 'warning'
        }
      ]
    },
    {
      id: 3,
      name: 'K. Venkatesh',
      email: 'venkatesh@adilabadapp.com',
      role: 'CONTENT_MANAGER',
      assignedQueue: 'Homepage Banners & Event Verification',
      activeTasks: 1,
      status: 'active',
      joined: '2026-04-15',
      tasks: [
        {
          id: 'TSK-301',
          title: 'Adilabad District Agri Expo 2026 Banner Submission',
          category: 'Banner Review',
          priority: 'MEDIUM',
          submitted: '2 hours ago',
          notes: 'Check 21:9 resolution and sponsor logos before publishing on homepage hero.'
        }
      ],
      logs: [
        {
          id: 'LOG-301',
          action: 'Published Festival Hero Banner',
          details: 'Updated Diwali Handloom Expo banner priority to #1 on homepage.',
          time: '3 hours ago',
          type: 'success'
        },
        {
          id: 'LOG-302',
          action: 'Approved Event Listing',
          details: 'Verified Kisan Mela event dates and location at Indira Priyadarshini Stadium.',
          time: 'Yesterday',
          type: 'info'
        }
      ]
    }
  ]);

  const [inspectingStaff, setInspectingStaff] = useState(null);
  const [modalTab, setModalTab] = useState('queue'); // 'queue' | 'logs'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'MODERATOR',
    assignedQueue: 'Listing Moderation'
  });

  const handleInspect = (staff) => {
    setInspectingStaff(staff);
    setModalTab('queue');
  };

  const handleResolveTask = (taskId) => {
    if (!inspectingStaff) return;
    const updatedTasks = inspectingStaff.tasks.filter((t) => t.id !== taskId);
    const updatedLogs = [
      {
        id: `LOG-${Date.now()}`,
        action: 'Completed Task Verification',
        details: `Task #${taskId} processed and cleared by Super Admin override.`,
        time: 'Just now',
        type: 'success'
      },
      ...inspectingStaff.logs
    ];

    const updatedMember = {
      ...inspectingStaff,
      tasks: updatedTasks,
      activeTasks: updatedTasks.length,
      logs: updatedLogs
    };

    setInspectingStaff(updatedMember);
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === inspectingStaff.id ? updatedMember : s))
    );
    addToast(`Task #${taskId} resolved successfully!`, 'success');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      ...newStaff,
      activeTasks: 0,
      status: 'active',
      joined: new Date().toISOString().slice(0, 10),
      tasks: [],
      logs: [
        {
          id: `LOG-${Date.now()}`,
          action: 'Staff Onboarded',
          details: `Enrolled into system and assigned to ${newStaff.assignedQueue}.`,
          time: 'Just now',
          type: 'info'
        }
      ]
    };
    setStaffMembers((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewStaff({ name: '', email: '', role: 'MODERATOR', assignedQueue: 'Listing Moderation' });
    addToast(`Staff member ${created.name} enrolled!`, 'success');
  };

  return (
    <AdminLayout title="Staff Task Force & Queue Operations">
      <Head>
        <title>Staff Management — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Operational Staff Task Force
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supervise active moderation queues, review live staff activity logs, and reassign verification tasks.
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
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {s.activeTasks} pending
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleInspect(s)}
                        className="px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 font-bold text-xs transition inline-flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Inspect Queue</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Inspect Queue & Activity Log */}
        {inspectingStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 flex items-center justify-center text-lg font-black">
                    {inspectingStaff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{inspectingStaff.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800 text-[10px] font-mono font-bold">
                        {inspectingStaff.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assigned Queue:{' '}
                      <span className="text-white font-semibold">
                        {inspectingStaff.assignedQueue}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectingStaff(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-slate-950/40 border-b border-slate-800/80 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Pending Tasks
                  </span>
                  <span className="text-base font-black text-amber-400">
                    {inspectingStaff.tasks?.length || 0} items
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Audit Log Count
                  </span>
                  <span className="text-base font-black text-emerald-400">
                    {inspectingStaff.logs?.length || 0} events
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    Member Status
                  </span>
                  <span className="text-base font-black text-brand-400">On Duty</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center px-6 border-b border-slate-800 gap-4 bg-slate-950/20">
                <button
                  onClick={() => setModalTab('queue')}
                  className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                    modalTab === 'queue'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Assigned Queue Tasks ({inspectingStaff.tasks?.length || 0})</span>
                </button>

                <button
                  onClick={() => setModalTab('logs')}
                  className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                    modalTab === 'logs'
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Activity Audit Trail ({inspectingStaff.logs?.length || 0})</span>
                </button>
              </div>

              {/* Tab Content Area */}
              <div className="p-6 overflow-y-auto space-y-3 flex-1">
                {modalTab === 'queue' && (
                  <>
                    {(!inspectingStaff.tasks || inspectingStaff.tasks.length === 0) ? (
                      <div className="text-center py-10 text-slate-400 text-xs">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="font-bold text-white">Queue Clear!</p>
                        <p className="mt-1">All assigned moderation tasks for this staff member have been resolved.</p>
                      </div>
                    ) : (
                      inspectingStaff.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                                  {task.id}
                                </span>
                                <span
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                    task.priority === 'HIGH'
                                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {task.priority} PRIORITY
                                </span>
                              </div>
                              <h4 className="font-bold text-white text-sm mt-1.5">
                                {task.title}
                              </h4>
                              <p className="text-xs text-slate-400">{task.category}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono shrink-0">
                              <Clock className="w-3 h-3" />
                              {task.submitted}
                            </span>
                          </div>

                          {task.notes && (
                            <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                              {task.notes}
                            </p>
                          )}

                          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/60">
                            <button
                              onClick={() => {
                                addToast(`Verification requested for ${task.title}`, 'info');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                            >
                              Request Info
                            </button>
                            <button
                              onClick={() => handleResolveTask(task.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Complete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {modalTab === 'logs' && (
                  <div className="space-y-3">
                    {inspectingStaff.logs?.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3 text-xs"
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            log.type === 'success'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : log.type === 'warning'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          }`}
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-white">{log.action}</p>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {log.time}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    addToast(`Queue for ${inspectingStaff.name} synchronized!`, 'success');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sync Queue</span>
                </button>

                <button
                  onClick={() => setInspectingStaff(null)}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-md"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}

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
                    placeholder="e.g. Ramesh Varma"
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
                    placeholder="e.g. ramesh@adilabadapp.com"
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
                    placeholder="e.g. Equipment & Heavy Fleet Verification"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30 hover:bg-brand-500 transition"
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
