'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { getApplications } from '@/lib/firestore';
import { StudentApplication, FilterOptions, ApplicationStatus, CourseType, Community, TwelfthGroup } from '@/types';
import { Search, Filter, Download, Eye, FileSpreadsheet, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { exportToExcel, exportToCSV, exportToPDF } from '@/lib/export';

export default function ApplicationsPage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<StudentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    courses: [],
    status: [],
    communities: [],
    twelfthGroups: [],
    districts: [],
  });

  useEffect(() => {
    if (user) {
      loadApplications();
      
      // Set up auto-refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        loadApplications();
      }, 30000); // 30 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [applications, searchQuery, filters]);

  const loadApplications = async () => {
    try {
      if (applications.length === 0) {
        setIsLoading(true);
      }
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      if (applications.length === 0) {
        toast.error('Failed to load applications');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.applicationNumber.toLowerCase().includes(query) ||
          app.personalDetails.firstName.toLowerCase().includes(query) ||
          app.personalDetails.lastName.toLowerCase().includes(query) ||
          app.personalDetails.email.toLowerCase().includes(query) ||
          app.personalDetails.mobile.includes(query)
      );
    }

    // Course filter
    if (filters.courses && filters.courses.length > 0) {
      filtered = filtered.filter((app) =>
        filters.courses!.includes(app.coursePreference.preferredCourse)
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((app) => filters.status!.includes(app.status));
    }

    // Community filter
    if (filters.communities && filters.communities.length > 0) {
      filtered = filtered.filter((app) =>
        filters.communities!.includes(app.communityScholarship.community)
      );
    }

    // +2 Group filter
    if (filters.twelfthGroups && filters.twelfthGroups.length > 0) {
      filtered = filtered.filter((app) =>
        filters.twelfthGroups!.includes(app.academicDetails.twelfthGroup)
      );
    }

    setFilteredApplications(filtered);
  };

  const toggleFilter = (
    category: keyof FilterOptions,
    value: any
  ) => {
    setFilters((prev) => {
      const current = (prev[category] as any[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      courses: [],
      status: [],
      communities: [],
      twelfthGroups: [],
      districts: [],
    });
    setSearchQuery('');
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const filename = `applications_${new Date().toISOString().split('T')[0]}`;
    
    try {
      switch (format) {
        case 'excel':
          exportToExcel(filteredApplications, filename);
          toast.success('Exported to Excel successfully');
          break;
        case 'csv':
          exportToCSV(filteredApplications, filename);
          toast.success('Exported to CSV successfully');
          break;
        case 'pdf':
          exportToPDF(filteredApplications, filename);
          toast.success('Exported to PDF successfully');
          break;
      }
      setShowExportMenu(false);
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Export error:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Applications</h2>
            <p className="text-gray-600 mt-1">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
          
          <div className="relative mt-4 sm:mt-0">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="btn btn-primary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                    Export to Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    Export to CSV
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2 text-red-600" />
                    Export to PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, mobile, or application number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="space-y-2">
                    {Object.values(ApplicationStatus).map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes(status)}
                          onChange={() => toggleFilter('status', status)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Course Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Course</h4>
                  <div className="space-y-2">
                    {Object.values(CourseType).map((course) => (
                      <label key={course} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.courses?.includes(course)}
                          onChange={() => toggleFilter('courses', course)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{course}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 12th Group Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">12th Group</h4>
                  <div className="space-y-2">
                    {Object.values(TwelfthGroup).map((group) => (
                      <label key={group} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.twelfthGroups?.includes(group)}
                          onChange={() => toggleFilter('twelfthGroups', group)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{group.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Community Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Community</h4>
                  <div className="space-y-2">
                    {Object.values(Community).map((community) => (
                      <label key={community} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.communities?.includes(community)}
                          onChange={() => toggleFilter('communities', community)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{community}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <div className="card p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    12th %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                        {application.applicationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.personalDetails.firstName} {application.personalDetails.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{application.personalDetails.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {application.coursePreference.preferredCourse}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {application.academicDetails.twelfthPercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {application.personalDetails.address.district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(application.submittedAt.toDate())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/applications/${application.id}`}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
