import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Package } from 'lucide-react';
import api from '../services/api';

export default function PackingChecklistPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

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
      await api.post('/api/packing', { item: newItem, packed: false });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Packing Checklist</h1>
        <p className="text-text-secondary mt-1">Keep track of what to pack for your trip</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-text-secondary">Packing Progress</span>
          <span className="text-sm font-bold text-primary">{packedCount} / {items.length} items</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item to pack (e.g., Passport, Sunscreen, Camera)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition shadow-medium"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <h2 className="text-xl font-bold text-text-primary mb-4">Items to Pack</h2>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary">No items yet. Start adding things to pack!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                  item.packed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => handleToggle(item._id, item.packed)}
                  className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
                    item.packed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {item.packed && <Check className="w-4 h-4 text-white" />}
                </button>
                <span
                  className={`flex-1 font-medium ${
                    item.packed ? 'text-green-700 line-through' : 'text-text-primary'
                  }`}
                >
                  {item.item}
                </span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
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
