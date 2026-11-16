import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Wrench, Plus, MapPin, Phone, MessageCircle, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function CustomerServicesPage() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Default verified seed services
  const DEFAULT_SERVICES = [
    {
      id: 'SRV-101',
      title: 'Expert Home Electrical Repairs & Inverter Wiring',
      owner_name: 'Suresh Electricals & Power Solutions',
      category: 'Electrician & Power',
      pricing: '₹350 visiting / job',
      location: 'Cinema Road, Adilabad',
      owner_phone: '+91 98480 22334',
      status: 'PUBLISHED',
      description: 'Fan rewinding, switchboard repair, MCB tripping fixes, and inverter backup wiring in Adilabad.'
    },
    {
      id: 'SRV-102',
      title: 'Complete Plumbing, Water Tank Cleaning & Pipeline Fitting',
      owner_name: 'Adilabad Flow Plumbing Services',
      category: 'Plumber & Sanitation',
      pricing: '₹300 visiting / job',
      location: 'Subhash Nagar, Adilabad',
      owner_phone: '+91 94401 92834',
      status: 'PUBLISHED',
      description: 'Motor pump repair, bathroom leakage fix, CPVC pipe welding, and overhead tank high-pressure jet cleaning.'
    },
    {
      id: 'SRV-103',
      title: 'Split & Window AC Servicing, Gas Refill & Installation',
      owner_name: 'Cool Breeze AC & Refrigeration Works',
      category: 'AC & Cooling Technician',
      pricing: '₹499 basic service',
      location: 'Collectorate Road, Adilabad',
      owner_phone: '+91 98765 43210',
      status: 'PUBLISHED',
      description: 'Certified technicians for Daikin, Voltas, Blue Star, LG. Deep foam wash and refrigerant top-up.'
    }
  ];

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'services' });
      const userServices = Array.isArray(res.data) ? res.data : [];

      // Merge user services with default services
      const mergedMap = new Map();
      DEFAULT_SERVICES.forEach((s) => mergedMap.set(s.id, s));
      userServices.forEach((s) => mergedMap.set(s.id, s));

      setServices(Array.from(mergedMap.values()));
    } catch (e) {
      console.error(e);
      setServices(DEFAULT_SERVICES);
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
    <CustomerLayout title="My Service Requests">
      <Head>
        <title>Services — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Local Service Directory & Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect directly with verified electricians, plumbers, drone pilots, technicians, and repair experts in Adilabad.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/services"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Public Directory →
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Post a Service Listing
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center gap-2 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Loading verified services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {s.status === 'PUBLISHED' ? 'Verified Expert' : s.status}
                      </span>
                      <span className="font-black text-emerald-700 text-xs">{s.pricing}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                    <p className="text-xs font-semibold text-slate-600">
                      Provider: <strong className="text-slate-800">{s.owner_name}</strong>
                    </p>

                    <div className="flex items-center text-xs text-slate-500 space-x-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{s.location}</span>
                    </div>

                    {s.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 pt-1">{s.description}</p>
                    )}

                    {s.review_notes && (
                      <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                        <strong>Admin Note:</strong> {s.review_notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">ID: {s.id}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${s.owner_phone}`}
                        className="bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${s.owner_phone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="services"
        moduleLabel="Professional Service"
        defaultCategory="Electrician & Power"
        categoryOptions={['Electrician & Power', 'Plumber & Sanitation', 'AC & Cooling Technician', 'Drone & Videography', 'Carpentry & Woodwork', 'Automobile Repair']}
        pricingLabel="Service Pricing / Visiting Fee"
        pricingPlaceholder="e.g. ₹350 / visit or ₹2,500 / job"
        onSuccess={loadServices}
      />
    </CustomerLayout>
  );
}
