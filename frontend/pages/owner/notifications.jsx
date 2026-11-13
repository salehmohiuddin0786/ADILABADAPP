import React, { useState } from 'react';
import Head from 'next/head';
import { Bell, CheckCircle2, Clock, Inbox } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerNotificationsPage() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Booking Proposal Received',
      body: 'Rahul Sharma proposed dates for Sony Alpha Camera (Nov 16 - Nov 19).',
      time: '30 mins ago',
      unread: true
    },
    {
      id: 2,
      title: 'KYC Document Approved',
      body: 'Your municipal shop license has been approved by Adilabad operations team.',
      time: '3 hours ago',
      unread: false
    },
    {
      id: 3,
      title: '5-Star Customer Review',
      body: 'Suresh Patel left a 5-star review on your John Deere Tractor listing.',
      time: '1 day ago',
      unread: false
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) =>
      (Array.isArray(prev) ? prev : []).map((n) => ({ ...n, unread: false }))
    );
    addToast('All notifications marked as read', 'success');
  };

  return (
    <OwnerLayout title="Merchant Notifications">
      <Head>
        <title>Notifications — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Activity Alerts & Messages</h2>
            <p className="text-xs text-slate-500 mt-0.5">Instant alerts on reservations, verifications, and customer interactions.</p>
          </div>
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Mark All as Read
          </button>
        </div>

        <div className="space-y-3">
          {(Array.isArray(notifications) ? notifications : []).map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition ${
                n.unread
                  ? 'bg-amber-50/60 border-amber-200/80 shadow-sm'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {n.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
