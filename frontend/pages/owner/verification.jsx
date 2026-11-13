import React, { useState } from 'react';
import Head from 'next/head';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerVerificationPage() {
  const { addToast } = useToast();
  const [kycStatus, setKycStatus] = useState('VERIFIED');
  const [docType, setDocType] = useState('Trade License / Municipal Shop Act');
  const [docNumber, setDocNumber] = useState('ADL-SHOP-2024-8891');

  const handleUploadDoc = (e) => {
    e.preventDefault();
    addToast('Verification document uploaded for district staff review!', 'success');
  };

  return (
    <OwnerLayout title="Verification & KYC Credentials">
      <Head>
        <title>Merchant Verification & KYC — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Adilabad District Verified Commercial Partner</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">KYC & Merchant Compliance</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Verified merchants receive the Green Trust Badge on all rental listings, advertisements, and store profiles across Adilabad.
            </p>
          </div>

          <div className="bg-emerald-900/60 border border-emerald-400/30 px-5 py-3 rounded-2xl text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">Trust Level</span>
            <span className="text-xl font-black text-white">Tier 1 Certified</span>
          </div>
        </div>

        {/* Verification Documents List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Submitted Proofs & Certifications</h3>

            <div className="divide-y divide-slate-100">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Municipal Shop Registration</h4>
                    <p className="text-xs text-slate-500">Reg: ADL-MUNC-2023-7182 • Cinema Road, Adilabad</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Business PAN Card Verification</h4>
                    <p className="text-xs text-slate-500">PAN: AAAAA0000A • Verified via NSDL</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              </div>

              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Storefront Location Verification</h4>
                    <p className="text-xs text-slate-500">Physical audit completed by Adilabad Operations team</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Physical Match
                </span>
              </div>
            </div>
          </div>

          {/* Upload Additional Documents */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Submit New Document</h3>
            <p className="text-xs text-slate-500">Upload additional GST certificates, rental agreements, or insurance papers.</p>

            <form onSubmit={handleUploadDoc} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option>Trade License / Municipal Shop Act</option>
                  <option>GST Registration Certificate</option>
                  <option>Rental Yard Ownership Agreement</option>
                  <option>Aadhaar / Identity Proof</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Document / Certificate No.</label>
                <input
                  type="text"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center cursor-pointer hover:border-amber-500 transition">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-700 block">Select PDF or Image</span>
                <span className="text-[11px] text-slate-400 block">Max 5MB (JPG, PNG, PDF)</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Upload for Verification
              </button>
            </form>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
