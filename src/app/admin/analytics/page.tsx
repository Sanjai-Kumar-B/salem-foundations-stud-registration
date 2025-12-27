'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { getApplicationStatistics } from '@/lib/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, GraduationCap } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await getApplicationStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout user={user}>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  // Prepare data for charts
  const courseData = Object.entries(stats?.courseWiseCount || {}).map(([name, value]) => ({
    name,
    students: value as number,
  }));

  const districtData = Object.entries(stats?.districtWiseCount || {})
    .map(([name, value]) => ({ name, students: value as number }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 10);

  const communityData = Object.entries(stats?.communityWiseCount || {}).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  const statusData = [
    { name: 'New', value: stats?.newApplications || 0, color: '#f59e0b' },
    { name: 'Selected', value: stats?.selected || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats?.completed || 0, color: '#10b981' },
  ];

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and statistics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalApplications || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Scorers (90%+)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.highScorers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scholarship Eligible</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.scholarshipEligible || 0}</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.completed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Course-wise Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#3b82f6" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* District Distribution & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* District Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 10 Districts</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={districtData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="students" fill="#10b981" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Application Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Status</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Community Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Community-wise Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={communityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {communityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Statistics Table */}
            <div className="space-y-3">
              {communityData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                    <p className="text-sm text-gray-500">
                      {((item.value / stats?.totalApplications) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Average Performance</h4>
            <p className="text-2xl font-bold text-blue-600">
              {stats?.totalApplications > 0 
                ? `${((stats.highScorers / stats.totalApplications) * 100).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-xs text-blue-700 mt-1">Students with 90%+</p>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <h4 className="text-sm font-medium text-green-900 mb-2">Scholarship Coverage</h4>
            <p className="text-2xl font-bold text-green-600">
              {stats?.totalApplications > 0
                ? `${((stats.scholarshipEligible / stats.totalApplications) * 100).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-xs text-green-700 mt-1">Eligible students</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <h4 className="text-sm font-medium text-purple-900 mb-2">Completion Rate</h4>
            <p className="text-2xl font-bold text-purple-600">
              {stats?.totalApplications > 0
                ? `${((stats.completed / stats.totalApplications) * 100).toFixed(1)}%`
                : '0%'}
            </p>
            <p className="text-xs text-purple-700 mt-1">Applications processed</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
