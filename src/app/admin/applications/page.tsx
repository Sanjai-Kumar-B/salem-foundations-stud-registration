'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { getApplications } from '@/lib/firestore';
import { StudentApplication, FilterOptions, ApplicationStatus, CourseType, Community, TwelfthGroup, ScholarshipType } from '@/types';
import { Search, Filter, Download, FileSpreadsheet, FileText } from 'lucide-react';
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
    scholarshipTypes: [],
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

    // Scholarship filter
    if (filters.scholarshipTypes && filters.scholarshipTypes.length > 0) {
      filtered = filtered.filter((app) =>
        Array.isArray(app.communityScholarship.scholarshipType)
          ? app.communityScholarship.scholarshipType.some((scholarship) =>
              filters.scholarshipTypes!.includes(scholarship)
            )
          : filters.scholarshipTypes!.includes(app.communityScholarship.scholarshipType as any)
      );
    }

    // Entrance exam filter (NEET/JEE)
    if (filters.minMarks !== undefined) {
      filtered = filtered.filter((app) => {
        const hasNEET = app.academicDetails.neetScore && app.academicDetails.neetScore >= filters.minMarks!;
        const hasJEE = app.academicDetails.jeeScore && app.academicDetails.jeeScore >= filters.minMarks!;
        return hasNEET || hasJEE || app.academicDetails.twelfthMarks >= filters.minMarks!;
      });
    }

    if (filters.maxMarks !== undefined) {
      filtered = filtered.filter((app) =>
        app.academicDetails.twelfthMarks <= filters.maxMarks!
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
      scholarshipTypes: [],
      minMarks: undefined,
      maxMarks: undefined,
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
              {/* Marks Range Filter */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Marks Range Filter</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum Marks</label>
                    <input
                      type="number"
                      placeholder="e.g., 400"
                      value={filters.minMarks || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, minMarks: e.target.value ? Number(e.target.value) : undefined }))}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Maximum Marks</label>
                    <input
                      type="number"
                      placeholder="e.g., 600"
                      value={filters.maxMarks || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxMarks: e.target.value ? Number(e.target.value) : undefined }))}
                      className="input text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Filter by 12th marks, NEET score, or JEE score</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {/* Status Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">\n                    {Object.values(ApplicationStatus).map((status) => (
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
                  <div className="space-y-2 max-h-60 overflow-y-auto">\n                    {Object.values(CourseType).map((course) => (
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
                  <div className="space-y-2 max-h-60 overflow-y-auto">\n                    {Object.values(TwelfthGroup).map((group) => (
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
                  <div className="space-y-2 max-h-60 overflow-y-auto">
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

                {/* Scholarship Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Scholarship Type</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Object.values(ScholarshipType).filter(s => s !== ScholarshipType.NONE).map((scholarship) => (
                      <label key={scholarship} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.scholarshipTypes?.includes(scholarship)}
                          onChange={() => toggleFilter('scholarshipTypes', scholarship)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {scholarship.replace(/_/g, ' ').replace('GOVERNMENT', 'Govt').replace('SCHOLARSHIP', '')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  {(filters.courses?.length || 0) + 
                   (filters.status?.length || 0) + 
                   (filters.communities?.length || 0) + 
                   (filters.twelfthGroups?.length || 0) + 
                   (filters.scholarshipTypes?.length || 0) + 
                   (filters.minMarks ? 1 : 0) + 
                   (filters.maxMarks ? 1 : 0)} filter(s) active
                </p>
                <button 
                  onClick={clearFilters} 
                  className="btn btn-secondary text-sm"
                >
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
                    12th %
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center">
                      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr 
                      key={application.id} 
                      onClick={() => window.location.href = `/admin/applications/${application.id}`}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs font-medium text-primary-600">
                          {application.applicationNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium text-gray-900">
                          {application.personalDetails.firstName} {application.personalDetails.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{application.personalDetails.email}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {application.coursePreference.preferredCourse.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                        {application.academicDetails.twelfthPercentage}%
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
      </div>
    </AdminLayout>
  );
}
