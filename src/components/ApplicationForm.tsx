'use client';

import React from 'react';
import { 
  TwelfthGroup,
  CourseType,
  Community,
  ScholarshipType,
  EntranceExam,
  ReferralSource,
  SPECIALIZED_COURSES,
  FREE_COURSES,
} from '@/types';
import { FormInput, FormSelect, FormCheckbox, NestedFormInput, NestedFormSelect, FormStep } from '@/components/FormComponents';
import { TN_DISTRICTS, ENGINEERING_COLLEGES_BY_DISTRICT } from '@/data/collegesByDistrict';
import { SCHOOLS_BY_DISTRICT, TN_DISTRICTS_FOR_SCHOOLS } from '@/data/schoolsByDistrict';
import { MBBS_COLLEGES_BY_DISTRICT, TN_DISTRICTS_FOR_COLLEGES } from '@/data/collegesByDistrict';
import { Plus, Trash2 } from 'lucide-react';

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

interface ApplicationFormProps {
  currentStep: number;
  values: any;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
}

export function ApplicationFormSteps({ currentStep, values, errors, touched, setFieldValue }: ApplicationFormProps) {
  return (
    <>
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
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
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
            placeholder="Street address"
            required
          />
          <NestedFormInput
            label="Address Line 2"
            name="address.line2"
            placeholder="Apartment, suite, etc. (optional)"
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
        
        <h4 className="text-md font-medium text-gray-800 mb-3">Father&apos;s Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormInput
            label="Father's Name"
            name="fatherName"
            placeholder="Enter father's name"
            required
          />
          <FormInput
            label="Father's Occupation"
            name="fatherOccupation"
            placeholder="Enter father's occupation"
            required
          />
          <FormInput
            label="Father's Mobile Number"
            name="fatherMobile"
            placeholder="10-digit mobile number"
            required
          />
        </div>

        <h4 className="text-md font-medium text-gray-800 mb-3">Mother&apos;s Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormInput
            label="Mother's Name"
            name="motherName"
            placeholder="Enter mother's name"
            required
          />
          <FormInput
            label="Mother's Occupation"
            name="motherOccupation"
            placeholder="Enter mother's occupation"
            required
          />
          <FormInput
            label="Mother's Mobile Number"
            name="motherMobile"
            placeholder="10-digit mobile number"
            required
          />
        </div>

        <h4 className="text-md font-medium text-gray-800 mb-3">Guardian Details (if applicable)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Guardian's Name"
            name="guardianName"
            placeholder="Enter guardian's name"
          />
          <FormInput
            label="Guardian's Mobile"
            name="guardianMobile"
            placeholder="10-digit mobile number"
          />
        </div>

        {/* Siblings */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-800">Siblings (Optional)</h4>
            <button
              type="button"
              onClick={() => {
                const currentSiblings = values.siblings || [];
                setFieldValue('siblings', [...currentSiblings, { name: '', education: '' }]);
              }}
              className="btn btn-secondary btn-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Sibling
            </button>
          </div>
          
          {values.siblings && values.siblings.length > 0 && (
            <div className="space-y-3">
              {values.siblings.map((sibling: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg relative">
                  <FormInput
                    label="Sibling Name"
                    name={`siblings.${index}.name`}
                    placeholder="Enter sibling name"
                  />
                  <FormInput
                    label="Education/Occupation"
                    name={`siblings.${index}.education`}
                    placeholder="e.g., 10th Standard, BSc, Engineer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newSiblings = values.siblings.filter((_: any, i: number) => i !== index);
                      setFieldValue('siblings', newSiblings);
                    }}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormStep>

      {/* Step 2: Academic Details */}
      <FormStep currentStep={currentStep} stepNumber={2}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Academic Details
        </h2>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">10th Standard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="School District"
            name="tenthSchoolDistrict"
            options={TN_DISTRICTS_FOR_SCHOOLS.map((d) => ({ value: d, label: d }))}
            placeholder="Select district"
            required
          />
          
          {values.tenthSchoolDistrict && (
            <FormSelect
              label="School Name"
              name="tenthSchool"
              options={[
                ...(SCHOOLS_BY_DISTRICT[values.tenthSchoolDistrict] || []).map((school) => ({
                  value: school,
                  label: school,
                })),
                { value: 'Other', label: 'Other (Please specify)' },
              ]}
              placeholder="Select school"
              required
            />
          )}
          
          {values.tenthSchool === 'Other' && (
            <FormInput
              label="Please specify school name"
              name="tenthSchoolOther"
              placeholder="Enter your school name"
              required
            />
          )}
          
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marks Obtained <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tenthMarks"
              value={values.tenthMarks}
              onChange={(e) => {
                const marks = Number(e.target.value);
                setFieldValue('tenthMarks', marks);
                if (marks && values.tenthTotalMarks) {
                  const percentage = ((marks / values.tenthTotalMarks) * 100).toFixed(2);
                  setFieldValue('tenthPercentage', Number(percentage));
                }
              }}
              placeholder="Marks obtained"
              className="input"
              max={values.tenthTotalMarks || 500}
            />
            {touched.tenthMarks && errors.tenthMarks && (
              <p className="text-red-500 text-xs mt-1">{String(errors.tenthMarks)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <select
              name="tenthTotalMarks"
              value={values.tenthTotalMarks}
              onChange={(e) => {
                const total = Number(e.target.value);
                setFieldValue('tenthTotalMarks', total);
                if (values.tenthMarks && total) {
                  const percentage = ((values.tenthMarks / total) * 100).toFixed(2);
                  setFieldValue('tenthPercentage', Number(percentage));
                }
              }}
              className="input"
            >
              <option value="">Select total marks</option>
              <option value="500">500</option>
              <option value="600">600</option>
            </select>
            {touched.tenthTotalMarks && errors.tenthTotalMarks && (
              <p className="text-red-500 text-xs mt-1">{String(errors.tenthTotalMarks)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentage <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tenthPercentage"
              value={values.tenthPercentage}
              placeholder="Auto-calculated"
              className="input bg-gray-50"
              readOnly
            />
            {touched.tenthPercentage && errors.tenthPercentage && (
              <p className="text-red-500 text-xs mt-1">{String(errors.tenthPercentage)}</p>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">12th Standard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="School District"
            name="twelfthSchoolDistrict"
            options={TN_DISTRICTS_FOR_SCHOOLS.map((d) => ({ value: d, label: d }))}
            placeholder="Select district"
            required
          />
          
          {values.twelfthSchoolDistrict && (
            <FormSelect
              label="School Name"
              name="twelfthSchool"
              options={[
                ...(SCHOOLS_BY_DISTRICT[values.twelfthSchoolDistrict] || []).map((school) => ({
                  value: school,
                  label: school,
                })),
                { value: 'Other', label: 'Other (Please specify)' },
              ]}
              placeholder="Select school"
              required
            />
          )}
          
          {values.twelfthSchool === 'Other' && (
            <FormInput
              label="Please specify school name"
              name="twelfthSchoolOther"
              placeholder="Enter your school name"
              required
            />
          )}
          
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marks Obtained <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="twelfthMarks"
              value={values.twelfthMarks}
              onChange={(e) => {
                const marks = Number(e.target.value);
                setFieldValue('twelfthMarks', marks);
                if (marks && values.twelfthTotalMarks) {
                  const percentage = ((marks / values.twelfthTotalMarks) * 100).toFixed(2);
                  setFieldValue('twelfthPercentage', Number(percentage));
                }
              }}
              placeholder="Marks obtained"
              className="input"
              max={values.twelfthTotalMarks || 600}
            />
            {touched.twelfthMarks && errors.twelfthMarks && (
              <p className="text-red-500 text-xs mt-1">{String(errors.twelfthMarks)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <select
              name="twelfthTotalMarks"
              value={values.twelfthTotalMarks || 600}
              onChange={(e) => {
                const total = Number(e.target.value);
                setFieldValue('twelfthTotalMarks', total);
                if (values.twelfthMarks && total) {
                  const percentage = ((values.twelfthMarks / total) * 100).toFixed(2);
                  setFieldValue('twelfthPercentage', Number(percentage));
                }
              }}
              className="input"
            >
              <option value="">Select total marks</option>
              <option value="500">500</option>
              <option value="600">600</option>
            </select>
            {touched.twelfthTotalMarks && errors.twelfthTotalMarks && (
              <p className="text-red-500 text-xs mt-1">{String(errors.twelfthTotalMarks)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentage <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="twelfthPercentage"
              value={values.twelfthPercentage}
              placeholder="Auto-calculated"
              className="input bg-gray-50"
              readOnly
            />
            {touched.twelfthPercentage && errors.twelfthPercentage && (
              <p className="text-red-500 text-xs mt-1">{String(errors.twelfthPercentage)}</p>
            )}
          </div>
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

        <div className="mt-6">
          <FormSelect
            label="Which Entrance Exam are you preparing for?"
            name="preparingForExam"
            options={ENTRANCE_EXAMS}
            placeholder="Select entrance exam (optional)"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            From 6th to 12th have you studied in Government School? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="studiedInGovtSchool"
                value="true"
                checked={values.studiedInGovtSchool === true}
                onChange={() => setFieldValue('studiedInGovtSchool', true)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="studiedInGovtSchool"
                value="false"
                checked={values.studiedInGovtSchool === false}
                onChange={() => setFieldValue('studiedInGovtSchool', false)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            From 6th to 12th have you studied in Government/Aided Tamil Medium School? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="studiedInGovtAidedTamilMedium"
                value="true"
                checked={values.studiedInGovtAidedTamilMedium === true}
                onChange={() => setFieldValue('studiedInGovtAidedTamilMedium', true)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="studiedInGovtAidedTamilMedium"
                value="false"
                checked={values.studiedInGovtAidedTamilMedium === false}
                onChange={() => setFieldValue('studiedInGovtAidedTamilMedium', false)}
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
          
          {/* For MBBS - Show District Dropdown */}
          {values.preferredCourse === CourseType.MBBS && (
            <>
              <FormSelect
                label="College District"
                name="collegeDistrict"
                options={TN_DISTRICTS_FOR_COLLEGES.map((d: string) => ({ value: d, label: d }))}
                placeholder="Select district"
              />
              
              {values.collegeDistrict && (
                <>
                  <FormSelect
                    label="College Name"
                    name="collegeName"
                    options={[
                      ...(MBBS_COLLEGES_BY_DISTRICT[values.collegeDistrict] || []).map((c: string) => ({ value: c, label: c })),
                      { value: 'Other', label: 'Other (Not in list)' }
                    ]}
                    placeholder="Select college"
                  />
                  
                  {values.collegeName === 'Other' && (
                    <FormInput
                      label="Specify College Name"
                      name="collegeNameOther"
                      placeholder="Enter college name"
                    />
                  )}
                </>
              )}
            </>
          )}
          
          {/* For other courses - Show Course Specialization */}
          {values.preferredCourse && values.preferredCourse !== CourseType.OTHERS && values.preferredCourse !== CourseType.MBBS && (
            <FormSelect
              label="Course Specialization"
              name="courseSpecialization"
              options={SPECIALIZED_COURSES[values.preferredCourse as CourseType].map((s: string) => ({ value: s, label: s }))}
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

        {values.preferredCourse === CourseType.ENGINEERING_TECHNOLOGY && values.courseSpecialization && (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
              Preferred Location (Districts)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Select the districts where you would like to study
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
              {TN_DISTRICTS.map((district) => (
                <div key={district} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`district-${district}`}
                    checked={values.preferredDistricts.includes(district)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFieldValue('preferredDistricts', [
                          ...values.preferredDistricts,
                          district,
                        ]);
                      } else {
                        setFieldValue(
                          'preferredDistricts',
                          values.preferredDistricts.filter((d: string) => d !== district)
                        );
                        const collegesToRemove = ENGINEERING_COLLEGES_BY_DISTRICT[district] || [];
                        setFieldValue(
                          'preferredColleges',
                          values.preferredColleges.filter((c: string) => !collegesToRemove.includes(c))
                        );
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor={`district-${district}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    {district}
                  </label>
                </div>
              ))}
            </div>
            {touched.preferredDistricts && errors.preferredDistricts && (
              <p className="error-text mt-2">{errors.preferredDistricts as string}</p>
            )}

            {values.preferredDistricts.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                  Preferred Colleges (Select up to 3)
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select up to 3 colleges from your preferred districts
                </p>
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                  {values.preferredDistricts.map((district: string) => (
                    <div key={district} className="border-b border-gray-300 pb-3 last:border-b-0">
                      <h4 className="font-semibold text-gray-800 mb-2">{district}</h4>
                      <div className="space-y-2 pl-4">
                        {(ENGINEERING_COLLEGES_BY_DISTRICT[district] || []).map((college: string) => (
                          <div key={college} className="flex items-start">
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
                                  }
                                } else {
                                  setFieldValue(
                                    'preferredColleges',
                                    values.preferredColleges.filter((c: string) => c !== college)
                                  );
                                }
                              }}
                              className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label
                              htmlFor={`college-${college}`}
                              className="ml-2 text-sm text-gray-700 cursor-pointer"
                            >
                              {college}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {touched.preferredColleges && errors.preferredColleges && (
                  <p className="error-text mt-2">{errors.preferredColleges as string}</p>
                )}
              </>
            )}
          </>
        )}

        {values.preferredCourse && values.preferredCourse !== CourseType.ENGINEERING_TECHNOLOGY && (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
              Preferred College Type (Select up to 3)
            </h3>
            <div className="space-y-2">
              {['Government College', 'Private College', 'Deemed University', 'Central University'].map((college) => (
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
                        }
                      } else {
                        setFieldValue(
                          'preferredColleges',
                          values.preferredColleges.filter((c: string) => c !== college)
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
          </>
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
                      values.additionalFreeCourses.filter((c: string) => c !== course)
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
            options={Object.values(Community).map((c) => ({ 
              value: c, 
              label: c.replace('_', '(') + (c.includes('_') ? ')' : '') 
            }))}
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
            {SCHOLARSHIP_TYPES.filter((scholarship) => {
              if (scholarship.value === ScholarshipType.SEVEN_FIVE_PERCENT_GOVERNMENT) {
                return values.studiedInGovtSchool === true;
              }
              if (scholarship.value === ScholarshipType.TAMIL_PUTHALVAN || 
                  scholarship.value === ScholarshipType.PUDUMAIPEN) {
                return values.studiedInGovtAidedTamilMedium === true;
              }
              return true;
            }).map((scholarship) => (
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
                        values.scholarshipType.filter((s: string) => s !== scholarship.value)
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

        {/* Declaration */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="declaration"
              checked={values.declaration}
              onChange={(e) => setFieldValue('declaration', e.target.checked)}
              className="w-5 h-5 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="declaration" className="ml-3 text-sm font-medium text-gray-900">
              ☐ I declare that the information submitted is true and correct to the best of my knowledge.
              <span className="text-red-600">*</span>
            </label>
          </div>
          {touched.declaration && errors.declaration && (
            <p className="error-text mt-2 ml-8">{errors.declaration as string}</p>
          )}
        </div>
      </FormStep>
    </>
  );
}
