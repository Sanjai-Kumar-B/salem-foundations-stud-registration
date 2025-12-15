'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { getApplicationStatistics, getApplications } from '@/lib/firestore';
import { StudentApplication, ApplicationStatus } from '@/types';
import { Users, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface DashboardStats {
  totalApplications: number;
  newApplications: number;
  shortlisted: number;
  completed: number;
  courseWiseCount: Record<string, number>;
  districtWiseCount: Record<string, number>;
  communityWiseCount: Record<string, number>;
  scholarshipEligible: number;
  highScorers: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<StudentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      loadDashboardData();
      
      // Set up auto-refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        loadDashboardData();
      }, 30000); // 30 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (!stats) {
        setIsLoading(true);
      }
      
      // Load statistics
      const statistics = await getApplicationStatistics();
      setStats(statistics);

      // Load recent applications (last 10)
      const applications = await getApplications();
      setRecentApplications(applications.slice(0, 10));
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: 'primary',
      bgColor: 'bg-primary-100',
      textColor: 'text-primary-600',
    },
    {
      title: 'New Applications',
      value: stats?.newApplications || 0,
      icon: Clock,
      color: 'warning',
      bgColor: 'bg-warning-100',
      textColor: 'text-warning-600',
    },
    {
      title: 'Shortlisted',
      value: stats?.shortlisted || 0,
      icon: Users,
      color: 'info',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'success',
      bgColor: 'bg-success-100',
      textColor: 'text-success-600',
    },
  ];

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.displayName}!
            </h2>
            <p className="text-gray-600 mt-1">
              Here's an overview of student applications
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Auto-refreshing every 30s</p>
            <p className="text-xs text-gray-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">High Scorers</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">90%+ Students</span>
              <span className="text-2xl font-bold text-primary-600">{stats?.highScorers || 0}</span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Eligible</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Students</span>
              <span className="text-2xl font-bold text-success-600">{stats?.scholarshipEligible || 0}</span>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New Today</span>
              <span className="text-2xl font-bold text-warning-600">
                {recentApplications.filter(app => {
                  const today = new Date();
                  const submittedDate = app.submittedAt.toDate();
                  return submittedDate.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <Link href="/admin/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application No.
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  recentApplications.map((application) => (
                    <tr 
                      key={application.id} 
                      onClick={() => window.location.href = `/admin/applications/${application.id}`}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-primary-600">
                        {application.applicationNumber}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">
                        {application.personalDetails.firstName} {application.personalDetails.lastName}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {application.coursePreference.preferredCourse.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                        {application.personalDetails.address.district}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-900 font-medium">
                          {application.referralDetails?.source?.replace(/_/g, ' ') || '-'}
                        </div>
                        {application.referralDetails?.referrerName && (
                          <div className="text-xs text-gray-500">
                            {application.referralDetails.referrerName}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                            application.status === ApplicationStatus.NEW
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === ApplicationStatus.SHORTLISTED
                              ? 'bg-blue-100 text-blue-800'
                              : application.status === ApplicationStatus.COMPLETED
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Distribution */}
        {stats && stats.courseWiseCount && Object.keys(stats.courseWiseCount).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course-wise Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.courseWiseCount).map(([course, count]) => (
                  <div key={course} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{course}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div
                          className="h-2 bg-primary-600 rounded-full"
                          style={{
                            width: `${(count / stats.totalApplications) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community-wise Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.communityWiseCount).map(([community, count]) => (
                  <div key={community} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{community}</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div
                          className="h-2 bg-success-600 rounded-full"
                          style={{
                            width: `${(count / stats.totalApplications) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
