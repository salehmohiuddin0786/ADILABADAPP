import React, { useState } from 'react';
import Head from 'next/head';
import { MessageSquare, Phone, Clock, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerEnquiriesPage() {
  const { addToast } = useToast();
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      sender: 'Md. Farooq',
      phone: '9848011223',
      item: 'Sony Alpha Cinema Camera Daily Rentals',
      message: 'Is the camera available for a 4-day wedding shoot starting next Friday in Utnoor?',
      time: '2 hours ago',
      status: 'NEW'
    },
    {
      id: 2,
      sender: 'Venkatesh Goud',
      phone: '9440188776',
      item: 'Commercial Yard with Shaded Equipment Storage',
      message: 'Looking to lease for 12 months for cement & building supplies. Can we visit tomorrow?',
      time: 'Yesterday',
      status: 'RESPONDED'
    }
  ]);

  const markResolved = (id) => {
    setEnquiries((prev) =>
      (Array.isArray(prev) ? prev : []).map((e) => (e.id === id ? { ...e, status: 'RESOLVED' } : e))
    );
    addToast('Enquiry marked as resolved!', 'success');
  };

  return (
    <OwnerLayout title="Inbound Customer Enquiries">
      <Head>
        <title>Enquiries — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Direct Customer Leads & Calls</h2>
          <p className="text-xs text-slate-500 mt-0.5">Inquiries submitted via listing contact forms and 1-tap call triggers.</p>
        </div>

        <div className="space-y-4">
          {(Array.isArray(enquiries) ? enquiries : []).map((enq) => (
            <div key={enq.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{enq.sender}</span>
                  <a href={`tel:${enq.phone}`} className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> +91 {enq.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {enq.time}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      enq.status === 'NEW' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-medium">Re: {enq.item}</p>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                "{enq.message}"
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href={`https://wa.me/91${enq.phone}?text=Hello%20${encodeURIComponent(enq.sender)},%20thank%20you%20for%20your%20inquiry%20regarding%20${encodeURIComponent(enq.item)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Reply on WhatsApp &rarr;
                </a>
                {enq.status !== 'RESOLVED' && (
                  <button
                    onClick={() => markResolved(enq.id)}
                    className="text-slate-500 font-semibold hover:text-slate-900"
                  >
                    Mark as Handled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
