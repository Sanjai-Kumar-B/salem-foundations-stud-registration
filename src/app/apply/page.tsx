'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
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
} from '@/types';
import {
  personalDetailsSchema,
  academicDetailsSchema,
  coursePreferenceSchema,
  communityScholarshipSchema,
  referralDetailsSchema,
} from '@/lib/validations';
import { FormInput, FormSelect, FormCheckbox, NestedFormInput, NestedFormSelect, FormStep } from '@/components/FormComponents';
import { createApplication, storeStudentRating } from '@/lib/firestore';

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
];

const COURSE_TYPES = [
  { value: CourseType.ENGINEERING_TECHNOLOGY, label: 'Engineering & Technology' },
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

const COLLEGES = [
  'Government College',
  'Private College',
  'Abroad College'
];

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const initialValues = {
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '' as Gender,
    email: '',
    mobile: '',
    whatsappNumber: '',
    aadharNumber: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      state: 'Tamil Nadu',
      pincode: '',
    },
    fatherName: '',
    fatherMobile: '',
    motherName: '',
    motherMobile: '',
    guardianName: '',
    guardianMobile: '',

    // Academic Details
    tenthSchool: '',
    tenthBoard: '',
    tenthYearOfPassing: '',
    tenthPercentage: '' as any,
    tenthMarks: '' as any,
    tenthTotalMarks: '' as any,
    twelfthSchool: '',
    twelfthBoard: '',
    twelfthYearOfPassing: '',
    twelfthPercentage: '' as any,
    twelfthMarks: '' as any,
    twelfthTotalMarks: '' as any,
    twelfthGroup: '' as TwelfthGroup,
    neetScore: '' as any,
    neetRank: '' as any,
    neetYear: '',
    jeeScore: '' as any,
    jeeRank: '' as any,
    jeeYear: '',
    preparingForExam: '',
    studiedInTamilMedium: false,

    // Course Preference
    preferredCourse: '' as CourseType,
    courseSpecialization: '',
    preferredColleges: [] as string[],
    additionalFreeCourses: [] as string[],

    // Community & Scholarship
    community: '' as Community,
    scholarshipType: [] as ScholarshipType[],
    scholarshipDetails: '',
    annualFamilyIncome: '' as any,
    firstGraduate: false,
    needsEducationalLoan: false,

    // Referral Details
    source: '' as ReferralSource,
    referrerName: '',
    referrerMobile: '',
    referrerDetails: '',
    followedSocialMedia: {
      instagram: false,
      facebook: false,
      youtube: false,
    },
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
        
        // Show first error message
        const firstError = error.inner[0];
        if (firstError) {
          toast.error(firstError.message);
          console.error('Validation errors:', error.inner.map(e => ({ path: e.path, message: e.message })));
        } else {
          toast.error('Please fill all required fields correctly');
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
      // Helper function to remove undefined values
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

      // Prepare application data
      const personalDetails: PersonalDetails = removeUndefined({
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        email: values.email,
        mobile: values.mobile,
        whatsappNumber: values.whatsappNumber,
        aadharNumber: values.aadharNumber,
        address: values.address,
        fatherName: values.fatherName,
        fatherMobile: values.fatherMobile,
        motherName: values.motherName,
        motherMobile: values.motherMobile,
        guardianName: values.guardianName,
        guardianMobile: values.guardianMobile,
      });

      const academicDetails: AcademicDetails = removeUndefined({
        tenthSchool: values.tenthSchool,
        tenthBoard: values.tenthBoard,
        tenthYearOfPassing: values.tenthYearOfPassing,
        tenthPercentage: Number(values.tenthPercentage),
        tenthMarks: Number(values.tenthMarks),
        tenthTotalMarks: Number(values.tenthTotalMarks),
        twelfthSchool: values.twelfthSchool,
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
        studiedInTamilMedium: values.studiedInTamilMedium,
      });

      const coursePreference: CoursePreference = removeUndefined({
        preferredCourse: values.preferredCourse,
        courseSpecialization: values.courseSpecialization,
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

      // Create application
      const { id: applicationId, applicationNumber } = await createApplication({
        personalDetails,
        academicDetails,
        coursePreference,
        communityScholarship,
        referralDetails,
        status: ApplicationStatus.NEW,
      });

      toast.success('Application submitted successfully!');
      router.push(`/apply/success?id=${applicationId}&number=${applicationNumber}`);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMessage = error?.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
      
      // Log detailed error for debugging
      if (error?.code) {
        console.error('Firebase Error Code:', error.code);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmittingRating(true);

    try {
      console.log('Submitting rating:', { rating: selectedRating, comment: ratingComment });
      
      // Store rating in Firestore
      const ratingId = await storeStudentRating({
        rating: selectedRating,
        comment: ratingComment || undefined,
      });

      console.log('Rating submitted successfully with ID:', ratingId);

      // Handle different rating scenarios
      if (selectedRating <= 2) {
        // Low rating
        toast.success('Thank you! We value your feedback and will improve our services.');
        setShowRatingModal(false);
      } else if (selectedRating === 3) {
        // Neutral rating
        toast.success('Thanks for your feedback!');
        setShowRatingModal(false);
      } else {
        // High rating (4 or 5)
        toast.success('Thank you for your positive feedback!');
        setTimeout(() => {
          window.open('https://share.google/IHtKKwBHs9Am6uIDF', '_blank');
          setShowRatingModal(false);
        }, 1000);
      }

      // Reset form
      setSelectedRating(0);
      setRatingComment('');
    } catch (error) {
      console.error('Error submitting rating:', error);
      
      // More detailed error message
      if (error instanceof Error) {
        toast.error(`Failed to submit rating: ${error.message}`);
      } else {
        toast.error('Failed to submit rating. Please try again.');
      }
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const stepTitles = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'Academic Details', icon: GraduationCap },
    { number: 3, title: 'Course Preference', icon: BookOpen },
    { number: 4, title: 'Community & Scholarship', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <Image
                src="/logo.jpg"
                alt="Salem Foundations Logo"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Salem Foundations Registration Form
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {stepTitles.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? 'bg-success-500 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs text-center ${
                        isCurrent ? 'text-primary-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {step.number < TOTAL_STEPS && (
                    <div
                      className={`h-1 mt-6 -mx-2 ${
                        isCompleted ? 'bg-success-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={getCurrentValidationSchema()}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ values, setFieldValue, errors, touched, setTouched }) => (
            <Form>
              <div className="card">
                {/* Step 1: Personal Details */}
                <FormStep currentStep={currentStep} stepNumber={1}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="First Name"
                      name="firstName"
                      placeholder="Enter first name"
                      required
                    />
                    <FormInput
                      label="Last Name"
                      name="lastName"
                      placeholder="Enter last name"
                      required
                    />
                    <FormInput
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      required
                    />
                    <FormSelect
                      label="Gender"
                      name="gender"
                      options={Object.values(Gender).map((g) => ({ value: g, label: g }))}
                      required
                    />
                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                    <FormInput
                      label="Mobile Number"
                      name="mobile"
                      placeholder="10-digit mobile number"
                      required
                    />
                    <FormInput
                      label="WhatsApp Number"
                      name="whatsappNumber"
                      placeholder="10-digit WhatsApp number"
                      required
                    />
                    <FormInput
                      label="Aadhar Number"
                      name="aadharNumber"
                      placeholder="12-digit Aadhar number"
                      required
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NestedFormInput
                      label="Address Line 1"
                      name="address.line1"
                      placeholder="House/Flat No, Street"
                      required
                    />
                    <NestedFormInput
                      label="Address Line 2"
                      name="address.line2"
                      placeholder="Area, Locality"
                    />
                    <NestedFormInput
                      label="City"
                      name="address.city"
                      placeholder="Enter city"
                      required
                    />
                    <NestedFormSelect
                      label="District"
                      name="address.district"
                      options={DISTRICTS.map((d) => ({ value: d, label: d }))}
                      required
                    />
                    <NestedFormSelect
                      label="State"
                      name="address.state"
                      options={STATES.map((s) => ({ value: s, label: s }))}
                      required
                    />
                    <NestedFormInput
                      label="Pincode"
                      name="address.pincode"
                      placeholder="6-digit pincode"
                      required
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Family Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Father's Name"
                      name="fatherName"
                      placeholder="Enter father's name"
                      required
                    />
                    <FormInput
                      label="Father's Mobile Number"
                      name="fatherMobile"
                      placeholder="10-digit mobile number"
                      required
                    />
                    <FormInput
                      label="Mother's Name"
                      name="motherName"
                      placeholder="Enter mother's name"
                      required
                    />
                    <FormInput
                      label="Mother's Mobile Number"
                      name="motherMobile"
                      placeholder="10-digit mobile number"
                      required
                    />
                    <FormInput
                      label="Guardian's Name (if applicable)"
                      name="guardianName"
                      placeholder="Enter guardian's name"
                    />
                    <FormInput
                      label="Guardian's Mobile (if applicable)"
                      name="guardianMobile"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </FormStep>

                {/* Step 2: Academic Details */}
                <FormStep currentStep={currentStep} stepNumber={2}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Academic Details
                  </h2>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">10th Standard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="School Name"
                      name="tenthSchool"
                      placeholder="Enter school name"
                      required
                    />
                    <FormSelect
                      label="Board"
                      name="tenthBoard"
                      options={BOARDS.map((b) => ({ value: b, label: b }))}
                      required
                    />
                    <FormInput
                      label="Year of Passing"
                      name="tenthYearOfPassing"
                      placeholder="YYYY"
                      required
                    />
                    <FormInput
                      label="Percentage"
                      name="tenthPercentage"
                      type="number"
                      placeholder="Enter percentage"
                      required
                    />
                    <FormInput
                      label="Marks Obtained"
                      name="tenthMarks"
                      type="number"
                      placeholder="Marks obtained"
                      required
                    />
                    <FormInput
                      label="Total Marks"
                      name="tenthTotalMarks"
                      type="number"
                      placeholder="Total marks"
                      required
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">12th Standard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="School Name"
                      name="twelfthSchool"
                      placeholder="Enter school name"
                      required
                    />
                    <FormSelect
                      label="Board"
                      name="twelfthBoard"
                      options={BOARDS.map((b) => ({ value: b, label: b }))}
                      required
                    />
                    <FormInput
                      label="Year of Passing"
                      name="twelfthYearOfPassing"
                      placeholder="YYYY"
                      required
                    />
                    <FormSelect
                      label="12th Group"
                      name="twelfthGroup"
                      options={TWELFTH_GROUPS}
                      required
                    />
                    <FormInput
                      label="Percentage"
                      name="twelfthPercentage"
                      type="number"
                      placeholder="Enter percentage"
                      required
                    />
                    <FormInput
                      label="Marks Obtained"
                      name="twelfthMarks"
                      type="number"
                      placeholder="Marks obtained"
                      required
                    />
                    <FormInput
                      label="Total Marks"
                      name="twelfthTotalMarks"
                      type="number"
                      placeholder="Total marks"
                      required
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                    Competitive Exams (if applicable)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="NEET Score"
                      name="neetScore"
                      type="number"
                      placeholder="Enter NEET score"
                    />
                    <FormInput
                      label="NEET Rank"
                      name="neetRank"
                      type="number"
                      placeholder="Enter NEET rank"
                    />
                    <FormInput
                      label="NEET Year"
                      name="neetYear"
                      placeholder="YYYY"
                    />
                    <FormInput
                      label="JEE Score"
                      name="jeeScore"
                      type="number"
                      placeholder="Enter JEE score"
                    />
                    <FormInput
                      label="JEE Rank"
                      name="jeeRank"
                      type="number"
                      placeholder="Enter JEE rank"
                    />
                    <FormInput
                      label="JEE Year"
                      name="jeeYear"
                      placeholder="YYYY"
                    />
                  </div>

                  {/* Entrance Exam Preparation */}
                  <div className="mt-6">
                    <FormSelect
                      label="Which Entrance Exam are you preparing for?"
                      name="preparingForExam"
                      options={ENTRANCE_EXAMS}
                      placeholder="Select entrance exam (optional)"
                    />
                  </div>

                  {/* Tamil Medium */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      From 6th to 12th have you Studied in Tamil Medium? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="studiedInTamilMedium"
                          value="true"
                          checked={values.studiedInTamilMedium === true}
                          onChange={() => setFieldValue('studiedInTamilMedium', true)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="studiedInTamilMedium"
                          value="false"
                          checked={values.studiedInTamilMedium === false}
                          onChange={() => setFieldValue('studiedInTamilMedium', false)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </FormStep>

                {/* Step 3: Course Preference */}
                <FormStep currentStep={currentStep} stepNumber={3}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Course Preference
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Preferred Course"
                      name="preferredCourse"
                      options={COURSE_TYPES}
                      required
                    />
                    {values.preferredCourse && values.preferredCourse !== CourseType.OTHERS && (
                      <FormSelect
                        label="Course Specialization"
                        name="courseSpecialization"
                        options={SPECIALIZED_COURSES[values.preferredCourse].map((s) => ({ value: s, label: s }))}
                        placeholder="Select specialization"
                      />
                    )}
                    {values.preferredCourse === CourseType.OTHERS && (
                      <FormInput
                        label="Specify Course"
                        name="courseSpecialization"
                        placeholder="Please specify the course"
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                    Preferred College Type (Select up to 3)
                  </h3>
                  <div className="space-y-2">
                    {COLLEGES.map((college) => (
                      <div key={college} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`college-${college}`}
                          checked={values.preferredColleges.includes(college)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (values.preferredColleges.length < 3) {
                                setFieldValue('preferredColleges', [
                                  ...values.preferredColleges,
                                  college,
                                ]);
                              } else {
                                toast.error('You can select up to 3 options only');
                              }
                            } else {
                              setFieldValue(
                                'preferredColleges',
                                values.preferredColleges.filter((c) => c !== college)
                              );
                            }
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`college-${college}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {college}
                        </label>
                      </div>
                    ))}
                  </div>
                  {touched.preferredColleges && errors.preferredColleges && (
                    <p className="error-text">{errors.preferredColleges as string}</p>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                    Additional Free Courses (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select any additional free courses you're interested in
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FREE_COURSES.map((course) => (
                      <div key={course} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id={`free-course-${course}`}
                          checked={values.additionalFreeCourses.includes(course)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue('additionalFreeCourses', [
                                ...values.additionalFreeCourses,
                                course,
                              ]);
                            } else {
                              setFieldValue(
                                'additionalFreeCourses',
                                values.additionalFreeCourses.filter((c) => c !== course)
                              );
                            }
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`free-course-${course}`}
                          className="ml-3 text-sm text-gray-700 font-medium cursor-pointer"
                        >
                          {course}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormStep>

                {/* Step 4: Community & Scholarship */}
                <FormStep currentStep={currentStep} stepNumber={4}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Community & Scholarship Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                      label="Community"
                      name="community"
                      options={Object.values(Community).map((c) => ({ value: c, label: c.replace('_', '(') + (c.includes('_') ? ')' : '') }))}
                      required
                    />
                    <FormInput
                      label="Annual Family Income (₹)"
                      name="annualFamilyIncome"
                      type="number"
                      placeholder="Enter annual income"
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Scholarship Type <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Select all scholarships that apply to you
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SCHOLARSHIP_TYPES.map((scholarship) => (
                        <div key={scholarship.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            id={`scholarship-${scholarship.value}`}
                            checked={values.scholarshipType.includes(scholarship.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('scholarshipType', [
                                  ...values.scholarshipType,
                                  scholarship.value,
                                ]);
                              } else {
                                setFieldValue(
                                  'scholarshipType',
                                  values.scholarshipType.filter((s) => s !== scholarship.value)
                                );
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <label
                            htmlFor={`scholarship-${scholarship.value}`}
                            className="ml-3 text-sm text-gray-700 cursor-pointer"
                          >
                            {scholarship.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {touched.scholarshipType && errors.scholarshipType && (
                      <p className="error-text mt-2">{errors.scholarshipType as string}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <FormInput
                      label="Scholarship Details (if applicable)"
                      name="scholarshipDetails"
                      placeholder="Enter scholarship name or details"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      You need a Educational loan? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="needsEducationalLoan"
                          value="true"
                          checked={values.needsEducationalLoan === true}
                          onChange={() => setFieldValue('needsEducationalLoan', true)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="needsEducationalLoan"
                          value="false"
                          checked={values.needsEducationalLoan === false}
                          onChange={() => setFieldValue('needsEducationalLoan', false)}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <FormCheckbox
                      label="I am a first graduate in my family"
                      name="firstGraduate"
                      description="Check this if you are the first person in your family to pursue higher education"
                    />
                  </div>
                </FormStep>

                {/* Step 5: Referral Details */}
                <FormStep currentStep={currentStep} stepNumber={5}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    How Did You Know About Salem Foundations?
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormSelect
                        label="How did you hear about us?"
                        name="source"
                        options={REFERRAL_SOURCES}
                        required
                      />
                    </div>
                    
                    {(values.source === ReferralSource.FRIENDS_FAMILY || 
                      values.source === ReferralSource.SCHOOL_COLLEGE || 
                      values.source === ReferralSource.COUNSELOR ||
                      values.source === ReferralSource.OTHERS) && (
                      <>
                        <FormInput
                          label="Referrer Name"
                          name="referrerName"
                          placeholder="Enter referrer's name"
                          required
                        />
                        {(values.source === ReferralSource.FRIENDS_FAMILY || 
                          values.source === ReferralSource.SCHOOL_COLLEGE ||
                          values.source === ReferralSource.COUNSELOR) && (
                          <FormInput
                            label="Referrer Mobile Number (Optional)"
                            name="referrerMobile"
                            placeholder="10-digit mobile number"
                          />
                        )}
                      </>
                    )}
                    
                    {values.source === ReferralSource.OTHERS && (
                      <div className="md:col-span-2">
                        <FormInput
                          label="Please specify"
                          name="referrerDetails"
                          placeholder="Tell us more about how you heard about us"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Follow Us on Social Media
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Stay updated with our latest programs and opportunities!
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="instagram"
                            checked={values.followedSocialMedia.instagram}
                            onChange={(e) => setFieldValue('followedSocialMedia.instagram', e.target.checked)}
                            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                          />
                          <label htmlFor="instagram" className="ml-3 text-sm font-medium text-gray-700">
                            I follow on Instagram
                          </label>
                        </div>
                        <a
                          href="https://www.instagram.com/salemfoundationsscholarship?igsh=a3g3a3kxa2RjZXBn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium rounded-md hover:from-pink-700 hover:to-purple-700 transition-colors"
                        >
                          Follow on Instagram
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="facebook"
                            checked={values.followedSocialMedia.facebook}
                            onChange={(e) => setFieldValue('followedSocialMedia.facebook', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="facebook" className="ml-3 text-sm font-medium text-gray-700">
                            I follow on Facebook
                          </label>
                        </div>
                        <a
                          href="https://www.facebook.com/share/1EcU2mDgoH/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Follow on Facebook
                        </a>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="youtube"
                            checked={values.followedSocialMedia.youtube}
                            onChange={(e) => setFieldValue('followedSocialMedia.youtube', e.target.checked)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <label htmlFor="youtube" className="ml-3 text-sm font-medium text-gray-700">
                            I subscribe on YouTube
                          </label>
                        </div>
                        <a
                          href="https://youtube.com/@salemfoundations?si=QVuyA4FHXrX2584f"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          Subscribe on YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </FormStep>



                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="btn btn-secondary flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </button>
                  )}

                  <div className="ml-auto">
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
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedRating(0);
                  setRatingComment('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  How was your experience?
                </h3>
                <p className="text-gray-600">
                  Your feedback helps us improve
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoverRating || selectedRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Text */}
              {selectedRating > 0 && (
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-700">
                    {selectedRating === 1 && 'Poor'}
                    {selectedRating === 2 && 'Below Average'}
                    {selectedRating === 3 && 'Average'}
                    {selectedRating === 4 && 'Good'}
                    {selectedRating === 5 && 'Excellent'}
                  </p>
                </div>
              )}

              {/* Comment Box (shown for ratings 1-3) */}
              {selectedRating > 0 && selectedRating <= 3 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us more (Optional)
                  </label>
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="What could we improve?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0 || isSubmittingRating}
                className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingRating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Rating'
                )}
              </button>

              {/* Info Text for High Ratings */}
              {selectedRating >= 4 && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  After submitting, you'll be redirected to leave a Google review
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
