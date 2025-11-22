'use client';

import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Shield, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  Gender,
  PlusTwoGroup,
  CourseType,
  Community,
  ScholarshipType,
  ApplicationStatus,
  PersonalDetails,
  AcademicDetails,
  CoursePreference,
  CommunityScholarshipDetails,
  Documents,
} from '@/types';
import {
  personalDetailsSchema,
  academicDetailsSchema,
  coursePreferenceSchema,
  communityScholarshipSchema,
} from '@/lib/validations';
import { FormInput, FormSelect, FormCheckbox, NestedFormInput, NestedFormSelect, FormStep } from '@/components/FormComponents';
import { createApplication } from '@/lib/firestore';
import { generateApplicationNumber } from '@/lib/utils';

const TOTAL_STEPS = 4;

const DISTRICTS = [
  'Salem', 'Namakkal', 'Erode', 'Dharmapuri', 'Krishnagiri',
  'Coimbatore', 'Tiruppur', 'Karur', 'Trichy', 'Chennai',
  'Madurai', 'Other'
];

const COLLEGES = [
  'Government Medical College',
  'Private Medical College',
  'Government Engineering College',
  'Private Engineering College',
  'Arts and Science College',
  'Nursing College',
  'Paramedical Institute',
  'Polytechnic College',
  'Other'
];

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    motherName: '',
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
    plusTwoGroup: '' as PlusTwoGroup,
    neetScore: '' as any,
    neetRank: '' as any,
    neetYear: '',
    jeeScore: '' as any,
    jeeRank: '' as any,
    jeeYear: '',

    // Course Preference
    preferredCourse: '' as CourseType,
    alternativeCourse: '' as CourseType,
    preferredColleges: [] as string[],
    courseSpecialization: '',

    // Community & Scholarship
    community: '' as Community,
    scholarshipType: '' as ScholarshipType,
    scholarshipDetails: '',
    annualFamilyIncome: '' as any,
    firstGraduate: false,
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
      const applicationNumber = generateApplicationNumber();

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
        motherName: values.motherName,
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
        plusTwoGroup: values.plusTwoGroup,
        neetScore: values.neetScore ? Number(values.neetScore) : undefined,
        neetRank: values.neetRank ? Number(values.neetRank) : undefined,
        neetYear: values.neetYear,
        jeeScore: values.jeeScore ? Number(values.jeeScore) : undefined,
        jeeRank: values.jeeRank ? Number(values.jeeRank) : undefined,
        jeeYear: values.jeeYear,
      });

      const coursePreference: CoursePreference = removeUndefined({
        preferredCourse: values.preferredCourse,
        alternativeCourse: values.alternativeCourse,
        preferredColleges: values.preferredColleges,
        courseSpecialization: values.courseSpecialization,
      });

      const communityScholarship: CommunityScholarshipDetails = removeUndefined({
        community: values.community,
        scholarshipType: values.scholarshipType,
        scholarshipDetails: values.scholarshipDetails,
        annualFamilyIncome: Number(values.annualFamilyIncome),
        firstGraduate: values.firstGraduate,
      });

      // Create application
      const applicationId = await createApplication({
        personalDetails,
        academicDetails,
        coursePreference,
        communityScholarship,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Application Form
          </h1>
          <p className="text-gray-600">Salem Foundations - Admission 2025</p>
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
                      placeholder="Optional"
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
                    <NestedFormInput
                      label="State"
                      name="address.state"
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
                      label="Mother's Name"
                      name="motherName"
                      placeholder="Enter mother's name"
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
                    <FormInput
                      label="Board"
                      name="tenthBoard"
                      placeholder="CBSE, State Board, etc."
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
                    <FormInput
                      label="Board"
                      name="twelfthBoard"
                      placeholder="CBSE, State Board, etc."
                      required
                    />
                    <FormInput
                      label="Year of Passing"
                      name="twelfthYearOfPassing"
                      placeholder="YYYY"
                      required
                    />
                    <FormSelect
                      label="+2 Group"
                      name="plusTwoGroup"
                      options={Object.values(PlusTwoGroup).map((g) => ({ value: g, label: g }))}
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
                      options={Object.values(CourseType).map((c) => ({ value: c, label: c }))}
                      required
                    />
                    <FormSelect
                      label="Alternative Course"
                      name="alternativeCourse"
                      options={Object.values(CourseType).map((c) => ({ value: c, label: c }))}
                      placeholder="Select alternative (optional)"
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Course Specialization (if any)"
                        name="courseSpecialization"
                        placeholder="e.g., Computer Science, Electronics"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                    Preferred Colleges (Select up to 5)
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
                              if (values.preferredColleges.length < 5) {
                                setFieldValue('preferredColleges', [
                                  ...values.preferredColleges,
                                  college,
                                ]);
                              } else {
                                toast.error('You can select up to 5 colleges only');
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
                      options={Object.values(Community).map((c) => ({ value: c, label: c }))}
                      required
                    />
                    <FormSelect
                      label="Scholarship Type"
                      name="scholarshipType"
                      options={Object.values(ScholarshipType).map((s) => ({ value: s, label: s }))}
                      required
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Scholarship Details (if applicable)"
                        name="scholarshipDetails"
                        placeholder="Enter scholarship name or details"
                      />
                    </div>
                    <FormInput
                      label="Annual Family Income (₹)"
                      name="annualFamilyIncome"
                      type="number"
                      placeholder="Enter annual income"
                      required
                    />
                    <div className="md:col-span-2">
                      <FormCheckbox
                        label="I am a first graduate in my family"
                        name="firstGraduate"
                        description="Check this if you are the first person in your family to pursue higher education"
                      />
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
      </div>
    </div>
  );
}
