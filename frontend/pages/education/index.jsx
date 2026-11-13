import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GraduationCap, MapPin, Phone, Mail, Award, BookOpen, Search, ArrowRight } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function EducationDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const institutions = [
    {
      id: 1,
      name: 'Adilabad Institute of Technology & Polytech',
      type: 'Higher Education & Polytechnic',
      location: 'Utnoor Road, Adilabad',
      courses: ['Diploma in Civil Engineering', 'Computer Science', 'Electrical'],
      phone: '+91 94401 22334',
      rating: 4.8,
      students: '800+ Students',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'
    },
    {
      id: 2,
      name: 'Kakatiya IIT-JEE & NEET Academy',
      type: 'Competitive Coaching',
      location: 'Dwaraka Nagar, Cinema Road',
      courses: ['NEET Foundation', 'IIT-JEE Mains & Advanced', 'Intermediate Bi.P.C / M.P.C'],
      phone: '+91 98480 33445',
      rating: 4.9,
      students: '450+ Students',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'
    },
    {
      id: 3,
      name: 'St. Joseph English Medium High School',
      type: 'High School & Secondary',
      location: 'Teachers Colony, Adilabad',
      courses: ['LKG to 10th Class SSC / CBSE Curriculum', 'Digital Smart Classrooms'],
      phone: '+91 94401 55667',
      rating: 4.7,
      students: '1200+ Students',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'
    }
  ];

  const filtered = institutions.filter((inst) => {
    if (selectedType !== 'all' && !inst.type.toLowerCase().includes(selectedType.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.location.toLowerCase().includes(q) ||
        inst.courses.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <PublicLayout>
      <Head>
        <title>Education, Schools & Coaching Institutes in Adilabad — Adilabad App</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-brand-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Knowledge & Careers
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Education & Coaching in Adilabad
            </h1>
            <p className="mt-3 text-indigo-100 text-sm sm:text-base leading-relaxed">
              Explore accredited degree colleges, intermediate junior colleges, English medium schools, computer institutes, and competitive exam coaching centers.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools, IIT-JEE coaching, polytechnic..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'Coaching', 'School', 'Polytechnic'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-brand-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All Institutes' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div className="h-48 bg-slate-100 relative">
                <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {inst.type}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{inst.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{inst.location}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Featured Courses:
                    </span>
                    {inst.courses.map((c, i) => (
                      <span key={i} className="inline-block bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md mr-1 mb-1">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${inst.phone}`}
                    className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{inst.phone}</span>
                  </a>
                  <Link
                    href={`/contact?subject=Enquiry for ${encodeURIComponent(inst.name)}`}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
