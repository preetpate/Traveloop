import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Wallet, PieChart, Calendar } from 'lucide-react';
import api from '../services/api';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
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
      setFormData({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to add budget:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/api/budget/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const avgExpense = budgets.length > 0 ? totalBudget / budgets.length : 0;

  const categories = [...new Set(budgets.map(b => b.category))];
  const categoryTotals = categories.map(cat => ({
    name: cat,
    total: budgets.filter(b => b.category === cat).reduce((sum, b) => sum + b.amount, 0)
  }));

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-10 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="w-8 h-8" />
              <span className="text-white/90 font-semibold">Budget Tracker</span>
            </div>
            <h1 className="text-5xl font-bold mb-3">Manage Your Expenses</h1>
            <p className="text-xl text-white/90">Track every penny of your travel budget</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold hover:scale-105 transition-transform shadow-2xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-semibold">Total Spent</p>
              <p className="text-3xl font-bold text-blue-900">${totalBudget.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-semibold">Total Items</p>
              <p className="text-3xl font-bold text-purple-900">{budgets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-700 font-semibold">Average</p>
              <p className="text-3xl font-bold text-orange-900">${avgExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
              <PieChart className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-semibold">Categories</p>
              <p className="text-3xl font-bold text-green-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Food, Transport, Hotel"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-4 bg-gray-100 text-text-primary rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Recent Expenses</h2>
        {budgets.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No expenses yet</h3>
            <p className="text-text-secondary mb-6">Start tracking your travel expenses</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition"
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => (
              <div
                key={budget._id}
                className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-gray-100 hover:to-gray-200 transition border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {budget.category}
                    </span>
                    {budget.date && (
                      <span className="text-sm text-gray-500">
                        {new Date(budget.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-text-primary text-lg">{budget.description || budget.category}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-green-600">${budget.amount?.toFixed(2)}</span>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
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
