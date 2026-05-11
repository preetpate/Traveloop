import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Wallet, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTrip } from '../hooks/useTrip';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

export default function BudgetPage() {
  const { activeTrip } = useTrip();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    totalBudget: '',
    categories: [{ name: '', allocatedAmount: '', spentAmount: '' }],
  });

  // Redirect if no active trip
  useEffect(() => {
    if (!activeTrip) {
      navigate('/my-trips');
    } else {
      fetchBudget();
    }
  }, [activeTrip, navigate]);

  const fetchBudget = async () => {
    if (!activeTrip) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/api/trips/${activeTrip._id}/budget`);
      setBudget(res.data.data);
      if (res.data.data) {
        setFormData({
          totalBudget: res.data.data.totalBudget,
          categories: res.data.data.categories.map((c) => ({
            name: c.name,
            allocatedAmount: c.allocatedAmount,
            spentAmount: c.spentAmount,
          })),
        });
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to fetch budget:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeTrip) return;

    try {
      const payload = {
        totalBudget: parseFloat(formData.totalBudget),
        categories: formData.categories.map((c) => ({
          name: c.name,
          allocatedAmount: parseFloat(c.allocatedAmount) || 0,
          spentAmount: parseFloat(c.spentAmount) || 0,
        })),
      };

      if (budget) {
        await api.put(`/api/trips/${activeTrip._id}/budget`, payload);
      } else {
        await api.post(`/api/trips/${activeTrip._id}/budget`, payload);
      }

      setShowForm(false);
      fetchBudget();
    } catch (err) {
      console.error('Failed to save budget:', err);
      alert(err.response?.data?.message || 'Failed to save budget');
    }
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: '', allocatedAmount: '', spentAmount: '' }],
    });
  };

  const removeCategory = (index) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((_, i) => i !== index),
    });
  };

  const updateCategory = (index, field, value) => {
    const updated = [...formData.categories];
    updated[index][field] = value;
    setFormData({ ...formData, categories: updated });
  };

  if (!activeTrip) {
    return null;
  }

  const totalSpent = budget?.totalSpent || 0;
  const totalBudgetAmount = budget?.totalBudget || 0;
  const remainingBudget = budget?.remainingBudget || 0;
  const spentPercentage = totalBudgetAmount > 0 ? (totalSpent / totalBudgetAmount) * 100 : 0;
  const isOverBudget = spentPercentage > 90;

  // Prepare chart data
  const chartData = budget?.categories.map((cat) => ({
    name: cat.name,
    allocated: cat.allocatedAmount,
    spent: cat.spentAmount,
  })) || [];

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
            <h1 className="text-5xl font-bold mb-3">{activeTrip.title}</h1>
            <p className="text-xl text-white/90">Track your travel expenses</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold hover:scale-105 transition-transform shadow-2xl flex items-center gap-2"
          >
            {budget ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {budget ? 'Edit Budget' : 'Create Budget'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </Card>
      ) : budget ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-semibold">Total Budget</p>
                    <p className="text-3xl font-bold text-blue-900">${totalBudgetAmount.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-700 font-semibold">Total Spent</p>
                    <p className="text-3xl font-bold text-orange-900">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                className={`p-6 bg-gradient-to-br ${
                  isOverBudget
                    ? 'from-red-50 to-red-100 border-red-200'
                    : 'from-green-50 to-green-100 border-green-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  >
                    {isOverBudget ? (
                      <AlertCircle className="w-7 h-7 text-white" />
                    ) : (
                      <CheckCircle className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isOverBudget ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      Remaining
                    </p>
                    <p
                      className={`text-3xl font-bold ${
                        isOverBudget ? 'text-red-900' : 'text-green-900'
                      }`}
                    >
                      ${remainingBudget.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Category Breakdown Table */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Category Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">
                      Category
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                      Allocated
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                      Spent
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {budget.categories.map((category, index) => {
                    const remaining = category.allocatedAmount - category.spentAmount;
                    const percentage =
                      category.allocatedAmount > 0
                        ? (category.spentAmount / category.allocatedAmount) * 100
                        : 0;
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-semibold text-text-primary">
                          {category.name}
                        </td>
                        <td className="py-4 px-4 text-right text-text-secondary">
                          ${category.allocatedAmount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-semibold ${
                              percentage > 90 ? 'text-red-600' : 'text-text-primary'
                            }`}
                          >
                            ${category.spentAmount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-semibold ${
                              remaining < 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            ${remaining.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Spending Chart */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Spending Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" radius={[8, 8, 0, 0]} />
                <Bar dataKey="spent" fill="#F59E0B" name="Spent" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center">
          <Wallet className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">No budget created yet</h3>
          <p className="text-text-secondary mb-6">Create a budget to track your trip expenses</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Budget
          </Button>
        </Card>
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {budget ? 'Edit Budget' : 'Create Budget'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Total Budget ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-text-primary">
                    Categories
                  </label>
                  <button
                    type="button"
                    onClick={addCategory}
                    className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.categories.map((category, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(index, 'name', e.target.value)}
                        placeholder="Category name"
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={category.allocatedAmount}
                        onChange={(e) => updateCategory(index, 'allocatedAmount', e.target.value)}
                        placeholder="Allocated"
                        className="w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={category.spentAmount}
                        onChange={(e) => updateCategory(index, 'spentAmount', e.target.value)}
                        placeholder="Spent"
                        className="w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      {formData.categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {budget ? 'Update Budget' : 'Create Budget'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
