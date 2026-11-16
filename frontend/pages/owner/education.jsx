import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GraduationCap, Plus, Users, BookOpen, MapPin } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerEducationPage() {
  const { addToast } = useToast();
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadInstitutes = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'education' });
      setInstitutes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutes();
    const handleSync = () => loadInstitutes();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

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
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Education Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(institutes) ? institutes : []).map((inst) => (
            <div key={inst.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    inst.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : inst.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : inst.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inst.status}
                </span>
                <span className="text-xs font-bold text-slate-500">{inst.pricing || 'Tuition / Fees'}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{inst.title}</h3>
              <p className="text-xs text-slate-600 font-medium">Stream / Focus: {inst.category}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Campus: {inst.location}
              </p>
              {inst.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {inst.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {inst.id}</span>
                <span className="text-emerald-700 font-bold">
                  {inst.status === 'PUBLISHED' ? 'Live on Portal' : 'Under Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="education"
        moduleLabel="Education Center / Coaching"
        defaultCategory="Competitive Exams (TSPSC / Banking)"
        categoryOptions={['Competitive Exams (TSPSC / Banking)', 'School & College Tuition', 'Computer & Software Training', 'Language & Spoken English', 'Music & Arts Academy']}
        pricingLabel="Fee Structure / Monthly"
        pricingPlaceholder="e.g. ₹2,500 / month or ₹15,000 package"
        onSuccess={loadInstitutes}
      />
    </OwnerLayout>
  );
}
