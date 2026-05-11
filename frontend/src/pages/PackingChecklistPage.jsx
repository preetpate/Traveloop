import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Package, Luggage, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function PackingChecklistPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/packing');
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch packing items:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      await api.post('/api/packing', { item: newItem, packed: false, category });
      setNewItem('');
      fetchItems();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const handleToggle = async (id, packed) => {
    try {
      await api.put(`/api/packing/${id}`, { packed: !packed });
      fetchItems();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/packing/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const packedCount = items.filter(i => i.packed).length;
  const progress = items.length > 0 ? (packedCount / items.length) * 100 : 0;

  const categories = ['General', 'Clothes', 'Electronics', 'Toiletries', 'Documents'];

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 p-10 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Luggage className="w-8 h-8" />
            <span className="text-white/90 font-semibold">Packing Checklist</span>
          </div>
          <h1 className="text-5xl font-bold mb-3">Pack Smart, Travel Light</h1>
          <p className="text-xl text-white/90">Never forget anything important again</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Packing Progress</h2>
            <p className="text-text-secondary">Keep track of what you've packed</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-purple-600">{Math.round(progress)}%</p>
            <p className="text-sm text-text-secondary font-semibold">{packedCount} of {items.length} items</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && (
              <CheckCircle2 className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Add Item</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="What do you need to pack?"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add to Packing List
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Your Packing List</h2>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No items yet</h3>
            <p className="text-text-secondary">Start adding things you need to pack</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                  item.packed
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                }`}
              >
                <button
                  onClick={() => handleToggle(item._id, item.packed)}
                  className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                    item.packed
                      ? 'bg-green-500 border-green-500 scale-110'
                      : 'border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {item.packed && <Check className="w-5 h-5 text-white" />}
                </button>
                <div className="flex-1">
                  <span
                    className={`font-semibold text-lg ${
                      item.packed ? 'text-green-700 line-through' : 'text-text-primary'
                    }`}
                  >
                    {item.item}
                  </span>
                  {item.category && (
                    <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
