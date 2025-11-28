import * as Yup from 'yup';
import { Gender, TwelfthGroup, CourseType, Community, ScholarshipType, ReferralSource } from '@/types';

// Personal Details Validation
export const personalDetailsSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: Yup.string()
    .required('Last name is required')
    .min(1, 'Last name must be at least 1 character')
    .max(50, 'Last name must not exceed 50 characters'),
  
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Must be at least 16 years old', function(value) {
      if (!value) return false;
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 16);
      return value <= cutoff;
    }),
  
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(Object.values(Gender), 'Invalid gender'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  
  whatsappNumber: Yup.string()
    .required('WhatsApp number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid WhatsApp number'),
  
  aadharNumber: Yup.string()
    .required('Aadhar number is required')
    .matches(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  
  address: Yup.object().shape({
    line1: Yup.string().required('Address line 1 is required'),
    line2: Yup.string().nullable(),
    city: Yup.string().required('City is required'),
    district: Yup.string().required('District is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
  }),
  
  fatherName: Yup.string().required('Father\'s name is required'),
  fatherMobile: Yup.string()
    .required('Father\'s mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  motherName: Yup.string().required('Mother\'s name is required'),
  motherMobile: Yup.string()
    .required('Mother\'s mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  guardianName: Yup.string().nullable(),
  guardianMobile: Yup.string()
    .test('valid-guardian-mobile', 'Invalid guardian mobile number', function(value) {
      if (!value || value === '') return true;
      return /^[6-9]\d{9}$/.test(value);
    })
    .nullable(),
});

// Academic Details Validation
export const academicDetailsSchema = Yup.object().shape({
  tenthSchool: Yup.string().required('10th school name is required'),
  tenthBoard: Yup.string().required('10th board is required'),
  tenthYearOfPassing: Yup.string()
    .required('Year of passing is required')
    .matches(/^\d{4}$/, 'Invalid year'),
  tenthPercentage: Yup.number()
    .required('10th percentage is required')
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100'),
  tenthMarks: Yup.number()
    .required('10th marks obtained is required')
    .min(0, 'Marks must be positive'),
  tenthTotalMarks: Yup.number()
    .required('10th total marks is required')
    .min(0, 'Total marks must be positive'),
  
  twelfthSchool: Yup.string().required('12th school name is required'),
  twelfthBoard: Yup.string().required('12th board is required'),
  twelfthYearOfPassing: Yup.string()
    .required('Year of passing is required')
    .matches(/^\d{4}$/, 'Invalid year'),
  twelfthPercentage: Yup.number()
    .required('12th percentage is required')
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100'),
  twelfthMarks: Yup.number()
    .required('12th marks obtained is required')
    .min(0, 'Marks must be positive'),
  twelfthTotalMarks: Yup.number()
    .required('12th total marks is required')
    .min(0, 'Total marks must be positive'),
  twelfthGroup: Yup.string()
    .required('12th group is required')
    .oneOf(Object.values(TwelfthGroup), 'Invalid 12th group'),
  
  neetScore: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .min(0, 'NEET score must be positive')
    .max(720, 'NEET score cannot exceed 720')
    .nullable(),
  neetRank: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .min(1, 'NEET rank must be positive')
    .nullable(),
  neetYear: Yup.string()
    .test('valid-year', 'Invalid year', function(value) {
      if (!value || value === '') return true;
      return /^\d{4}$/.test(value);
    })
    .nullable(),
  
  jeeScore: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .min(0, 'JEE score must be positive')
    .max(300, 'JEE score cannot exceed 300')
    .nullable(),
  jeeRank: Yup.number()
    .transform((value, originalValue) => originalValue === '' ? undefined : value)
    .min(1, 'JEE rank must be positive')
    .nullable(),
  jeeYear: Yup.string()
    .test('valid-year', 'Invalid year', function(value) {
      if (!value || value === '') return true;
      return /^\d{4}$/.test(value);
    })
    .nullable(),
  
  preparingForExam: Yup.string().nullable(),
  studiedInTamilMedium: Yup.boolean().required('Please select if you studied in Tamil medium'),
});

// Course Preference Validation
export const coursePreferenceSchema = Yup.object().shape({
  preferredCourse: Yup.string()
    .required('Preferred course is required')
    .oneOf(Object.values(CourseType), 'Invalid course type'),
  
  preferredDistricts: Yup.array()
    .of(Yup.string())
    .when('preferredCourse', {
      is: (val: string) => val === CourseType.ENGINEERING_TECHNOLOGY,
      then: (schema) => schema.min(1, 'Please select at least one preferred district'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  preferredColleges: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one preferred college')
    .max(3, 'You can select up to 3 preferred colleges'),
  
  courseSpecialization: Yup.string().nullable(),
});

// Community & Scholarship Validation
export const communityScholarshipSchema = Yup.object().shape({
  community: Yup.string()
    .required('Community is required')
    .oneOf(Object.values(Community), 'Invalid community'),
  
  scholarshipType: Yup.array()
    .of(Yup.string().oneOf(Object.values(ScholarshipType), 'Invalid scholarship type'))
    .min(1, 'Please select at least one scholarship type')
    .required('Scholarship type is required'),
  
  scholarshipDetails: Yup.string().nullable(),
  
  annualFamilyIncome: Yup.number()
    .required('Annual family income is required')
    .min(0, 'Income must be positive'),
  
  firstGraduate: Yup.boolean().required(),
  
  needsEducationalLoan: Yup.boolean().required('Please select if you need an educational loan'),
});

// Referral Details Validation
export const referralDetailsSchema = Yup.object().shape({
  source: Yup.string()
    .required('Please tell us how you heard about Salem Foundations')
    .oneOf(Object.values(ReferralSource), 'Invalid referral source'),
  
  referrerName: Yup.string()
    .when('source', {
      is: (val: string) => val === ReferralSource.FRIENDS_FAMILY || val === ReferralSource.SCHOOL_COLLEGE || val === ReferralSource.OTHERS,
      then: (schema) => schema.required('Referrer name is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  
  referrerMobile: Yup.string()
    .test('valid-mobile', 'Invalid mobile number', function(value) {
      if (!value || value === '') return true;
      return /^[6-9]\d{9}$/.test(value);
    })
    .nullable(),
  
  referrerDetails: Yup.string().nullable(),
  
  followedSocialMedia: Yup.object().shape({
    instagram: Yup.boolean(),
    facebook: Yup.boolean(),
    youtube: Yup.boolean(),
  }),
});
