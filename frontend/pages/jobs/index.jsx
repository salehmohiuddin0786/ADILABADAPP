import React, { useState } from 'react';
import Head from 'next/head';
import { Briefcase, MapPin, IndianRupee, Clock, Building, ArrowRight } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function JobsPage() {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Branch Accountant & Tally Operator',
      company: 'Adilabad Cotton Ginning Mills',
      type: 'Full Time',
      salary: '₹22,000 - ₹28,000 / month',
      qualification: 'B.Com / M.Com + 2 Yrs Exp',
      location: 'Industrial Area, Mavala, Adilabad',
      deadline: '2026-11-30'
    },
    {
      id: 2,
      title: 'Showroom Sales Executive (Electronics & Mobiles)',
      company: 'Sri Balaji Digital Showroom',
      type: 'Full Time',
      salary: '₹15,000 - ₹20,000 + Incentives',
      qualification: 'Intermediate / Any Graduate',
      location: 'Cinema Road, Adilabad',
      deadline: '2026-11-25'
    },
    {
      id: 3,
      title: 'Senior High School Mathematics Teacher',
      company: 'Kakatiya High School',
      type: 'Full Time',
      salary: '₹25,000 - ₹35,000 / month',
      qualification: 'B.Sc / M.Sc B.Ed',
      location: 'Vidya Nagar, Adilabad',
      deadline: '2026-12-05'
    }
  ]);

  return (
    <PublicLayout>
      <Head>
        <title>Jobs in Adilabad — Local Career & Showroom Openings</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Local Employment Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Careers & Jobs in Adilabad
          </h1>
          <p className="mt-2 text-emerald-100 text-sm max-w-xl">
            Explore verified vacancies in Adilabad showrooms, educational institutions, hospitals, accounts, and businesses.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {job.type}
                  </span>
                  <span className="text-xs text-slate-400">Deadline: {job.deadline}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{job.title}</h3>
                <p className="text-xs font-bold text-slate-600 flex items-center">
                  <Building className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
                  <span>{job.company}</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center font-bold text-emerald-800">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5" /> {job.salary}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-0.5 text-amber-500" /> {job.location}
                  </span>
                  <span>Qualification: <strong>{job.qualification}</strong></span>
                </div>
              </div>

              <button className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-1.5 self-end md:self-center">
                <span>Apply Direct</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
