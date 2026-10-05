import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Settings, ShieldCheck, Save, Clock, History } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';
import { useToast } from '../../src/context/ToastContext';

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    site_name: 'Adilabad App',
    site_tagline: 'Discover Adilabad. Discover Local.',
    contact_phone: '+91 94401 12345',
    contact_whatsapp: '+91 94401 12345',
    contact_email: 'hello@adilabadapp.com',
    contact_address: 'Main Commercial Hub, Shivaji Chowk, Adilabad, Telangana 504001'
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch('/admin/settings'),
      apiFetch('/admin/audit-logs')
    ])
      .then(([setRes, logRes]) => {
        if (setRes.success && setRes.data) {
          setSettings((prev) => ({ ...prev, ...setRes.data }));
        }
        if (logRes.success && logRes.data) {
          setLogs(logRes.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      if (res.success) {
        addToast('Settings saved successfully!', 'success');
        // Refresh audit logs
        const logRes = await apiFetch('/admin/audit-logs');
        if (logRes.success) setLogs(logRes.data);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="System Settings & Audit Trail">
      <Head>
        <title>Settings & Audit Logs — Adilabad App Admin</title>
      </Head>

      <div className="space-y-8">
        {/* Settings Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Website & Contact Settings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              General platform parameters and support contact lines for Adilabad App.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  value={settings.site_tagline}
                  onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Support Desk
                </label>
                <input
                  type="text"
                  value={settings.contact_whatsapp}
                  onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Physical Office Address in Adilabad
                </label>
                <input
                  type="text"
                  value={settings.contact_address}
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Administrator Audit Log</h3>
              <p className="text-xs text-slate-500">Security audit records of actions performed by administrators.</p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 sm:-mx-8">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-y border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-6">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-6 font-mono text-slate-500">{log.created_at}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.admin_name || 'Admin'}</td>
                    <td className="py-3 px-4 font-bold text-brand-600">{log.action}</td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-500">{log.entity}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">{log.details || '—'}</td>
                    <td className="py-3 px-6 font-mono text-slate-400">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
