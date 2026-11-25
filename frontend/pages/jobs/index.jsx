import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Briefcase, MapPin, IndianRupee, Clock, Building, ArrowRight } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';
import { apiFetch } from '../../src/utils/api';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await apiFetch('/jobs');
        if (res && res.success && Array.isArray(res.data)) {
          setJobs(res.data);
        }
      } catch (err) {
        console.warn('Jobs fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

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
                    {job.job_type || job.type || 'Full Time'}
                  </span>
                  <span className="text-xs text-slate-400">Deadline: {job.deadline || 'Ongoing'}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{job.title}</h3>
                <p className="text-xs font-bold text-slate-600 flex items-center">
                  <Building className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
                  <span>{job.company_name || job.company}</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center font-bold text-emerald-800">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                    {job.salary || (job.min_salary ? `₹${Number(job.min_salary).toLocaleString('en-IN')} - ₹${Number(job.max_salary).toLocaleString('en-IN')} / mo` : 'Competitive')}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-0.5 text-amber-500" /> {job.location}
                  </span>
                  <span>Qualification: <strong>{job.qualification || 'Graduate'}</strong></span>
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
