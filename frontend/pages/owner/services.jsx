import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Wrench, Plus, CheckCircle2, MapPin } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerServicesPage() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'services' });
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    const handleSync = () => loadServices();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Professional Service Listings">
      <Head>
        <title>Services — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commercial Services Offered</h2>
            <p className="text-xs text-slate-500 mt-0.5">List professional technician, operator, or maintenance services.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Service Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(services) ? services : []).map((s) => (
            <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : s.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : s.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {s.status}
                </span>
                <span className="font-bold text-emerald-700 text-xs">{s.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Service Location: <strong>{s.location}</strong>
              </p>
              {s.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {s.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {s.id}</span>
                <span className="text-emerald-700 font-bold">
                  {s.status === 'PUBLISHED' ? 'Live on Portal' : 'Under Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="services"
        moduleLabel="Professional Service"
        defaultCategory="Production & Audio"
        categoryOptions={['Production & Audio', 'Repair & Maintenance', 'Construction & Masonry', 'Transport & Drivers', 'Electrical & Solar']}
        pricingPlaceholder="e.g. ₹3,500 / day"
        onSuccess={loadServices}
      />
    </OwnerLayout>
  );
}
