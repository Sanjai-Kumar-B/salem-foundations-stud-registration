'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { getApplicationById, updateApplicationStatus } from '@/lib/firestore';
import { StudentApplication, ApplicationStatus } from '@/types';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Award,
  User,
  Save,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { exportSingleApplicationPDF } from '@/lib/export';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(ApplicationStatus.NEW);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && params.id) {
      loadApplication();
    }
  }, [user, params.id]);

  const loadApplication = async () => {
    try {
      setIsLoading(true);
      const data = await getApplicationById(params.id as string);
      if (data) {
        setApplication(data);
        setSelectedStatus(data.status);
        setNotes(data.notes || '');
      } else {
        toast.error('Application not found');
        router.push('/admin/applications');
      }
    } catch (error) {
      console.error('Error loading application:', error);
      toast.error('Failed to load application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!application) return;

    try {
      setIsSaving(true);
      await updateApplicationStatus(application.id, selectedStatus, notes);
      toast.success('Status updated successfully');
      await loadApplication();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (application) {
      exportSingleApplicationPDF(application);
      toast.success('PDF downloaded successfully');
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

  if (!application) {
    return (
      <AdminLayout user={user}>
        <div className="text-center py-20">
          <p className="text-gray-500">Application not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/applications" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
              <p className="text-gray-600 mt-1">Application No: {application.applicationNumber}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/apply/edit/${application.id}`}
              className="btn btn-secondary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Application
            </Link>
            <button onClick={handleDownloadPDF} className="btn btn-primary flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Status and Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Application Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  className="input"
                >
                  {Object.values(ApplicationStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Notes / Comments</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="input"
                  placeholder="Add notes or comments about this application..."
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={isSaving}
                className="btn btn-success flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {application.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Submitted:</strong> {formatDate(application.submittedAt.toDate())}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Last Updated:</strong> {formatDate(application.updatedAt.toDate())}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="card">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-900 mt-1">
                {application.personalDetails.firstName} {application.personalDetails.lastName}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.dateOfBirth}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.gender}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Aadhar Number</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.aadharNumber}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </label>
              <p className="text-gray-900 mt-1">
                <a href={`mailto:${application.personalDetails.email}`} className="text-primary-600 hover:underline">
                  {application.personalDetails.email}
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Mobile
              </label>
              <p className="text-gray-900 mt-1">
                <a href={`tel:${application.personalDetails.mobile}`} className="text-primary-600 hover:underline">
                  {application.personalDetails.mobile}
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                WhatsApp Number
              </label>
              <p className="text-gray-900 mt-1">
                <a href={`https://wa.me/91${application.personalDetails.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {application.personalDetails.whatsappNumber}
                </a>
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </label>
              <p className="text-gray-900 mt-1">
                {application.personalDetails.address.line1}
                {application.personalDetails.address.line2 && `, ${application.personalDetails.address.line2}`}
                <br />
                {application.personalDetails.address.city}, {application.personalDetails.address.district}
                <br />
                {application.personalDetails.address.state} - {application.personalDetails.address.pincode}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Father's Name</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.fatherName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Father's Occupation</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.fatherOccupation}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Father's Mobile
              </label>
              <p className="text-gray-900 mt-1">
                <a href={`tel:${application.personalDetails.fatherMobile}`} className="text-primary-600 hover:underline">
                  {application.personalDetails.fatherMobile}
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Mother's Name</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.motherName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Mother's Occupation</label>
              <p className="text-gray-900 mt-1">{application.personalDetails.motherOccupation}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Mother's Mobile
              </label>
              <p className="text-gray-900 mt-1">
                <a href={`tel:${application.personalDetails.motherMobile}`} className="text-primary-600 hover:underline">
                  {application.personalDetails.motherMobile}
                </a>
              </p>
            </div>

            {application.personalDetails.guardianName && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-600">Guardian's Name</label>
                  <p className="text-gray-900 mt-1">{application.personalDetails.guardianName}</p>
                </div>

                {application.personalDetails.guardianMobile && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Guardian's Mobile
                    </label>
                    <p className="text-gray-900 mt-1">
                      <a href={`tel:${application.personalDetails.guardianMobile}`} className="text-primary-600 hover:underline">
                        {application.personalDetails.guardianMobile}
                      </a>
                    </p>
                  </div>
                )}
              </>
            )}

            {application.personalDetails.siblings && application.personalDetails.siblings.length > 0 && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Siblings</label>
                <div className="mt-2 space-y-2">
                  {application.personalDetails.siblings.map((sibling, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                      <span className="text-gray-900 font-medium">{sibling.name}</span>
                      <span className="text-gray-600 text-sm">- {sibling.education}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Academic Details */}
        <div className="card">
          <div className="flex items-center mb-6">
            <GraduationCap className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>
          </div>

          <div className="space-y-6">
            {/* 10th Standard */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">10th Standard</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">School</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.tenthSchool}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Board</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.tenthBoard}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.tenthYearOfPassing}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Percentage</label>
                  <p className="text-gray-900 mt-1 font-semibold">{application.academicDetails.tenthPercentage}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Marks</label>
                  <p className="text-gray-900 mt-1">
                    {application.academicDetails.tenthMarks} / {application.academicDetails.tenthTotalMarks}
                  </p>
                </div>
              </div>
            </div>

            {/* 12th Standard */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">12th Standard</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">School</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.twelfthSchool}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Board</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.twelfthBoard}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Year</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.twelfthYearOfPassing}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">12th Group</label>
                  <p className="text-gray-900 mt-1">{application.academicDetails.twelfthGroup.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Percentage</label>
                  <p className="text-gray-900 mt-1 font-semibold text-lg">{application.academicDetails.twelfthPercentage}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Marks</label>
                  <p className="text-gray-900 mt-1">
                    {application.academicDetails.twelfthMarks} / {application.academicDetails.twelfthTotalMarks}
                  </p>
                </div>
              </div>
            </div>

            {/* Competitive Exams */}
            {(application.academicDetails.neetScore || application.academicDetails.jeeScore) && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Competitive Exams</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.academicDetails.neetScore && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">NEET Score</label>
                        <p className="text-gray-900 mt-1 font-semibold">{application.academicDetails.neetScore}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">NEET Rank</label>
                        <p className="text-gray-900 mt-1">{application.academicDetails.neetRank || '-'}</p>
                      </div>
                    </>
                  )}
                  {application.academicDetails.jeeScore && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">JEE Score</label>
                        <p className="text-gray-900 mt-1 font-semibold">{application.academicDetails.jeeScore}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">JEE Rank</label>
                        <p className="text-gray-900 mt-1">{application.academicDetails.jeeRank || '-'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Entrance Exam Preparation */}
            {application.academicDetails.preparingForExam && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Entrance Exam Preparation</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preparing For</label>
                    <p className="text-gray-900 mt-1 font-medium">{application.academicDetails.preparingForExam.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Government School Questions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">School Background</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Studied in Government School (6th-12th)</label>
                  <p className="text-gray-900 mt-1 font-medium">
                    {application.academicDetails.studiedInGovtSchool ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-600">No</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Studied in Govt/Aided Tamil Medium (6th-12th)</label>
                  <p className="text-gray-900 mt-1 font-medium">
                    {application.academicDetails.studiedInGovtAidedTamilMedium ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-600">No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Preference */}
        <div className="card">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Course Preference</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Preferred Course</label>
              <p className="text-gray-900 mt-1 font-semibold">{application.coursePreference.preferredCourse}</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Course Specialization</label>
              <p className="text-gray-900 mt-1">{application.coursePreference.courseSpecialization || '-'}</p>
            </div>

            {application.coursePreference.preferredDistricts && application.coursePreference.preferredDistricts.length > 0 && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Preferred Districts (Location)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.coursePreference.preferredDistricts.map((district, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {district}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Preferred Colleges</label>
              <ul className="list-disc list-inside text-gray-900 mt-1 space-y-1">
                {application.coursePreference.preferredColleges.map((college, index) => (
                  <li key={index}>{college}</li>
                ))}
              </ul>
            </div>

            {application.coursePreference.additionalFreeCourses && application.coursePreference.additionalFreeCourses.length > 0 && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Additional Free Courses</label>
                <ul className="list-disc list-inside text-gray-900 mt-1 space-y-1">
                  {application.coursePreference.additionalFreeCourses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Community & Scholarship */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Community & Scholarship</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Community</label>
              <p className="text-gray-900 mt-1">{application.communityScholarship.community}</p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Scholarship Type</label>
              {Array.isArray(application.communityScholarship.scholarshipType) ? (
                <ul className="list-disc list-inside text-gray-900 mt-1 space-y-1">
                  {application.communityScholarship.scholarshipType.map((scholarship, index) => (
                    <li key={index}>{scholarship}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-900 mt-1">{application.communityScholarship.scholarshipType}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Annual Family Income</label>
              <p className="text-gray-900 mt-1">
                ₹{application.communityScholarship.annualFamilyIncome.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">First Graduate</label>
              <p className="text-gray-900 mt-1">
                {application.communityScholarship.firstGraduate ? 'Yes' : 'No'}
              </p>
            </div>

            {application.communityScholarship.needsEducationalLoan !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-600">Educational Loan Required</label>
                <p className="text-gray-900 mt-1">
                  {application.communityScholarship.needsEducationalLoan ? 'Yes' : 'No'}
                </p>
              </div>
            )}

            {application.communityScholarship.scholarshipDetails && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Scholarship Details</label>
                <p className="text-gray-900 mt-1">{application.communityScholarship.scholarshipDetails}</p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Details */}
        <div className="card">
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Referral Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">How did you know about us?</label>
              <p className="text-gray-900 mt-1 font-medium">
                {application.referralDetails?.source?.replace(/_/g, ' ') || '-'}
              </p>
            </div>

            {application.referralDetails?.referrerName && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-600">Referrer Name</label>
                  <p className="text-gray-900 mt-1">{application.referralDetails.referrerName}</p>
                </div>

                {application.referralDetails.referrerMobile && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Referrer Mobile
                    </label>
                    <p className="text-gray-900 mt-1">
                      <a href={`tel:${application.referralDetails.referrerMobile}`} className="text-primary-600 hover:underline">
                        {application.referralDetails.referrerMobile}
                      </a>
                    </p>
                  </div>
                )}

                {application.referralDetails.referrerDetails && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Referrer Details</label>
                    <p className="text-gray-900 mt-1">{application.referralDetails.referrerDetails}</p>
                  </div>
                )}
              </>
            )}

            {application.referralDetails?.followedSocialMedia && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Followed Social Media</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {application.referralDetails.followedSocialMedia.instagram && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                      Instagram
                    </span>
                  )}
                  {application.referralDetails.followedSocialMedia.facebook && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Facebook
                    </span>
                  )}
                  {application.referralDetails.followedSocialMedia.youtube && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      YouTube
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        {application.documents && Object.keys(application.documents).length > 0 && (
          <div className="card">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(application.documents).map(([key, doc]) => {
                if (!doc) return null;
                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{doc.name}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      View/Download
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
