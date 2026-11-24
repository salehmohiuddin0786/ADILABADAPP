import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  RefreshCw,
  History,
  X,
  FileText,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { submissionService } from '../../shared/services/submissionService';
import { useToast } from '../../context/ToastContext';

export default function UniversalBulkImportModal({
  isOpen,
  onClose,
  module = 'services',
  moduleTitle = 'Services Directory',
  onImportSuccess
}) {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // Active tab: 'import' or 'history'
  const [activeTab, setActiveTab] = useState('import');

  // Step: 1 = upload, 2 = preview & validate, 3 = results
  const [step, setStep] = useState(1);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Filter in preview table: 'all', 'valid', 'duplicate', 'invalid'
  const [previewFilter, setPreviewFilter] = useState('all');

  // Duplicate resolution strategy: 'skip' | 'update' | 'import_all'
  const [duplicateStrategy, setDuplicateStrategy] = useState('skip');

  // Import processing state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);

  // History state
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Reset modal state
  const resetUploadState = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setStep(1);
    setPreviewFilter('all');
    setDuplicateStrategy('skip');
    setIsImporting(false);
    setImportProgress(0);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetUploadState();
    setActiveTab('import');
    if (onClose) onClose();
  };

  useEffect(() => {
    if (isOpen && activeTab === 'history') {
      fetchHistory();
    }
    if (!isOpen) {
      resetUploadState();
      setActiveTab('import');
    }
  }, [isOpen, activeTab, module]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await apiFetch(`/bulk-import/${module}/history`);
      if (res && res.success && Array.isArray(res.data)) {
        setHistoryList(res.data);
      } else {
        setHistoryList([]);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch import history.', 'error');
      setHistoryList([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
      addToast('Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.', 'error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      addToast('File size exceeds 25 MB limit.', 'error');
      return;
    }
    setSelectedFile(file);
    setPreviewData(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload and preview
  const handleUploadAndPreview = async () => {
    if (!selectedFile) {
      addToast('Please select an Excel or CSV file first.', 'error');
      return;
    }

    setPreviewLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/bulk-import/${module}/preview`, {
        method: 'POST',
        headers,
        body: formData
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to parse Excel file.');
      }

      setPreviewData(json);
      setStep(2);
      addToast(`Successfully parsed ${json.summary?.totalRecords || 0} records!`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to preview file.', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api';
    const url = `${apiUrl}/bulk-import/${module}/template`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Adilabad_${module}_sample_template.xlsx`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast(`Downloading ${moduleTitle} sample template...`, 'info');
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (!previewData || !previewData.allRows) {
      addToast('No data available to import.', 'error');
      return;
    }

    setIsImporting(true);
    setImportProgress(20);

    const progressInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      const payload = {
        records: previewData.allRows,
        duplicateStrategy,
        fileName: selectedFile?.name || `${module}_import.xlsx`,
        user: { id: 1, name: 'Admin' }
      };

      const res = await apiFetch(`/bulk-import/${module}/execute`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Also sync to frontend submissionService for immediate UI reflection
      if (module !== 'events') {
        await submissionService.bulkImportSubmissions({
          module,
          records: previewData.allRows,
          duplicateStrategy
        });
      }

      clearInterval(progressInterval);
      setImportProgress(100);

      if (res && res.success) {
        setImportResult(res.results);
        setStep(3);
        addToast(`Bulk import completed: ${res.results.successCount} imported, ${res.results.updatedCount} updated.`, 'success');
        if (onImportSuccess) onImportSuccess(res.results);
      } else {
        throw new Error(res?.message || 'Bulk import failed.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      addToast(err.message || 'Failed to complete import.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // Download Failed Records Excel
  const handleDownloadFailedRecords = async () => {
    if (!importResult || !importResult.failedRecords || importResult.failedRecords.length === 0) {
      addToast('No failed records to download.', 'info');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api';
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/bulk-import/${module}/failed-excel`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ failedRecords: importResult.failedRecords })
      });

      if (!res.ok) throw new Error('Failed to generate failed records spreadsheet.');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Failed_${module}_Records_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      addToast('Failed records downloaded.', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (!isOpen) return null;

  const filteredPreviewRows = (previewData?.previewRows || []).filter((row) => {
    if (previewFilter === 'all') return true;
    if (previewFilter === 'valid') return row.status === 'valid';
    if (previewFilter === 'duplicate') return row.status === 'duplicate';
    if (previewFilter === 'invalid') return row.status === 'invalid';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Excel / CSV Bulk Import — {moduleTitle}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                  Admin Tool
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload spreadsheets to import hundreds of {moduleTitle.toLowerCase()} in seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'import'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bulk Import
              </button>
              <button
                onClick={() => {
                  setActiveTab('history');
                  fetchHistory();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  activeTab === 'history'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Import History</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'history' ? (
            /* History Tab Content */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Past Bulk Imports ({historyList.length})</h3>
                  <p className="text-xs text-slate-400">Track and review past spreadsheets imported into {moduleTitle}.</p>
                </div>
                <button
                  onClick={fetchHistory}
                  disabled={historyLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {historyLoading ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-400" />
                  <p className="text-xs">Loading import history...</p>
                </div>
              ) : historyList.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-300">No past imports found</p>
                  <p className="text-xs text-slate-500 mt-1">Spreadsheets imported into {moduleTitle} will appear here.</p>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-inner">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                      <tr>
                        <th className="py-3 px-4">File Name</th>
                        <th className="py-3 px-4">Uploaded By</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4 text-center">Total</th>
                        <th className="py-3 px-4 text-center">Successful</th>
                        <th className="py-3 px-4 text-center">Updated</th>
                        <th className="py-3 px-4 text-center">Failed</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {historyList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/40 transition">
                          <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate max-w-xs">{item.file_name}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{item.uploader_name || 'Admin'}</td>
                          <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                            {new Date(item.created_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-white">{item.total_records}</td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-400">{item.successful_records}</td>
                          <td className="py-3 px-4 text-center text-blue-400">{item.updated_records || 0}</td>
                          <td className="py-3 px-4 text-center font-bold text-rose-400">{item.failed_records}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : item.status === 'partial'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Import Tab Content */
            <div>
              {/* Step Flow Indicator */}
              <div className="flex items-center justify-between mb-8 px-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      step >= 1 ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-xs font-semibold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>
                    Upload File
                  </span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-brand-600' : 'bg-slate-800'}`} />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      step >= 2 ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-xs font-semibold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>
                    Preview & Validate
                  </span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-brand-600' : 'bg-slate-800'}`} />
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      step >= 3 ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-xs font-semibold ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>
                    Import Results
                  </span>
                </div>
              </div>

              {/* STEP 1: Upload File */}
              {step === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Drag and Drop Box */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition ${
                      dragActive
                        ? 'border-brand-500 bg-brand-500/10'
                        : selectedFile
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4">
                      {selectedFile ? (
                        <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <UploadCloud className="w-8 h-8" />
                      )}
                    </div>

                    {selectedFile ? (
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          File Selected
                        </div>
                        <h4 className="text-base font-bold text-white break-all">{selectedFile.name}</h4>
                        <p className="text-xs text-slate-400">
                          {formatFileSize(selectedFile.size)} • Ready to preview & validate
                        </p>

                        <div className="pt-2 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-brand-400 hover:underline"
                          >
                            Change File
                          </button>
                          <span className="text-slate-600">•</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-xs text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-base font-bold text-white">Drag and drop your spreadsheet here</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Supports Microsoft Excel (<span className="text-white font-mono">.xlsx</span>,{' '}
                          <span className="text-white font-mono">.xls</span>) and Comma-Separated Values (
                          <span className="text-white font-mono">.csv</span>) up to 25MB.
                        </p>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/20 transition"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Browse Files</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Template & Action Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <h5 className="text-xs font-bold text-white">Need the correct column structure?</h5>
                      <p className="text-[11px] text-slate-400">
                        Download pre-formatted Excel template with genuine Adilabad sample data.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-400" />
                      <span>Download Sample Template</span>
                    </button>
                  </div>

                  {/* Upload and Preview Action */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!selectedFile || previewLoading}
                      onClick={handleUploadAndPreview}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-brand-600/20 transition"
                    >
                      {previewLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Parsing & Validating...</span>
                        </>
                      ) : (
                        <>
                          <span>Upload and Preview</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Preview & Validate */}
              {step === 2 && previewData && (
                <div className="space-y-6">
                  {/* Validation Summary Stat Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Detected</span>
                      <span className="text-xl font-black text-white mt-0.5 block">
                        {previewData.summary?.totalRecords || 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 uppercase font-mono block flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid Records
                      </span>
                      <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                        {previewData.summary?.validRecords || 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                      <span className="text-[10px] text-amber-400 uppercase font-mono block flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Duplicates
                      </span>
                      <span className="text-xl font-black text-amber-400 mt-0.5 block">
                        {previewData.summary?.duplicateRecords || 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                      <span className="text-[10px] text-rose-400 uppercase font-mono block flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Invalid Records
                      </span>
                      <span className="text-xl font-black text-rose-400 mt-0.5 block">
                        {previewData.summary?.invalidRecords || 0}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30">
                      <span className="text-[10px] text-purple-400 uppercase font-mono block flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> Missing Required
                      </span>
                      <span className="text-xl font-black text-purple-400 mt-0.5 block">
                        {previewData.summary?.missingRequired || 0}
                      </span>
                    </div>
                  </div>

                  {/* Duplicate Strategy Resolution Cards */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Duplicate Handling Policy
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                          duplicateStrategy === 'skip'
                            ? 'bg-brand-600/10 border-brand-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duplicateStrategy"
                          value="skip"
                          checked={duplicateStrategy === 'skip'}
                          onChange={() => setDuplicateStrategy('skip')}
                          className="mt-1 accent-brand-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">Skip Duplicates (Recommended)</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Keep existing records untouched and ignore duplicate rows in the file.
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                          duplicateStrategy === 'update'
                            ? 'bg-brand-600/10 border-brand-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duplicateStrategy"
                          value="update"
                          checked={duplicateStrategy === 'update'}
                          onChange={() => setDuplicateStrategy('update')}
                          className="mt-1 accent-brand-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">Update Existing Records</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Update matching listings with fresh details, pricing, and description.
                          </div>
                        </div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                          duplicateStrategy === 'import_all'
                            ? 'bg-brand-600/10 border-brand-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duplicateStrategy"
                          value="import_all"
                          checked={duplicateStrategy === 'import_all'}
                          onChange={() => setDuplicateStrategy('import_all')}
                          className="mt-1 accent-brand-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">Import All (Keep Both)</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Create new listings regardless of duplicate matches.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Filter and Preview Table */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-white">
                          Sample Preview Table (Showing {filteredPreviewRows.length} of{' '}
                          {previewData.summary?.totalRecords} rows)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={() => setPreviewFilter('all')}
                          className={`px-2.5 py-1 rounded-lg transition ${
                            previewFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                          }`}
                        >
                          All ({previewData.previewRows?.length})
                        </button>
                        <button
                          onClick={() => setPreviewFilter('valid')}
                          className={`px-2.5 py-1 rounded-lg transition ${
                            previewFilter === 'valid' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                          }`}
                        >
                          Valid
                        </button>
                        <button
                          onClick={() => setPreviewFilter('duplicate')}
                          className={`px-2.5 py-1 rounded-lg transition ${
                            previewFilter === 'duplicate' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'
                          }`}
                        >
                          Duplicates
                        </button>
                        <button
                          onClick={() => setPreviewFilter('invalid')}
                          className={`px-2.5 py-1 rounded-lg transition ${
                            previewFilter === 'invalid' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'
                          }`}
                        >
                          Invalid
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-800 rounded-2xl overflow-x-auto bg-slate-950/70 max-h-72 custom-scrollbar">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Title / Name</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Pricing / Rate</th>
                            <th className="py-2.5 px-3">Location / Venue</th>
                            <th className="py-2.5 px-3">Contact</th>
                            <th className="py-2.5 px-3">Validation Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {filteredPreviewRows.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="py-8 text-center text-slate-500">
                                No records match the "{previewFilter}" filter.
                              </td>
                            </tr>
                          ) : (
                            filteredPreviewRows.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40 transition">
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                  {row.rowNumber}
                                </td>
                                <td className="py-2.5 px-3">
                                  {row.status === 'valid' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                      <CheckCircle2 className="w-2.5 h-2.5" /> Valid
                                    </span>
                                  )}
                                  {row.status === 'duplicate' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                      <AlertTriangle className="w-2.5 h-2.5" /> Duplicate
                                    </span>
                                  )}
                                  {row.status === 'invalid' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                      <XCircle className="w-2.5 h-2.5" /> Invalid
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-white max-w-[200px] truncate">
                                  {row.data.title || <span className="text-rose-400 italic">Missing</span>}
                                </td>
                                <td className="py-2.5 px-3 text-slate-300">
                                  {row.data.category || row.data.property_type || '-'}
                                </td>
                                <td className="py-2.5 px-3 text-brand-400 font-mono">
                                  {row.data.pricing || row.data.price || (row.data.daily_rate ? `₹${row.data.daily_rate}/day` : '-')}
                                </td>
                                <td className="py-2.5 px-3 text-slate-400 max-w-[150px] truncate">
                                  {row.data.location || row.data.venue || '-'}
                                </td>
                                <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                                  {row.data.owner_phone || row.data.phone || '-'}
                                </td>
                                <td className="py-2.5 px-3">
                                  {row.errors?.length > 0 && (
                                    <span className="text-rose-400 text-[11px] block">
                                      {row.errors.join(', ')}
                                    </span>
                                  )}
                                  {row.warnings?.length > 0 && (
                                    <span className="text-amber-400 text-[11px] block">
                                      {row.warnings.join(', ')}
                                    </span>
                                  )}
                                  {row.errors?.length === 0 && row.warnings?.length === 0 && (
                                    <span className="text-emerald-400 text-[11px]">Ready to import</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      Back to Upload
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={isImporting || (previewData.summary?.validRecords === 0 && duplicateStrategy === 'skip')}
                        onClick={handleExecuteImport}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition"
                      >
                        {isImporting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Processing {importProgress}%...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Confirm & Import {moduleTitle}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Results Summary */}
              {step === 3 && importResult && (
                <div className="space-y-6 max-w-2xl mx-auto py-4">
                  <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <h3 className="text-xl font-black text-white">Bulk Import Successfully Completed!</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      The records from <span className="text-white font-medium">{selectedFile?.name}</span> have been
                      processed and are now active in the {moduleTitle}.
                    </p>

                    {/* Breakdown metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Processed</span>
                        <span className="text-lg font-black text-white mt-0.5 block">
                          {importResult.totalProcessed || 0}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                        <span className="text-[10px] text-emerald-400 uppercase font-mono block">Imported</span>
                        <span className="text-lg font-black text-emerald-400 mt-0.5 block">
                          {importResult.successCount || 0}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30">
                        <span className="text-[10px] text-blue-400 uppercase font-mono block">Updated</span>
                        <span className="text-lg font-black text-blue-400 mt-0.5 block">
                          {importResult.updatedCount || 0}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                        <span className="text-[10px] text-amber-400 uppercase font-mono block">Skipped</span>
                        <span className="text-lg font-black text-amber-400 mt-0.5 block">
                          {importResult.skippedCount || 0}
                        </span>
                      </div>
                    </div>

                    {importResult.failedCount > 0 && (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between mt-3 text-left">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-xs text-rose-300 font-medium">
                            {importResult.failedCount} records failed validation
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleDownloadFailedRecords}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download Failed (.xlsx)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/20 transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Imported {moduleTitle}</span>
                    </button>

                    <button
                      type="button"
                      onClick={resetUploadState}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Import Another File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
