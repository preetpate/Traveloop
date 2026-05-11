import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Check, Package, Luggage, CheckCircle2 } from 'lucide-react';
import { useTrip } from '../hooks/useTrip';
import api from '../services/api';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { motion } from 'framer-motion';

export default function PackingChecklistPage() {
  const { activeTrip } = useTrip();
  const navigate = useNavigate();
  const [packingList, setPackingList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('General');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = ['General', 'Clothes', 'Electronics', 'Toiletries', 'Documents', 'Accessories'];

  // Redirect if no active trip
  useEffect(() => {
    if (!activeTrip) {
      navigate('/my-trips');
    } else {
      fetchPackingList();
    }
  }, [activeTrip, navigate]);

  const fetchPackingList = async () => {
    if (!activeTrip) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/api/trips/${activeTrip._id}/packing`);
      setPackingList(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        // Create empty packing list
        try {
          const createRes = await api.post(`/api/trips/${activeTrip._id}/packing`, { items: [] });
          setPackingList(createRes.data.data);
        } catch (createErr) {
          console.error('Failed to create packing list:', createErr);
        }
      } else {
        console.error('Failed to fetch packing list:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim() || !activeTrip) return;
    try {
      await api.post(`/api/trips/${activeTrip._id}/packing/items`, {
        name: newItem,
        category,
        packed: false,
      });
      setNewItem('');
      fetchPackingList();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const handleToggle = async (itemId, currentPacked) => {
    if (!activeTrip) return;
    try {
      await api.patch(`/api/trips/${activeTrip._id}/packing/items/${itemId}`, {
        packed: !currentPacked,
      });
      fetchPackingList();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!activeTrip) return;
    try {
      await api.delete(`/api/trips/${activeTrip._id}/packing/items/${itemId}`);
      setDeleteConfirm(null);
      fetchPackingList();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Group items by category
  const itemsByCategory = useMemo(() => {
    if (!packingList?.items) return {};
    const grouped = {};
    packingList.items.forEach((item) => {
      const cat = item.category || 'General';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(item);
    });
    return grouped;
  }, [packingList]);

  const packedCount = packingList?.items.filter((i) => i.packed).length || 0;
  const totalCount = packingList?.items.length || 0;
  const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  if (!activeTrip) {
    return null;
  }

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
          <h1 className="text-5xl font-bold mb-3">{activeTrip.title}</h1>
          <p className="text-xl text-white/90">Never forget anything important again</p>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </Card>
      ) : (
        <>
          {/* Progress Card */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Packing Progress</h2>
                <p className="text-text-secondary">Keep track of what you've packed</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-purple-600">{Math.round(progress)}%</p>
                <p className="text-sm text-text-secondary font-semibold">
                  {packedCount} of {totalCount} items
                </p>
              </div>
            </div>
            <ProgressBar
              value={progress}
              color={progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'}
              showLabel={false}
              className="h-4"
            />
            {progress === 100 && totalCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <p className="text-green-700 font-semibold">All packed! You're ready to go! 🎉</p>
              </motion.div>
            )}
          </Card>

          {/* Add Item Form */}
          <Card className="p-8">
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
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
          </Card>

          {/* Items List Grouped by Category */}
          {totalCount === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">No items yet</h3>
              <p className="text-text-secondary">Start adding things you need to pack</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(itemsByCategory).map(([cat, items]) => (
                <Card key={cat} className="p-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
                      {items.length}
                    </span>
                    {cat}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
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
                            {item.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Item"
        message="Are you sure you want to remove this item from your packing list?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

