import React, { useState } from 'react';
import Head from 'next/head';
import { Briefcase, Plus, Users, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerJobsPage() {
  const { addToast } = useToast();
  const [jobs] = useState([
    {
      id: 1,
      role: 'Heavy Tractor & Commercial Driver',
      type: 'Full-time',
      salary: '₹18,000 - ₹22,000 / month',
      applications: 6,
      status: 'OPEN'
    },
    {
      id: 2,
      role: 'Junior Video & Drone Editor',
      type: 'Contract / Project',
      salary: '₹15,000 - ₹18,000 / month',
      applications: 9,
      status: 'OPEN'
    }
  ]);

  return (
    <OwnerLayout title="Job Postings & Hiring">
      <Head>
        <title>Job Postings — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Local Recruitment in Adilabad</h2>
            <p className="text-xs text-slate-500 mt-0.5">Post vacancies for drivers, accountants, technicians, and store crew.</p>
          </div>
          <button
            onClick={() => addToast('Job posting creation form ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(jobs) ? jobs : []).map((j) => (
            <div key={j.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {j.status}
                </span>
                <span className="text-xs font-bold text-slate-500">{j.type}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{j.role}</h3>
              <p className="text-xs font-semibold text-emerald-700">Salary: {j.salary}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-brand-600" /> {j.applications} candidates applied
                </span>
                <button
                  onClick={() => addToast('Viewing candidate applications.', 'info')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
