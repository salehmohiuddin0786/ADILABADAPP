import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Briefcase, Plus, MapPin, Phone, MessageCircle } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function CustomerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const DEFAULT_JOBS = [
    {
      id: 'JOB-1',
      title: 'Heavy Commercial Vehicle & Tractor Driver Needed',
      category: 'Drivers & Transport',
      pricing: '₹18,000 - ₹22,000 / month',
      location: 'Cinema Road, Adilabad',
      owner_phone: '+91 98480 22334',
      status: 'PUBLISHED',
      description: 'Looking for experienced heavy badge driver for local and inter-district transport in Adilabad.'
    },
    {
      id: 'JOB-2',
      title: 'Retail Store Sales Assistant & Billing Clerk',
      category: 'Retail & Billing',
      pricing: '₹12,000 - ₹15,000 / month',
      location: 'Subhash Nagar, Adilabad',
      owner_phone: '+91 94401 92834',
      status: 'PUBLISHED',
      description: 'Computer billing, customer greeting, and stock maintenance at electronics showroom.'
    }
  ];

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'jobs' });
      const userJobs = Array.isArray(res.data) ? res.data : [];

      const mergedMap = new Map();
      DEFAULT_JOBS.forEach((j) => mergedMap.set(j.title, j));
      userJobs.forEach((j) => mergedMap.set(j.title, j));

      setJobs(Array.from(mergedMap.values()));
    } catch (e) {
      console.error(e);
      setJobs(DEFAULT_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const handleSync = () => loadJobs();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <CustomerLayout title="My Job Applications & Vacancies">
      <Head>
        <title>Jobs — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Local Job Openings in Adilabad</h2>
            <p className="text-xs text-slate-500 mt-0.5">Find verified full-time, part-time, and helper job opportunities.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/jobs"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Public Job Board →
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Post a Vacancy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((j) => (
            <div key={j.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {j.status}
                </span>
                <span className="font-bold text-emerald-700 text-xs">{j.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{j.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{j.location}</span>
              </p>
              {j.description && <p className="text-xs text-slate-500 line-clamp-2">{j.description}</p>}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {j.id}</span>
                <a
                  href={`tel:${j.owner_phone}`}
                  className="bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Employer</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="jobs"
        moduleLabel="Job Opening"
        defaultCategory="Drivers & Operators"
        categoryOptions={['Drivers & Transport', 'Sales & Counter Staff', 'Technicians & IT', 'Accountants & Clerks', 'Office Assistant']}
        pricingLabel="Salary Range / Month"
        pricingPlaceholder="e.g. ₹15,000 - ₹20,000"
        onSuccess={loadJobs}
      />
    </CustomerLayout>
  );
}
