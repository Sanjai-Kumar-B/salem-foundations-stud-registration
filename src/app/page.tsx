import Link from 'next/link';
import { GraduationCap, UserCircle, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Salem Foundations</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Salem Foundations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Digital Admission Automation & Student Management System
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Application Card */}
          <Link href="/apply">
            <div className="card hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 border-transparent hover:border-primary-500">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Student Application
                </h3>
                <p className="text-gray-600 mb-4">
                  Submit your application for admission. Fill out the form online and upload required documents.
                </p>
                <div className="btn btn-primary mt-2">
                  Apply Now
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Login Card */}
          <Link href="/admin/login">
            <div className="card hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 border-transparent hover:border-primary-500">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <UserCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Admin Portal
                </h3>
                <p className="text-gray-600 mb-4">
                  Access the admin dashboard to manage student applications, view statistics, and more.
                </p>
                <div className="btn btn-secondary mt-2">
                  Admin Login
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Online Application</h4>
              <p className="text-gray-600 text-sm">
                Submit applications digitally with automatic validation and instant confirmation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Document Management</h4>
              <p className="text-gray-600 text-sm">
                Securely upload and store all required documents in organized folders
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">Advanced Analytics</h4>
              <p className="text-gray-600 text-sm">
                Real-time dashboards with filtering, sorting, and comprehensive reports
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Salem Foundations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
