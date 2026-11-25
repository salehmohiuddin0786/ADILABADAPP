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
import { useToast } from '../../context/ToastContext';

export default function BusinessBulkImportModal({ isOpen, onClose, onImportSuccess }) {
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

  // Duplicate resolution strategy
  const [duplicateStrategy, setDuplicateStrategy] = useState('skip'); // 'skip' | 'update' | 'import_all'

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
  }, [isOpen, activeTab]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await apiFetch('/businesses/admin/import/history');
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

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adilabad_token') : '';
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api';
    const url = `${apiBase}/businesses/admin/import/template${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    window.open(url, '_blank');
  };

  // Download Failed Records Excel
  const handleDownloadFailed = (importId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adilabad_token') : '';
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api';
    const url = `${apiBase}/businesses/admin/import/failed/${importId}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    window.open(url, '_blank');
  };

  // Upload and Preview
  const handleUploadAndPreview = async () => {
    if (!selectedFile) {
      addToast('Please select an Excel or CSV file first.', 'warning');
      return;
    }

    setPreviewLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await apiFetch('/businesses/admin/import/preview', {
        method: 'POST',
        body: formData,
        timeout: 60000
      });

      if (res && res.success && res.data) {
        setPreviewData(res.data);
        setStep(2);
        addToast(res.message || 'File parsed and validated successfully.', 'success');
      } else {
        throw new Error(res?.message || 'Failed to preview Excel file.');
      }
    } catch (err) {
      addToast(err.message || 'Error parsing file. Please check columns.', 'error');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Execute Bulk Import
  const handleExecuteImport = async () => {
    if (!previewData || !Array.isArray(previewData.preview)) {
      addToast('No validated preview data available.', 'error');
      return;
    }

    // Filter out invalid records
    const importableRows = previewData.preview.filter(r => r.status !== 'invalid');
    if (importableRows.length === 0) {
      addToast('No valid records found to import.', 'warning');
      return;
    }

    if (duplicateStrategy === 'import_all') {
      const confirmed = window.confirm(
        'Warning: You have selected "Import All" for duplicates. This may create duplicate business records in the directory. Proceed?'
      );
      if (!confirmed) return;
    }

    setIsImporting(true);
    setImportProgress(25);

    try {
      const progressTimer = setInterval(() => {
        setImportProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 300);

      const res = await apiFetch('/businesses/admin/import/execute', {
        method: 'POST',
        body: JSON.stringify({
          records: importableRows,
          duplicateStrategy,
          fileName: selectedFile?.name || previewData.fileName || 'businesses.xlsx'
        }),
        timeout: 90000
      });

      clearInterval(progressTimer);
      setImportProgress(100);

      if (res && res.success && res.data) {
        setImportResult(res.data);
        setStep(3);
        addToast(res.message || 'Bulk import completed successfully!', 'success');
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        throw new Error(res?.message || 'Failed to execute import.');
      }
    } catch (err) {
      addToast(err.message || 'Import execution failed.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  // Filter preview table rows
  const filteredPreviewRows = (previewData?.preview || []).filter(row => {
    if (previewFilter === 'all') return true;
    return row.status === previewFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Excel/CSV Bulk Import</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Business Directory
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload and import hundreds of verified local businesses into Adilabad App with duplicate checks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'import'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Import</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MOBILE TAB BAR */}
        <div className="flex sm:hidden border-b border-slate-800 bg-slate-950/40 p-2">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'import' ? 'bg-brand-600 text-white' : 'text-slate-400'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-brand-600 text-white' : 'text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'import' && (
            <>
              {/* STEP 1: FILE UPLOAD & TEMPLATE DOWNLOAD */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Top Action / Template Banner */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Need the correct column format?</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Download our pre-formatted sample Excel file with sample Adilabad businesses, column widths, and instructions.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 shadow-sm transition shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-400" />
                      <span>Download Sample Excel Template</span>
                    </button>
                  </div>

                  {/* Drag-and-drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                      dragActive
                        ? 'border-brand-500 bg-brand-500/10'
                        : selectedFile
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="excel-file-input"
                    />

                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-brand-400 shadow-lg">
                        <UploadCloud className="w-8 h-8" />
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          Drag & drop your Excel or CSV file here
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Supports standard Excel files (<span className="text-slate-300 font-mono">.xlsx</span>, <span className="text-slate-300 font-mono">.xls</span>) and Comma-Separated Values (<span className="text-slate-300 font-mono">.csv</span>) up to 25 MB.
                        </p>
                      </div>

                      <div className="pt-2">
                        <label
                          htmlFor="excel-file-input"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 cursor-pointer transition"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          <span>Browse Files</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Selected File Details */}
                  {selectedFile && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready for validation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={resetUploadState}
                          className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-bold transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleUploadAndPreview}
                      disabled={!selectedFile || previewLoading}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                        !selectedFile || previewLoading
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25'
                      }`}
                    >
                      {previewLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Analyzing & Validating...</span>
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

              {/* STEP 2: PREVIEW & VALIDATION */}
              {step === 2 && previewData && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Rows</p>
                      <p className="text-xl font-black text-white mt-1">{previewData.totalRecords}</p>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-900/40 p-3.5 rounded-2xl">
                      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Valid Records</p>
                      <p className="text-xl font-black text-emerald-400 mt-1">{previewData.validRecords}</p>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-2xl">
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Duplicates</p>
                      <p className="text-xl font-black text-amber-400 mt-1">{previewData.duplicateRecords}</p>
                    </div>

                    <div className="bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-2xl">
                      <p className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Invalid Rows</p>
                      <p className="text-xl font-black text-rose-400 mt-1">{previewData.invalidRecords}</p>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl col-span-2 sm:col-span-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing Required</p>
                      <p className="text-xl font-black text-slate-300 mt-1">{previewData.missingRequiredFields}</p>
                    </div>
                  </div>

                  {/* Duplicate Strategy Resolution Selector */}
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Duplicate Records Handling Policy ({previewData.duplicateRecords} potential duplicates detected)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          duplicateStrategy === 'skip'
                            ? 'bg-brand-500/10 border-brand-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duplicateStrategy"
                          value="skip"
                          checked={duplicateStrategy === 'skip'}
                          onChange={() => setDuplicateStrategy('skip')}
                          className="mt-0.5 text-brand-500 focus:ring-brand-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">Skip Duplicates (Recommended)</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Keep existing directory records untouched. Only import brand new businesses.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          duplicateStrategy === 'update'
                            ? 'bg-brand-500/10 border-brand-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duplicateStrategy"
                          value="update"
                          checked={duplicateStrategy === 'update'}
                          onChange={() => setDuplicateStrategy('update')}
                          className="mt-0.5 text-brand-500 focus:ring-brand-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-white">Update Existing Records</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Update matching businesses with new phone numbers, addresses, categories or GPS data.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          duplicateStrategy === 'import_all'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duplicateStrategy"
                          value="import_all"
                          checked={duplicateStrategy === 'import_all'}
                          onChange={() => setDuplicateStrategy('import_all')}
                          className="mt-0.5 text-amber-500 focus:ring-amber-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-amber-300">Import All as New</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Forces insertion of duplicate names/phones with newly generated distinct slugs.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Filter Tabs for Preview Table */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <button
                        onClick={() => setPreviewFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          previewFilter === 'all'
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        All ({previewData.totalRecords})
                      </button>
                      <button
                        onClick={() => setPreviewFilter('valid')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          previewFilter === 'valid'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800/80 text-emerald-400 hover:text-emerald-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valid ({previewData.validRecords})</span>
                      </button>
                      <button
                        onClick={() => setPreviewFilter('duplicate')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          previewFilter === 'duplicate'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800/80 text-amber-400 hover:text-amber-300'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Duplicates ({previewData.duplicateRecords})</span>
                      </button>
                      <button
                        onClick={() => setPreviewFilter('invalid')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          previewFilter === 'invalid'
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-800/80 text-rose-400 hover:text-rose-300'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Invalid ({previewData.invalidRecords})</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 shrink-0">
                      Showing {filteredPreviewRows.length} rows
                    </p>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-3 w-12 text-center">Row</th>
                          <th className="py-3 px-3 w-24">Status</th>
                          <th className="py-3 px-4">Business Name</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Locality / City</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-4">Validation / Duplicate Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredPreviewRows.map((row) => (
                          <tr
                            key={row.rowNumber}
                            className={`hover:bg-slate-800/40 transition ${
                              row.status === 'invalid'
                                ? 'bg-rose-950/10'
                                : row.status === 'duplicate'
                                ? 'bg-amber-950/10'
                                : ''
                            }`}
                          >
                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              #{row.rowNumber}
                            </td>
                            <td className="py-3 px-3">
                              {row.status === 'valid' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                                  <Check className="w-3 h-3" />
                                  <span>Valid</span>
                                </span>
                              )}
                              {row.status === 'duplicate' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Duplicate</span>
                                </span>
                              )}
                              {row.status === 'invalid' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                                  <XCircle className="w-3 h-3" />
                                  <span>Invalid</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-white">
                              {row.data?.name || row.raw?.name || <span className="text-rose-400 italic">[Missing Name]</span>}
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {row.data?.category_name || row.raw?.category || <span className="text-rose-400 italic">[Missing]</span>}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {row.data?.locality || row.raw?.locality || 'Adilabad'}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-300">
                              {row.data?.phone || row.raw?.phone || '—'}
                            </td>
                            <td className="py-3 px-4">
                              {row.errors && row.errors.length > 0 ? (
                                <span className="text-rose-400 font-medium">
                                  {row.errors.join('; ')}
                                </span>
                              ) : row.duplicateInfo ? (
                                <span className="text-amber-400 font-medium">
                                  {row.duplicateInfo.reason}
                                </span>
                              ) : (
                                <span className="text-emerald-400">Ready to import</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Progress Bar during Import */}
                  {isImporting && (
                    <div className="space-y-2 p-4 rounded-2xl bg-brand-950/40 border border-brand-800">
                      <div className="flex items-center justify-between text-xs text-brand-300 font-bold">
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing bulk import and saving to database...</span>
                        </span>
                        <span>{importProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setStep(1)}
                      disabled={isImporting}
                      className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition"
                    >
                      &larr; Choose Different File
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={onClose}
                        disabled={isImporting}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleExecuteImport}
                        disabled={isImporting || (previewData.validRecords === 0 && previewData.duplicateRecords === 0)}
                        className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                          isImporting || (previewData.validRecords === 0 && previewData.duplicateRecords === 0)
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30'
                        }`}
                      >
                        {isImporting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Importing Businesses...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>
                              Import Businesses ({previewData.validRecords + (duplicateStrategy === 'skip' ? 0 : previewData.duplicateRecords)} records)
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: RESULTS SUMMARY */}
              {step === 3 && importResult && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white tracking-tight">
                      Bulk Import Process Completed!
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      The business records have been saved into the database and are immediately live in the Adilabad Business Directory.
                    </p>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto text-left">
                    <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Processed</p>
                      <p className="text-lg font-black text-white mt-0.5">{importResult.total}</p>
                    </div>
                    <div className="bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase">Imported New</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">{importResult.imported}</p>
                    </div>
                    <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Updated Existing</p>
                      <p className="text-lg font-black text-blue-400 mt-0.5">{importResult.updated}</p>
                    </div>
                    <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-amber-400 uppercase">Skipped Dups</p>
                      <p className="text-lg font-black text-amber-400 mt-0.5">{importResult.skipped}</p>
                    </div>
                    <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-rose-400 uppercase">Failed Records</p>
                      <p className="text-lg font-black text-rose-400 mt-0.5">{importResult.failed}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-800">
                    <button
                      onClick={() => {
                        handleClose();
                        if (onImportSuccess) onImportSuccess();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Imported Businesses</span>
                    </button>

                    {importResult.failed > 0 && (
                      <button
                        onClick={() => handleDownloadFailed(importResult.importId)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Failed Records Excel ({importResult.failed})</span>
                      </button>
                    )}

                    <button
                      onClick={resetUploadState}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Import Another File</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: IMPORT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Import History Log</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Previous bulk Excel and CSV business import jobs executed on this system.
                  </p>
                </div>
                <button
                  onClick={fetchHistory}
                  disabled={historyLoading}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {historyLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
                  <span>Loading import history records...</span>
                </div>
              ) : historyList.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <FileSpreadsheet className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-300">No import history found</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your previous bulk business upload jobs will appear here.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">File Name</th>
                        <th className="py-3 px-3">Uploaded By</th>
                        <th className="py-3 px-3">Upload Date & Time</th>
                        <th className="py-3 px-3 text-center">Total</th>
                        <th className="py-3 px-3 text-center">Success</th>
                        <th className="py-3 px-3 text-center">Failed</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Error Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {historyList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate max-w-[200px]" title={item.file_name}>
                              {item.file_name}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">{item.uploader_name || 'Admin'}</td>
                          <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                            {new Date(item.created_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-white">{item.total_records}</td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-400">
                            {item.successful_records + (item.updated_records || 0)}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-rose-400">
                            {item.failed_records}
                          </td>
                          <td className="py-3 px-3">
                            {item.status === 'completed' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                                Completed
                              </span>
                            )}
                            {item.status === 'partial' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                                Partial
                              </span>
                            )}
                            {item.status === 'failed' && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold text-[10px]">
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.failed_records > 0 ? (
                              <button
                                onClick={() => handleDownloadFailed(item.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-bold transition"
                                title="Download Failed Records Excel"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download Excel</span>
                              </button>
                            ) : (
                              <span className="text-slate-600 text-[11px]">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
