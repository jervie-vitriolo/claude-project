import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { getCategories } from '../api/categories';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '../types';

const emptyForm = { name: '', description: '', price: 0, categoryId: 0, imageUrl: '', isAvailable: true };

export default function MenuManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const qc = useQueryClient();

  const { data: products = [] } = useQuery({ queryKey: ['products', null], queryFn: () => getProducts() });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const saveMutation = useMutation({
    mutationFn: () =>
      editing
        ? updateProduct(editing.id, { ...form, isAvailable: form.isAvailable })
        : createProduct({ ...form, isAvailable: true }),
    onSuccess: () => {
      toast.success(editing ? 'Product updated' : 'Product created');
      qc.invalidateQueries({ queryKey: ['products'] });
      setShowModal(false);
      setEditing(null);
      setForm(emptyForm);
    },
    onError: () => toast.error('Failed to save product'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { toast.success('Product removed'); qc.invalidateQueries({ queryKey: ['products'] }); },
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, categoryId: p.categoryId, imageUrl: p.imageUrl ?? '', isAvailable: p.isAvailable });
    setShowModal(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Name', 'Category', 'Price', 'Available', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                <td className="px-4 py-3">₱{p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.isAvailable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Pencil size={14} /></button>
                    <button onClick={() => deleteMutation.mutate(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[480px] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {[{ label: 'Name', key: 'name', type: 'text' }, { label: 'Description', key: 'description', type: 'text' }, { label: 'Image URL', key: 'imageUrl', type: 'text' }].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                <input type="number" min={0} step={0.01} value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value={0}>Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {editing && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} />
                  Available
                </label>
              )}
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name || !form.categoryId}
                className="bg-amber-800 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">
                {saveMutation.isPending ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
