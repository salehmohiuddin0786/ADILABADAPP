import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderTree, Plus, Edit, Trash2, Tag, Check, X } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { getCategoryIcon } from '../../src/utils/iconMap';
import { apiFetch } from '../../src/utils/api';
import { useToast } from '../../src/context/ToastContext';
import { modalOverlayVariants, modalContentVariants } from '../../src/shared/animations/motionPresets';

export default function AdminCategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/categories/admin/list');
      if (res && res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (res && Array.isArray(res)) {
        setCategories(res);
      } else if (res && res.data && typeof res.data === 'object') {
        setCategories(Array.isArray(res.data) ? res.data : [res.data]);
      } else {
        setCategories([]);
      }
    } catch (err) {
      addToast(err.message, 'error');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setIcon('Tag');
    setDescription('');
    setDisplayOrder((Array.isArray(categories) ? categories.length : 0) + 1);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || 'Tag');
    setDescription(cat.description || '');
    setDisplayOrder(cat.display_order || 0);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await apiFetch(`/categories/admin/update/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name, icon, description, display_order: displayOrder })
        });
        if (res.success) {
          addToast('Category updated successfully!', 'success');
          setModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await apiFetch('/categories/admin/create', {
          method: 'POST',
          body: JSON.stringify({ name, icon, description, display_order: displayOrder })
        });
        if (res.success) {
          addToast('Category created successfully!', 'success');
          setModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await apiFetch(`/categories/admin/delete/${id}`, { method: 'DELETE' });
      if (res.success) {
        addToast(res.message, 'success');
        fetchCategories();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="Category Management">
      <Head>
        <title>Manage Categories — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Categories ({(Array.isArray(categories) ? categories.length : 0)})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Control category ordering, icons, and classifications.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Icon & Name</th>
                  <th className="py-4 px-4">Slug</th>
                  <th className="py-4 px-4">Order</th>
                  <th className="py-4 px-4">Ads Count</th>
                  <th className="py-4 px-4">Businesses</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(Array.isArray(categories) ? categories : []).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-950/80 border border-brand-700/60 text-brand-300 flex items-center justify-center shrink-0 shadow">
                          {getCategoryIcon(c.icon, 'w-5 h-5')}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{c.name}</span>
                          <span className="text-xs text-slate-400 line-clamp-1">{c.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-slate-400">{c.slug}</td>
                    <td className="py-4 px-4 font-bold text-xs text-slate-300">{c.display_order}</td>
                    <td className="py-4 px-4 font-bold text-xs text-brand-400">{c.total_ads || 0}</td>
                    <td className="py-4 px-4 font-bold text-xs text-slate-300">{c.total_businesses || 0}</td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-2 text-slate-400 hover:text-brand-300 hover:bg-slate-800 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalOverlayVariants}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalContentVariants}
              className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-800 text-white max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-bold text-white text-lg mb-4">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Lucide Icon Name
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. Briefcase, Home, Car, Utensils"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
