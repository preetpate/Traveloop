import { useState, useEffect } from 'react';
import { Users, MapPin, TrendingUp, Calendar, Loader } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/admin/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 shadow-soft border border-gray-100 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text-primary mb-2">No Analytics Data</h3>
          <p className="text-text-secondary">Unable to load analytics at this time</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const topCitiesData = (analytics.topCities || []).map(city => ({
    name: city.name,
    visits: city.count
  }));

  const categoryData = (analytics.topCategories || []).map(cat => ({
    name: cat.category,
    value: cat.count
  }));

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Platform Analytics</h1>
        <p className="text-text-secondary mt-1">Overview of platform usage and trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-semibold">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">{analytics.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Trips */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-semibold">Total Trips</p>
              <p className="text-3xl font-bold text-purple-900">{analytics.totalTrips || 0}</p>
            </div>
          </div>
        </div>

        {/* New Users (30d) */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-semibold">New Users (30d)</p>
              <p className="text-3xl font-bold text-green-900">{analytics.newUsers30d || 0}</p>
            </div>
          </div>
        </div>

        {/* New Trips (30d) */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-700 font-semibold">New Trips (30d)</p>
              <p className="text-3xl font-bold text-orange-900">{analytics.newTrips30d || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-text-primary mb-6">Top 5 Most Visited Cities</h2>
          {topCitiesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCitiesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="visits" 
                  fill="#3B82F6" 
                  radius={[8, 8, 0, 0]}
                  name="Visits"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-secondary">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No city data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Activity Categories Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-text-primary mb-6">Activity Category Distribution</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-secondary">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No category data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Cities List */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-text-primary mb-4">Top Cities Details</h2>
          {topCitiesData.length > 0 ? (
            <div className="space-y-3">
              {topCitiesData.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-text-primary">{city.name}</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {city.visits} visits
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">No data available</p>
          )}
        </div>

        {/* Top Categories List */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-text-primary mb-4">Top Activity Categories</h2>
          {categoryData.length > 0 ? (
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {index + 1}
                    </div>
                    <span className="font-semibold text-text-primary">{category.name}</span>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {category.value} activities
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
