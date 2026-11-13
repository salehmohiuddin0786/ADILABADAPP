import React, { useState } from 'react';
import Head from 'next/head';
import { GraduationCap, Plus, Users, BookOpen } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerEducationPage() {
  const { addToast } = useToast();
  const [institutes] = useState([
    {
      id: 1,
      name: 'Adilabad Career & Competitive Academy',
      courses: 'TSPSC, Banking, SSC, Police SI & Constable',
      students_enrolled: 180,
      status: 'VERIFIED',
      locality: 'Teachers Colony, Adilabad'
    }
  ]);

  return (
    <OwnerLayout title="Education & Coaching Center Profiles">
      <Head>
        <title>Education — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Institutions & Tuition Centers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Showcase course batches, demo classes, and student admissions.</p>
          </div>
          <button
            onClick={() => addToast('Institute listing form ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Education Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(institutes) ? institutes : []).map((inst) => (
            <div key={inst.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {inst.status}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-brand-600" /> {inst.students_enrolled} Learners
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{inst.name}</h3>
              <p className="text-xs text-slate-600 font-medium">Courses: {inst.courses}</p>
              <p className="text-xs text-slate-400">Campus: {inst.locality}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">New Batch Registrations Open</span>
                <button
                  onClick={() => addToast('Updating batch timings.', 'info')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Manage Courses
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
