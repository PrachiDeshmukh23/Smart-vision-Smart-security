import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Edit2, Trash2, Search, X, Check,
  Image, FileText, Layers, AlertCircle, Loader2
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Badge from '../../components/ui/Badge';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    model_number: '',
    short_description: '',
    description: '',
    price: '',
    show_price: false,
    featured: false,
    is_new: false,
    stock_status: 'in_stock',
    seo_title: '',
    seo_description: '',
    status: 'active',
    specifications: [{ name: '', value: '' }]
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products/admin/all'),
        api.get('/categories/admin/all')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Products admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category_id: categories.length > 0 ? String(categories[0].id) : '',
      model_number: '',
      short_description: '',
      description: '',
      price: '',
      show_price: false,
      featured: false,
      is_new: false,
      stock_status: 'in_stock',
      seo_title: '',
      seo_description: '',
      status: 'active',
      specifications: [
        { name: 'Resolution', value: '3MP' },
        { name: 'Lens', value: '3.6 MM' },
        { name: 'Vision', value: 'Full HD Colour Vision' },
        { name: 'Mic', value: 'In-Built Mic' },
        { name: 'Night Vision', value: 'Yes' },
        { name: 'DVR Support', value: 'All DVR Supported' }
      ]
    });
    setMainImageFile(null);
    setBrochureFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name || '',
      category_id: String(p.category_id || ''),
      model_number: p.model_number || '',
      short_description: p.short_description || '',
      description: p.description || '',
      price: p.price ? String(p.price) : '',
      show_price: !!p.show_price,
      featured: !!p.featured,
      is_new: !!p.is_new,
      stock_status: p.stock_status || 'in_stock',
      seo_title: p.seo_title || '',
      seo_description: p.seo_description || '',
      status: p.status || 'active',
      specifications: p.specifications && p.specifications.length > 0
        ? p.specifications.map(s => ({ name: s.specification_name, value: s.specification_value }))
        : [{ name: '', value: '' }]
    });
    setMainImageFile(null);
    setBrochureFile(null);
    setIsModalOpen(true);
  };

  const addSpecRow = () => {
    setForm({
      ...form,
      specifications: [...form.specifications, { name: '', value: '' }]
    });
  };

  const removeSpecRow = (index) => {
    const updated = form.specifications.filter((_, i) => i !== index);
    setForm({ ...form, specifications: updated.length > 0 ? updated : [{ name: '', value: '' }] });
  };

  const updateSpecRow = (index, field, val) => {
    const updated = [...form.specifications];
    updated[index][field] = val;
    setForm({ ...form, specifications: updated });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.model_number) {
      alert('Please provide Product Name, Category, and Model Number.');
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append('name', form.name);
    data.append('category_id', form.category_id);
    data.append('model_number', form.model_number);
    data.append('short_description', form.short_description);
    data.append('description', form.description);
    if (form.price) data.append('price', form.price);
    data.append('show_price', form.show_price ? '1' : '0');
    data.append('featured', form.featured ? '1' : '0');
    data.append('is_new', form.is_new ? '1' : '0');
    data.append('stock_status', form.stock_status);
    data.append('seo_title', form.seo_title || form.name);
    data.append('seo_description', form.seo_description);
    data.append('status', form.status);

    // Specifications JSON
    const validSpecs = form.specifications.filter(s => s.name.trim() && s.value.trim());
    data.append('specifications', JSON.stringify(validSpecs));

    if (mainImageFile) data.append('main_image', mainImageFile);
    if (brochureFile) data.append('brochure', brochureFile);

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/products/${deleteId}`);
      setDeleteId(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filteredProducts = products.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.model_number && p.model_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Products Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">Add, edit and manage CCTV cameras, PoE switches, and accessories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, model, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          Total: <strong>{filteredProducts.length}</strong>
        </span>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader text="Loading products..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No Products Found" message="Try a different search term or click Add New Product." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Product Info</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Model</th>
                  <th className="py-3.5 px-4">Highlights</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                        <img src={p.main_image || '/assets/products/placeholder.jpg'} alt="" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs leading-snug">{p.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{p.short_description || 'No description'}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{p.category_name || 'Uncategorized'}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-300 font-bold">{p.model_number}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.featured ? <Badge variant="primary">Featured</Badge> : null}
                        {p.is_new ? <Badge variant="orange">New</Badge> : null}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.status === 'active' ? 'success' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3MP Resolution HD Bullet Camera"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Model Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GS-B3MP-80M"
                    value={form.model_number}
                    onChange={(e) => setForm({ ...form, model_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.parent_name ? `(${c.parent_name})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Summary specifications for product cards..."
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed optical characteristics, wiring advice, and warranty..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Dynamic Specifications Rows */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Technical Specifications</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-500/30 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {form.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Name (e.g. Lens)"
                        value={spec.name}
                        onChange={(e) => updateSpecRow(idx, 'name', e.target.value)}
                        className="w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 3.6 MM)"
                        value={spec.value}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Main Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainImageFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">PDF Datasheet / Brochure</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setBrochureFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_new}
                    onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                  />
                  <span>New Release Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? All specifications and gallery images will be removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
