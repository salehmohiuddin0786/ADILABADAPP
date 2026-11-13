import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  MapPin,
  Building,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Edit2,
  Trash2,
  ChevronRight,
  Globe,
  Compass,
  Layers,
  Sparkles,
  Check,
  X,
  Share2
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';

export default function AdminLocationsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const [mandals, setMandals] = useState([
    {
      id: 1,
      name: 'Adilabad Urban',
      slug: 'adilabad-urban',
      type: 'Urban Municipality',
      pincode: '504001',
      wards: 49,
      keyHubs: 'Cinema Road, Shivaji Chowk, Gandhi Chowk, Dwaraka Nagar',
      population: '145,000+',
      activeListings: 48,
      status: 'active'
    },
    {
      id: 2,
      name: 'Mavala',
      slug: 'mavala',
      type: 'Urban Suburb',
      pincode: '504002',
      wards: 12,
      keyHubs: 'Mavala Lake View, Collectorate Road, Teachers Colony',
      population: '38,000+',
      activeListings: 18,
      status: 'active'
    },
    {
      id: 3,
      name: 'Adilabad Rural',
      slug: 'adilabad-rural',
      type: 'Rural Mandal',
      pincode: '504001',
      wards: 24,
      keyHubs: 'Dasnapur, Battisgarh, Anukunta',
      population: '52,000+',
      activeListings: 14,
      status: 'active'
    },
    {
      id: 4,
      name: 'Utnoor',
      slug: 'utnoor',
      type: 'Agency & Tribal Agency',
      pincode: '504311',
      wards: 18,
      keyHubs: 'Utnoor Cross Roads, ITDA Complex, Main Market',
      population: '62,000+',
      activeListings: 11,
      status: 'active'
    },
    {
      id: 5,
      name: 'Jainath',
      slug: 'jainath',
      type: 'Rural Mandal',
      pincode: '504309',
      wards: 16,
      keyHubs: 'Jainath Temple Road, Agriculture Market Yard',
      population: '44,000+',
      activeListings: 8,
      status: 'active'
    },
    {
      id: 6,
      name: 'Bela',
      slug: 'bela',
      type: 'Border Mandal',
      pincode: '504310',
      wards: 14,
      keyHubs: 'Bela Checkpost, Cotton Ginning Hub',
      population: '41,000+',
      activeListings: 7,
      status: 'active'
    },
    {
      id: 7,
      name: 'Boath',
      slug: 'boath',
      type: 'Rural Commercial Hub',
      pincode: '504304',
      wards: 20,
      keyHubs: 'Boath Bus Stand, Weekly Cattle Market',
      population: '58,000+',
      activeListings: 9,
      status: 'active'
    },
    {
      id: 8,
      name: 'Ichoda (Echoda)',
      slug: 'ichoda',
      type: 'Highway Commercial Hub',
      pincode: '504307',
      wards: 18,
      keyHubs: 'NH-44 Junction, Dhaba Corridor, Cotton Depot',
      population: '49,000+',
      activeListings: 12,
      status: 'active'
    },
    {
      id: 9,
      name: 'Indervelly',
      slug: 'indervelly',
      type: 'Agency & Tribal Agency',
      pincode: '504308',
      wards: 14,
      keyHubs: 'Indervelly Memorial, Weekly Shandy, Tribal Co-op',
      population: '36,000+',
      activeListings: 5,
      status: 'active'
    },
    {
      id: 10,
      name: 'Narnoor',
      slug: 'narnoor',
      type: 'Agency & Tribal Agency',
      pincode: '504311',
      wards: 12,
      keyHubs: 'Gadiguda Road, Bamboo Crafts Center',
      population: '32,000+',
      activeListings: 4,
      status: 'active'
    },
    {
      id: 11,
      name: 'Gudihathnoor',
      slug: 'gudihathnoor',
      type: 'Rural Mandal',
      pincode: '504308',
      wards: 15,
      keyHubs: 'NH Highway Hub, Toll Plaza Zone',
      population: '37,000+',
      activeListings: 6,
      status: 'active'
    },
    {
      id: 12,
      name: 'Bazarhathnoor',
      slug: 'bazarhathnoor',
      type: 'Rural Mandal',
      pincode: '504304',
      wards: 14,
      keyHubs: 'Grain Market, Primary Health Center Zone',
      population: '31,000+',
      activeListings: 4,
      status: 'active'
    },
    {
      id: 13,
      name: 'Neradigonda',
      slug: 'neradigonda',
      type: 'Tourism & Waterfall Zone',
      pincode: '504323',
      wards: 16,
      keyHubs: 'Kuntala Falls Junction, Pochera Falls Hub',
      population: '34,000+',
      activeListings: 8,
      status: 'active'
    },
    {
      id: 14,
      name: 'Sirikonda',
      slug: 'sirikonda',
      type: 'Agency & Tribal Agency',
      pincode: '504308',
      wards: 11,
      keyHubs: 'Forestry Depot, Honey Collection Point',
      population: '26,000+',
      activeListings: 3,
      status: 'active'
    },
    {
      id: 15,
      name: 'Tamsi',
      slug: 'tamsi',
      type: 'Rural Mandal',
      pincode: '504312',
      wards: 13,
      keyHubs: 'Soybean Trade Center, Godown Sector',
      population: '29,000+',
      activeListings: 5,
      status: 'active'
    },
    {
      id: 16,
      name: 'Bheempoor',
      slug: 'bheempoor',
      type: 'Border Mandal',
      pincode: '504312',
      wards: 12,
      keyHubs: 'Penganga River Border Basin, Agritech',
      population: '28,000+',
      activeListings: 4,
      status: 'active'
    },
    {
      id: 17,
      name: 'Talamadugu',
      slug: 'talamadugu',
      type: 'Rural Mandal',
      pincode: '504312',
      wards: 14,
      keyHubs: 'Kajjarla Road, Farm Storage',
      population: '33,000+',
      activeListings: 5,
      status: 'active'
    },
    {
      id: 18,
      name: 'Gadiguda',
      slug: 'gadiguda',
      type: 'Agency & Tribal Agency',
      pincode: '504311',
      wards: 10,
      keyHubs: 'Hills Tribal Council, Forest Product Center',
      population: '22,000+',
      activeListings: 3,
      status: 'active'
    }
  ]);

  const [newMandal, setNewMandal] = useState({
    name: '',
    pincode: '',
    type: 'Rural Mandal',
    keyHubs: '',
    population: ''
  });

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleAddMandal = (e) => {
    e.preventDefault();
    if (!newMandal.name || !newMandal.pincode) return;

    const created = {
      id: Date.now(),
      name: newMandal.name,
      slug: newMandal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: newMandal.type,
      pincode: newMandal.pincode,
      wards: 10,
      keyHubs: newMandal.keyHubs || 'Main Center',
      population: newMandal.population || '30,000+',
      activeListings: 0,
      status: 'active'
    };

    setMandals((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewMandal({ name: '', pincode: '', type: 'Rural Mandal', keyHubs: '', population: '' });
    showNotice(`Added location: ${created.name} (${created.pincode})`);
  };

  const handleDeleteMandal = (id, name) => {
    setMandals((prev) => prev.filter((m) => m.id !== id));
    showNotice(`Removed location: ${name}`);
  };

  const filteredMandals = mandals.filter((m) => {
    if (selectedType !== 'all' && m.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.pincode.includes(q) ||
        m.keyHubs.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const uniqueTypes = Array.from(new Set(mandals.map((m) => m.type)));

  return (
    <AdminLayout title="Adilabad District Mandals & Locations">
      <Head>
        <title>Locations & Mandals — Super Admin Adilabad App</title>
      </Head>

      {/* Floating Action Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 text-emerald-200 border border-emerald-600/50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* District Overview Header Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-brand-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Adilabad District Geographic Architecture
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full governance over all 18 Mandals, municipal wards, postal pincodes, and commercial geofencing.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/25 transition shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Configure New Location</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Mandals</span>
                <p className="text-2xl font-black text-white mt-0.5">{mandals.length}</p>
              </div>
              <Globe className="w-6 h-6 text-brand-400/40" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">
                  {mandals.reduce((acc, m) => acc + m.activeListings, 0)}
                </p>
              </div>
              <Layers className="w-6 h-6 text-emerald-400/40" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agency Tribal Mandals</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">
                  {mandals.filter((m) => m.type.includes('Agency')).length}
                </p>
              </div>
              <Compass className="w-6 h-6 text-amber-400/40" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Geofencing Status</span>
                <p className="text-2xl font-black text-teal-400 mt-0.5">100% Active</p>
              </div>
              <Sparkles className="w-6 h-6 text-teal-400/40" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              All Types ({mandals.length})
            </button>
            {uniqueTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-brand-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by mandal, pincode, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Mandals Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMandals.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
                    {m.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                    PIN: {m.pincode}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white tracking-tight mb-1">
                  {m.name}
                </h3>

                <p className="text-xs text-slate-400 mb-3">
                  <strong className="text-slate-300">Commercial Hubs: </strong>
                  {m.keyHubs}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-3 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pop. Estimate:</span>
                    <span className="text-white font-bold">{m.population}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Active Listings:</span>
                    <span className="text-emerald-400 font-bold">{m.activeListings} items</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Geofenced
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showNotice(`Simulating edit for location: ${m.name}`)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Edit Location"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMandal(m.id, m.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add New Location */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white">Add District Location / Mandal</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMandal} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mandal / Town Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jainath Rural"
                    value={newMandal.name}
                    onChange={(e) => setNewMandal({ ...newMandal, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Postal Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 504001"
                      value={newMandal.pincode}
                      onChange={(e) => setNewMandal({ ...newMandal, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Zone Type</label>
                    <select
                      value={newMandal.type}
                      onChange={(e) => setNewMandal({ ...newMandal, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="Urban Municipality">Urban Municipality</option>
                      <option value="Urban Suburb">Urban Suburb</option>
                      <option value="Rural Mandal">Rural Mandal</option>
                      <option value="Agency & Tribal Agency">Agency & Tribal Agency</option>
                      <option value="Border Mandal">Border Mandal</option>
                      <option value="Highway Commercial Hub">Highway Commercial Hub</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Key Commercial Hubs</label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly Market Yard, Bus Stand Road"
                    value={newMandal.keyHubs}
                    onChange={(e) => setNewMandal({ ...newMandal, keyHubs: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Estimated Population</label>
                  <input
                    type="text"
                    placeholder="e.g. 45,000+"
                    value={newMandal.population}
                    onChange={(e) => setNewMandal({ ...newMandal, population: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md shadow-brand-600/30"
                  >
                    Save Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
