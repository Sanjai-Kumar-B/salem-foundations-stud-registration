'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  X,
} from 'lucide-react';
import {
  Gender,
  TwelfthGroup,
  CourseType,
  Community,
  ScholarshipType,
  ReferralSource,
  ApplicationStatus,
  PersonalDetails,
  AcademicDetails,
  CoursePreference,
  CommunityScholarshipDetails,
  ReferralDetails,
  Documents,
  SPECIALIZED_COURSES,
  FREE_COURSES,
  EntranceExam,
  StudentApplication,
} from '@/types';
import {
  personalDetailsSchema,
  academicDetailsSchema,
  coursePreferenceSchema,
  communityScholarshipSchema,
  referralDetailsSchema,
} from '@/lib/validations';
import { FormInput, FormSelect, FormCheckbox, NestedFormInput, NestedFormSelect, FormStep } from '@/components/FormComponents';
import { ApplicationFormSteps } from '@/components/ApplicationForm';
import { getApplicationById, updateApplication } from '@/lib/firestore';
import { TN_DISTRICTS, ENGINEERING_COLLEGES_BY_DISTRICT } from '@/data/collegesByDistrict';

const TOTAL_STEPS = 5;

const DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Viluppuram', 'Virudhunagar', 'Other'
];

const STATES = [
  'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Puducherry', 'Other'
];

const BOARDS = [
  'CBSE', 'Matric', 'State Board', 'ICSE'
];

const TWELFTH_GROUPS = [
  { value: TwelfthGroup.MATHS_BIOLOGY, label: 'Maths, Biology' },
  { value: TwelfthGroup.MATHS_COMPUTER_SCIENCE, label: 'Maths, Computer Science' },
  { value: TwelfthGroup.COMPUTER_SCIENCE_BIOLOGY, label: 'Computer Science, Biology' },
  { value: TwelfthGroup.COMMERCE_ACCOUNTANCY, label: 'Commerce with Accountancy' },
  { value: TwelfthGroup.COMMERCE_COMPUTER_APPLICATIONS, label: 'Commerce with Computer Applications' },
  { value: TwelfthGroup.COMMERCE_MATHS, label: 'Commerce with Maths' },
  { value: TwelfthGroup.ARTS_HISTORY, label: 'Arts with History' },
  { value: TwelfthGroup.ARTS_ECONOMICS, label: 'Arts with Economics' },
  { value: TwelfthGroup.VOCATIONAL, label: 'Vocational' },
  { value: TwelfthGroup.PURE_SCIENCE, label: 'Pure Science' },
  { value: TwelfthGroup.AGRICULTURE, label: 'Agriculture' },
  { value: TwelfthGroup.HOME_SCIENCE, label: 'Home Science' },
  { value: TwelfthGroup.NURSING, label: 'Nursing' },
];

const COURSE_TYPES = [
  { value: CourseType.ENGINEERING_TECHNOLOGY, label: 'Engineering & Technology' },
  { value: CourseType.MBBS, label: 'MBBS' },
  { value: CourseType.MEDICAL_HEALTH, label: 'Medical & Health Sciences' },
  { value: CourseType.ARTS_SCIENCE, label: 'Arts & Science' },
  { value: CourseType.LAW_CIVIL, label: 'Law & Civil Services' },
  { value: CourseType.AGRICULTURE, label: 'Agriculture' },
  { value: CourseType.ARCHITECTURE, label: 'Architecture' },
  { value: CourseType.MARINE, label: 'Marine' },
  { value: CourseType.AVIATION, label: 'Aviation' },
  { value: CourseType.HOTEL_MANAGEMENT, label: 'Hotel Management' },
  { value: CourseType.VETERINARY, label: 'Veterinary' },
  { value: CourseType.FISHERIES, label: 'Fisheries' },
  { value: CourseType.OTHERS, label: 'Others' },
];

const SCHOLARSHIP_TYPES = [
  { value: ScholarshipType.SEVEN_FIVE_PERCENT_GOVERNMENT, label: '75% Government Scholarship' },
  { value: ScholarshipType.POST_MATRIC_GOVERNMENT, label: 'Post Matric Government Scholarship' },
  { value: ScholarshipType.TNMM_GOVERNMENT, label: 'TNMM Government Scholarship' },
  { value: ScholarshipType.CENTRAL_SECTOR_GOVERNMENT, label: 'Central Sector Government Scholarship' },
  { value: ScholarshipType.NSP_GOVERNMENT, label: 'NSP Government Scholarship' },
  { value: ScholarshipType.STATE_SCHOLARSHIP, label: 'State Scholarship' },
  { value: ScholarshipType.MOOVALUR_SCHOLARSHIP, label: 'Moovalur Scholarship' },
  { value: ScholarshipType.MERIT_SCHOLARSHIP, label: 'Merit Scholarship' },
  { value: ScholarshipType.SPORTS_SCHOLARSHIP, label: 'Sports Scholarship' },
  { value: ScholarshipType.MINORITY_SCHOLARSHIP, label: 'Minority Scholarship' },
  { value: ScholarshipType.EWS_SCHOLARSHIP, label: 'EWS Scholarship' },
  { value: ScholarshipType.WELFARE_SCHOLARSHIP, label: 'Welfare Scholarship' },
  { value: ScholarshipType.SALEM_FOUNDATIONS_SCHOLARSHIP, label: 'Salem Foundations Scholarship' },
  { value: ScholarshipType.TAMIL_PUTHALVAN, label: 'Tamil Puthalvan' },
  { value: ScholarshipType.PUDUMAIPEN, label: 'Pudumaipen' },
  { value: ScholarshipType.PRIVATE_TRUST, label: 'Private Trust' },
  { value: ScholarshipType.COLLEGE_SCHOLARSHIP, label: 'College Scholarship' },
  { value: ScholarshipType.NONE, label: 'None' },
];

const ENTRANCE_EXAMS = [
  { value: EntranceExam.JEE_MAIN_ADVANCED, label: 'JEE Main / Advanced' },
  { value: EntranceExam.VITEEE, label: 'VITEEE' },
  { value: EntranceExam.SRMJEEE, label: 'SRMJEEE' },
  { value: EntranceExam.BITSAT, label: 'BITSAT' },
  { value: EntranceExam.AMRITA_AEEE, label: 'AMRITA AEEE' },
  { value: EntranceExam.KIITEE, label: 'KIITEE' },
  { value: EntranceExam.MANIPAL_MET, label: 'Manipal MET' },
  { value: EntranceExam.NEET_UG, label: 'NEET UG' },
  { value: EntranceExam.AIIMS_NURSING, label: 'AIIMS/Nursing' },
  { value: EntranceExam.JIPMER_AHS, label: 'JIPMER AHS' },
  { value: EntranceExam.CLAT, label: 'CLAT' },
  { value: EntranceExam.AILET, label: 'AILET' },
  { value: EntranceExam.LSAT_INDIA, label: 'LSAT-India' },
  { value: EntranceExam.NATA, label: 'NATA' },
  { value: EntranceExam.JEE_PAPER_2, label: 'JEE Paper 2' },
  { value: EntranceExam.CUET_UG, label: 'CUET UG' },
  { value: EntranceExam.IPMAT, label: 'IPMAT' },
  { value: EntranceExam.SET_SYMBIOSIS, label: 'SET (Symbiosis)' },
  { value: EntranceExam.CHRIST_ENTRANCE, label: 'Christ Entrance' },
  { value: EntranceExam.XAVIERS_ENTRANCE, label: "Xavier's Entrance" },
  { value: EntranceExam.NID_DAT, label: 'NID DAT' },
  { value: EntranceExam.NIFT, label: 'NIFT' },
  { value: EntranceExam.UCEED_CEED, label: 'UCEED / CEED' },
  { value: EntranceExam.NCHM_JEE, label: 'NCHM JEE' },
  { value: EntranceExam.IMU_CET, label: 'IMU CET' },
  { value: EntranceExam.TMI_ENTRANCE, label: 'TMI Entrance' },
  { value: EntranceExam.AMET_ENTRANCE, label: 'AMET Entrance' },
  { value: EntranceExam.ICAR_AIEEA, label: 'ICAR AIEEA' },
  { value: EntranceExam.TANUVAS_ENTRANCE, label: 'TANUVAS Entrance' },
  { value: EntranceExam.NDA, label: 'NDA' },
  { value: EntranceExam.AIR_FORCE_AGNIVEER, label: 'Air Force Agniveer' },
  { value: EntranceExam.NAVY_SSR_AA, label: 'Navy SSR/AA' },
  { value: EntranceExam.COAST_GUARD, label: 'Coast Guard' },
];

const REFERRAL_SOURCES = [
  { value: ReferralSource.FRIENDS_FAMILY, label: 'Friends/Family' },
  { value: ReferralSource.SCHOOL_COLLEGE, label: 'School/College' },
  { value: ReferralSource.COUNSELOR, label: 'Counselor' },
  { value: ReferralSource.SOCIAL_MEDIA, label: 'Social Media' },
  { value: ReferralSource.NEWSPAPER_AD, label: 'Newspaper Advertisement' },
  { value: ReferralSource.WEBSITE, label: 'Website' },
  { value: ReferralSource.WHATSAPP, label: 'WhatsApp' },
  { value: ReferralSource.OTHERS, label: 'Others' },
];

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<StudentApplication | null>(null);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setIsLoading(true);
      const app = await getApplicationById(applicationId);
      
      if (!app) {
        toast.error('Application not found');
        router.push('/admin/applications');
        return;
      }

      setApplication(app);

      // Convert application data to form values
      const formValues = {
        // Personal Details
        firstName: app.personalDetails.firstName || '',
        lastName: app.personalDetails.lastName || '',
        dateOfBirth: app.personalDetails.dateOfBirth || '',
        gender: app.personalDetails.gender || '',
        email: app.personalDetails.email || '',
        mobile: app.personalDetails.mobile || '',
        whatsappNumber: app.personalDetails.whatsappNumber || '',
        aadharNumber: app.personalDetails.aadharNumber || '',
        photoUrl: app.personalDetails.photoUrl || '',
        address: app.personalDetails.address || {
          line1: '',
          line2: '',
          city: '',
          district: '',
          state: 'Tamil Nadu',
          pincode: '',
        },
        fatherName: app.personalDetails.fatherName || '',
        fatherOccupation: app.personalDetails.fatherOccupation || '',
        fatherMobile: app.personalDetails.fatherMobile || '',
        motherName: app.personalDetails.motherName || '',
        motherOccupation: app.personalDetails.motherOccupation || '',
        motherMobile: app.personalDetails.motherMobile || '',
        guardianName: app.personalDetails.guardianName || '',
        guardianMobile: app.personalDetails.guardianMobile || '',
        siblings: app.personalDetails.siblings || [],

        // Academic Details
        tenthSchoolDistrict: app.academicDetails.tenthSchoolDistrict || '',
        tenthSchool: app.academicDetails.tenthSchool || '',
        tenthSchoolOther: app.academicDetails.tenthSchoolOther || '',
        tenthBoard: app.academicDetails.tenthBoard || '',
        tenthYearOfPassing: app.academicDetails.tenthYearOfPassing || '',
        tenthPercentage: app.academicDetails.tenthPercentage || '',
        tenthMarks: app.academicDetails.tenthMarks || '',
        tenthTotalMarks: app.academicDetails.tenthTotalMarks || 500,
        twelfthSchoolDistrict: app.academicDetails.twelfthSchoolDistrict || '',
        twelfthSchool: app.academicDetails.twelfthSchool || '',
        twelfthSchoolOther: app.academicDetails.twelfthSchoolOther || '',
        twelfthBoard: app.academicDetails.twelfthBoard || '',
        twelfthYearOfPassing: app.academicDetails.twelfthYearOfPassing || '',
        twelfthPercentage: app.academicDetails.twelfthPercentage || '',
        twelfthMarks: app.academicDetails.twelfthMarks || '',
        twelfthTotalMarks: app.academicDetails.twelfthTotalMarks || 600,
        twelfthGroup: app.academicDetails.twelfthGroup || '',
        neetScore: app.academicDetails.neetScore || '',
        neetRank: app.academicDetails.neetRank || '',
        neetYear: app.academicDetails.neetYear || '',
        jeeScore: app.academicDetails.jeeScore || '',
        jeeRank: app.academicDetails.jeeRank || '',
        jeeYear: app.academicDetails.jeeYear || '',
        preparingForExam: app.academicDetails.preparingForExam || '',
        studiedInGovtSchool: app.academicDetails.studiedInGovtSchool || false,
        studiedInGovtAidedTamilMedium: app.academicDetails.studiedInGovtAidedTamilMedium || false,

        // Course Preference
        preferredCourse: app.coursePreference.preferredCourse || '',
        courseSpecialization: app.coursePreference.courseSpecialization || '',
        collegeDistrict: app.coursePreference.collegeDistrict || '',
        collegeName: app.coursePreference.collegeName || '',
        collegeNameOther: app.coursePreference.collegeNameOther || '',
        preferredDistricts: app.coursePreference.preferredDistricts || [],
        preferredColleges: app.coursePreference.preferredColleges || [],
        additionalFreeCourses: app.coursePreference.additionalFreeCourses || [],

        // Community & Scholarship
        community: app.communityScholarship.community || '',
        scholarshipType: app.communityScholarship.scholarshipType || [],
        scholarshipDetails: app.communityScholarship.scholarshipDetails || '',
        annualFamilyIncome: app.communityScholarship.annualFamilyIncome || '',
        firstGraduate: app.communityScholarship.firstGraduate || false,
        needsEducationalLoan: app.communityScholarship.needsEducationalLoan || false,

        // Referral Details
        source: app.referralDetails?.source || '',
        referrerName: app.referralDetails?.referrerName || '',
        referrerMobile: app.referralDetails?.referrerMobile || '',
        referrerDetails: app.referralDetails?.referrerDetails || '',
        followedSocialMedia: app.referralDetails?.followedSocialMedia || {
          instagram: false,
          facebook: false,
          youtube: false,
        },

        // Declaration
        declaration: app.declaration || false,
      };

      setInitialValues(formValues);
    } catch (error) {
      console.error('Error loading application:', error);
      toast.error('Failed to load application');
      router.push('/admin/applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentValidationSchema = () => {
    switch (currentStep) {
      case 1:
        return personalDetailsSchema;
      case 2:
        return academicDetailsSchema;
      case 3:
        return coursePreferenceSchema;
      case 4:
        return communityScholarshipSchema;
      case 5:
        return referralDetailsSchema;
      default:
        return Yup.object().shape({});
    }
  };

  const handleNext = async (values: any, { setTouched }: any) => {
    try {
      await getCurrentValidationSchema().validate(values, { abortEarly: false });
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const touchedFields: any = {};
        error.inner.forEach((err) => {
          if (err.path) touchedFields[err.path] = true;
        });
        setTouched(touchedFields);
        
        const firstError = error.inner[0];
        if (firstError) {
          toast.error(firstError.message);
        }
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      const removeUndefined = (obj: any): any => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== '') {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              acc[key] = removeUndefined(value);
            } else {
              acc[key] = value;
            }
          }
          return acc;
        }, {} as any);
      };

      const personalDetails: PersonalDetails = removeUndefined({
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        email: values.email,
        mobile: values.mobile,
        whatsappNumber: values.whatsappNumber,
        aadharNumber: values.aadharNumber,
        photoUrl: values.photoUrl,
        address: values.address,
        fatherName: values.fatherName,
        fatherOccupation: values.fatherOccupation,
        fatherMobile: values.fatherMobile,
        motherName: values.motherName,
        motherOccupation: values.motherOccupation,
        motherMobile: values.motherMobile,
        guardianName: values.guardianName,
        guardianMobile: values.guardianMobile,
        siblings: values.siblings?.filter((s: any) => s.name && s.education) || [],
      });

      const academicDetails: AcademicDetails = removeUndefined({
        tenthSchoolDistrict: values.tenthSchoolDistrict,
        tenthSchool: values.tenthSchool === 'Other' ? values.tenthSchoolOther : values.tenthSchool,
        tenthSchoolOther: values.tenthSchool === 'Other' ? values.tenthSchoolOther : undefined,
        tenthBoard: values.tenthBoard,
        tenthYearOfPassing: values.tenthYearOfPassing,
        tenthPercentage: Number(values.tenthPercentage),
        tenthMarks: Number(values.tenthMarks),
        tenthTotalMarks: Number(values.tenthTotalMarks),
        twelfthSchoolDistrict: values.twelfthSchoolDistrict,
        twelfthSchool: values.twelfthSchool === 'Other' ? values.twelfthSchoolOther : values.twelfthSchool,
        twelfthSchoolOther: values.twelfthSchool === 'Other' ? values.twelfthSchoolOther : undefined,
        twelfthBoard: values.twelfthBoard,
        twelfthYearOfPassing: values.twelfthYearOfPassing,
        twelfthPercentage: Number(values.twelfthPercentage),
        twelfthMarks: Number(values.twelfthMarks),
        twelfthTotalMarks: Number(values.twelfthTotalMarks),
        twelfthGroup: values.twelfthGroup,
        neetScore: values.neetScore ? Number(values.neetScore) : undefined,
        neetRank: values.neetRank ? Number(values.neetRank) : undefined,
        neetYear: values.neetYear,
        jeeScore: values.jeeScore ? Number(values.jeeScore) : undefined,
        jeeRank: values.jeeRank ? Number(values.jeeRank) : undefined,
        jeeYear: values.jeeYear,
        preparingForExam: values.preparingForExam,
        studiedInGovtSchool: values.studiedInGovtSchool,
        studiedInGovtAidedTamilMedium: values.studiedInGovtAidedTamilMedium,
      });

      const coursePreference: CoursePreference = removeUndefined({
        preferredCourse: values.preferredCourse,
        courseSpecialization: values.courseSpecialization,
        collegeDistrict: values.collegeDistrict,
        collegeName: values.collegeName === 'Other' ? values.collegeNameOther : values.collegeName,
        collegeNameOther: values.collegeName === 'Other' ? values.collegeNameOther : undefined,
        preferredDistricts: values.preferredDistricts,
        preferredColleges: values.preferredColleges,
        additionalFreeCourses: values.additionalFreeCourses,
      });

      const communityScholarship: CommunityScholarshipDetails = removeUndefined({
        community: values.community,
        scholarshipType: values.scholarshipType,
        scholarshipDetails: values.scholarshipDetails,
        annualFamilyIncome: Number(values.annualFamilyIncome),
        firstGraduate: values.firstGraduate,
        needsEducationalLoan: values.needsEducationalLoan,
      });

      const referralDetails: ReferralDetails = removeUndefined({
        source: values.source,
        referrerName: values.referrerName,
        referrerMobile: values.referrerMobile,
        referrerDetails: values.referrerDetails,
        followedSocialMedia: values.followedSocialMedia,
      });

      // Update application (keeping the same application number)
      await updateApplication(applicationId, {
        personalDetails,
        academicDetails,
        coursePreference,
        communityScholarship,
        referralDetails,
        declaration: values.declaration,
      });

      toast.success('Application updated successfully!');
      router.push(`/admin/applications/${applicationId}`);
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!initialValues || !application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Image
                  src="/logo_eng.jpg"
                  alt="Salem Foundations"
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
                <p className="text-gray-600 mt-2">Application No: {application.applicationNumber}</p>
                <div className="mt-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full inline-block">
                  Editing Mode
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      step < TOTAL_STEPS ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep === step
                          ? 'bg-primary-600 text-white'
                          : currentStep > step
                          ? 'bg-success-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                    {step < TOTAL_STEPS && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          currentStep > step ? 'bg-success-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Personal</span>
                <span>Academic</span>
                <span>Course</span>
                <span>Community</span>
                <span>Referral</span>
              </div>
            </div>
          </div>

          {/* Form - Rest of the form content will be imported from the main apply page */}
          <Formik
            initialValues={initialValues}
            validationSchema={getCurrentValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, setFieldValue, setTouched }) => (
              <Form className="space-y-8">
                <div className="bg-white rounded-lg shadow-xl p-8">
                  <ApplicationFormSteps 
                    currentStep={currentStep}
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between bg-white rounded-lg shadow-xl p-6">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="btn btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      type="button"
                      onClick={() => handleNext(values, { setTouched })}
                      className="btn btn-primary flex items-center"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-success flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Update Application
                        </>
                      )}
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
