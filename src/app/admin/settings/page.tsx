'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database },
  ];

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and application settings</p>
          </div>
          <Settings className="w-8 h-8 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input bg-gray-50"
                  />
                </div>

                <div>
                  <label className="label">Display Name</label>
                  <input
                    type="text"
                    value={user.displayName}
                    disabled
                    className="input bg-gray-50"
                  />
                </div>

                <div>
                  <label className="label">Role</label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="input bg-gray-50"
                  />
                </div>

                <div>
                  <label className="label">Account Status</label>
                  <input
                    type="text"
                    value={user.isActive ? 'Active' : 'Inactive'}
                    disabled
                    className="input bg-gray-50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  To update your profile information, please contact the system administrator.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">New Applications</p>
                    <p className="text-sm text-gray-600">Get notified when a new application is submitted</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Status Updates</p>
                    <p className="text-sm text-gray-600">Get notified when application status changes</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Weekly Reports</p>
                    <p className="text-sm text-gray-600">Receive weekly summary reports via email</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
              </div>

              <button
                onClick={() => toast.success('Settings saved successfully')}
                className="btn btn-primary"
              >
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Password changes must be done through Firebase Authentication console.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="py-3">
                    <p className="font-medium text-gray-900 mb-2">Change Password</p>
                    <p className="text-sm text-gray-600 mb-3">
                      To change your password, use the Firebase Console or contact the administrator.
                    </p>
                    <a
                      href="https://console.firebase.google.com/project/salemfoundations-studentreg/authentication/users"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary inline-block"
                    >
                      Open Firebase Console
                    </a>
                  </div>

                  <div className="py-3 border-t">
                    <p className="font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">
                      Contact system administrator to enable 2FA for your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Application Name</label>
                  <input
                    type="text"
                    value="Salem Foundations Student Portal"
                    disabled
                    className="input bg-gray-50"
                  />
                </div>

                <div>
                  <label className="label">Version</label>
                  <input
                    type="text"
                    value="1.0.0"
                    disabled
                    className="input bg-gray-50"
                  />
                </div>

                <div>
                  <label className="label">Environment</label>
                  <input
                    type="text"
                    value="Development"
                    disabled
                    className="input bg-gray-50"
                  />
                </div>

                <div>
                  <label className="label">Database</label>
                  <input
                    type="text"
                    value="Cloud Firestore"
                    disabled
                    className="input bg-gray-50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">About</h4>
                <p className="text-sm text-gray-600">
                  This is the student application management system for Salem Foundations.
                  For technical support or feature requests, please contact the development team.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
