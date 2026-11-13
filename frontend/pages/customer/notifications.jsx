import React, { useState } from 'react';
import Head from 'next/head';
import { Bell, Clock } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function CustomerNotificationsPage() {
  const { addToast } = useToast();
  const [notifications] = useState([
    {
      id: 1,
      title: 'Booking Accepted by Owner',
      body: 'Adilabad Media Works has accepted your reservation for Sony Alpha Camera.',
      time: '1 hour ago'
    },
    {
      id: 2,
      title: 'Special Weekend Discount',
      body: 'Get 20% off agricultural tools rental this weekend across Adilabad.',
      time: 'Yesterday'
    }
  ]);

  return (
    <CustomerLayout title="My Notifications">
      <Head>
        <title>Notifications — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform & Booking Alerts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated on your rental requests and favorite stores.</p>
        </div>

        <div className="space-y-3">
          {(Array.isArray(notifications) ? notifications : []).map((n) => (
            <div key={n.id} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {n.time}
                </span>
              </div>
              <p className="text-xs text-slate-600">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
