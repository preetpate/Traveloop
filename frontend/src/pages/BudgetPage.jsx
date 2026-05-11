import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import api from '../services/api';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/api/budget');
      setBudgets(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/budget', formData);
      setFormData({ category: '', amount: '', description: '' });
      setShowForm(false);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to add budget:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/budget/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Budget Tracker</h1>
          <p className="text-text-secondary mt-1">Manage your travel expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition shadow-medium"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-semibold">Total Budget</p>
              <p className="text-2xl font-bold text-text-primary">${totalBudget.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-semibold">Total Items</p>
              <p className="text-2xl font-bold text-text-primary">{budgets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary font-semibold">Average</p>
              <p className="text-2xl font-bold text-text-primary">
                ${budgets.length > 0 ? (totalBudget / budgets.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-text-primary mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Food, Transport, Hotel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this expense..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-200 text-text-primary rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget List */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <h2 className="text-xl font-bold text-text-primary mb-4">Expenses</h2>
        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary">No expenses yet. Add your first expense!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <div
                key={budget._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{budget.category}</h3>
                  {budget.description && (
                    <p className="text-sm text-text-secondary mt-1">{budget.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-primary">${budget.amount?.toFixed(2)}</span>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
