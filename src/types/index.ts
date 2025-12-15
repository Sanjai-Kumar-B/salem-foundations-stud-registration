import { Timestamp } from 'firebase/firestore';

// User Roles
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COUNSELLOR = 'COUNSELLOR',
  REVIEWER = 'REVIEWER',
}

// Entrance Exams
export enum EntranceExam {
  JEE_MAIN_ADVANCED = 'JEE_MAIN_ADVANCED',
  VITEEE = 'VITEEE',
  SRMJEEE = 'SRMJEEE',
  BITSAT = 'BITSAT',
  AMRITA_AEEE = 'AMRITA_AEEE',
  KIITEE = 'KIITEE',
  MANIPAL_MET = 'MANIPAL_MET',
  NEET_UG = 'NEET_UG',
  AIIMS_NURSING = 'AIIMS_NURSING',
  JIPMER_AHS = 'JIPMER_AHS',
  CLAT = 'CLAT',
  AILET = 'AILET',
  LSAT_INDIA = 'LSAT_INDIA',
  NATA = 'NATA',
  JEE_PAPER_2 = 'JEE_PAPER_2',
  CUET_UG = 'CUET_UG',
  IPMAT = 'IPMAT',
  SET_SYMBIOSIS = 'SET_SYMBIOSIS',
  CHRIST_ENTRANCE = 'CHRIST_ENTRANCE',
  XAVIERS_ENTRANCE = 'XAVIERS_ENTRANCE',
  NID_DAT = 'NID_DAT',
  NIFT = 'NIFT',
  UCEED_CEED = 'UCEED_CEED',
  NCHM_JEE = 'NCHM_JEE',
  IMU_CET = 'IMU_CET',
  TMI_ENTRANCE = 'TMI_ENTRANCE',
  AMET_ENTRANCE = 'AMET_ENTRANCE',
  ICAR_AIEEA = 'ICAR_AIEEA',
  TANUVAS_ENTRANCE = 'TANUVAS_ENTRANCE',
  NDA = 'NDA',
  AIR_FORCE_AGNIVEER = 'AIR_FORCE_AGNIVEER',
  NAVY_SSR_AA = 'NAVY_SSR_AA',
  COAST_GUARD = 'COAST_GUARD',
}

// Application Status
export enum ApplicationStatus {
  NEW = 'NEW',
  SHORTLISTED = 'SHORTLISTED',
  FOLLOW_UP = 'FOLLOW_UP',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

// Courses
export enum CourseType {
  ENGINEERING_TECHNOLOGY = 'ENGINEERING_TECHNOLOGY',
  MEDICAL_HEALTH = 'MEDICAL_HEALTH',
  ARTS_SCIENCE = 'ARTS_SCIENCE',
  LAW_CIVIL = 'LAW_CIVIL',
  AGRICULTURE = 'AGRICULTURE',
  ARCHITECTURE = 'ARCHITECTURE',
  MARINE = 'MARINE',
  AVIATION = 'AVIATION',
  HOTEL_MANAGEMENT = 'HOTEL_MANAGEMENT',
  VETERINARY = 'VETERINARY',
  FISHERIES = 'FISHERIES',
  OTHERS = 'OTHERS',
}

// Specialized Course Categories
export const SPECIALIZED_COURSES: Record<CourseType, string[]> = {
  [CourseType.ENGINEERING_TECHNOLOGY]: [
    'Computer Science Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics & Communication Engineering (ECE)',
    'Electrical Engineering (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence & Machine Learning',
    'Data Science',
    'Robotics & Automation',
    'Aerospace Engineering',
    'Biotechnology Engineering',
    'Chemical Engineering',
    'Marine Engineering',
    'Automobile Engineering',
    'Cybersecurity',
    'Software Engineering',
    'AI & Data Science',
    'Biomedical Engineering',
    'Computer Science & Business Systems (CSBS)',
    'Aeronautical Engineering',
    'Pharmaceuticals',
    'Fashion Technology',
    'Agriculture Engineering',
    'Petroleum Engineering',
  ],
  [CourseType.MEDICAL_HEALTH]: [
    'MBBS',
    'BDS (Dentistry)',
    'BAMS (Ayurveda)',
    'BHMS (Homeopathy)',
    'BPT (Physiotherapy)',
    'B.Sc Nursing',
    'B.Pharm',
    'Pharm D',
    'Allied Health Sciences (AHS)',
    'Radiology',
    'Medical Lab Technology (MLT)',
    'Operation Theatre Technology (OTT)',
    'Anaesthesia Technology',
    'Cardiac Care Technology',
    'Dialysis Technology',
    'BNMS (Bachelor of Naturopathy & Yogic Sciences)',
    'BSMS (Bachelor of Siddha Medicine & Surgery)',
    'Bachelor of Occupational Therapy',
    'GNM (General Nursing & Midwifery)',
    'ANM (Auxiliary Nurse Midwife)',
    'Health Inspector',
    'PBSC (Nursing)',
    'Critical Care Technology',
    'Accident & Emergency Care',
    'Nuclear Medicine Technology',
    'Neuro Science Technology',
  ],
  [CourseType.ARTS_SCIENCE]: [
    'B.Sc Physics',
    'B.Sc Chemistry',
    'B.Sc Mathematics',
    'B.Sc Computer Science',
    'B.Sc IT',
    'B.Sc Biotechnology',
    'B.Sc Agriculture',
    'B.Sc Psychology',
    'B.Sc Forensic Science',
    'B.Sc Microbiology',
    'B.Sc Data Science',
    'B.Sc AI',
    'B.Com (Bachelor of Commerce)',
    'B.Com (Professional/Accounting/Finance)',
    'BBA (Bachelor of Business Administration)',
    'BMS (Bachelor of Management Studies)',
    'BAF, BBI, BFM, BBA Analytics',
  ],
  [CourseType.LAW_CIVIL]: [
    'B.A.LLB',
    'BBA LLB',
    'Civil Services Coaching',
  ],
  [CourseType.AGRICULTURE]: [
    'B.Sc Agriculture',
    'B.Sc Horticulture',
    'B.Sc Forestry',
    'Agricultural Engineering',
  ],
  [CourseType.ARCHITECTURE]: [
    'B.Arch',
    'B.Plan (Planning)',
    'Interior Design',
    'Landscape Architecture',
  ],
  [CourseType.MARINE]: [
    'Marine Engineering',
    'Nautical Science',
    'B.Sc Maritime Science',
    'Shipping Management',
  ],
  [CourseType.AVIATION]: [
    'Commercial Pilot License (CPL)',
    'B.Sc Aviation',
    'Aircraft Maintenance Engineering',
    'Air Traffic Control',
    'Cabin Crew Training',
  ],
  [CourseType.HOTEL_MANAGEMENT]: [
    'B.Sc Hotel Management',
    'Culinary Arts',
    'Hospitality Management',
    'Tourism Management',
  ],
  [CourseType.VETERINARY]: [
    'B.V.Sc & AH (Veterinary Science)',
    'B.Sc Veterinary Microbiology',
    'Veterinary Nursing',
  ],
  [CourseType.FISHERIES]: [
    'B.F.Sc (Fisheries Science)',
    'Aquaculture',
    'Marine Biology',
  ],
  [CourseType.OTHERS]: [],
};

// Additional Free Courses
export const FREE_COURSES = [
  'Spoken English',
  'Coding',
  'Abroad Courses',
  'Soft Skills',
];

// 12th Groups (renamed from +2 Groups)
export enum TwelfthGroup {
  MATHS_BIOLOGY = 'MATHS_BIOLOGY',
  MATHS_COMPUTER_SCIENCE = 'MATHS_COMPUTER_SCIENCE',
  COMPUTER_SCIENCE_BIOLOGY = 'COMPUTER_SCIENCE_BIOLOGY',
  COMMERCE_ACCOUNTANCY = 'COMMERCE_ACCOUNTANCY',
  COMMERCE_COMPUTER_APPLICATIONS = 'COMMERCE_COMPUTER_APPLICATIONS',
  COMMERCE_MATHS = 'COMMERCE_MATHS',
  ARTS_HISTORY = 'ARTS_HISTORY',
  ARTS_ECONOMICS = 'ARTS_ECONOMICS',
  VOCATIONAL = 'VOCATIONAL',
  PURE_SCIENCE = 'PURE_SCIENCE',
  AGRICULTURE = 'AGRICULTURE',
  HOME_SCIENCE = 'HOME_SCIENCE',
  NURSING = 'NURSING',
}

// Community
export enum Community {
  OC = 'OC',
  BC = 'BC',
  BC_CC = 'BC_CC',
  BCM = 'BCM',
  MBC = 'MBC',
  SC = 'SC',
  SC_A = 'SC_A',
  ST = 'ST',
}

// Scholarship Type
export enum ScholarshipType {
  SEVEN_FIVE_PERCENT_GOVERNMENT = '75%_GOVERNMENT',
  POST_MATRIC_GOVERNMENT = 'POST_MATRIC_GOVERNMENT',
  TNMM_GOVERNMENT = 'TNMM_GOVERNMENT',
  CENTRAL_SECTOR_GOVERNMENT = 'CENTRAL_SECTOR_GOVERNMENT',
  NSP_GOVERNMENT = 'NSP_GOVERNMENT',
  STATE_SCHOLARSHIP = 'STATE_SCHOLARSHIP',
  MOOVALUR_SCHOLARSHIP = 'MOOVALUR_SCHOLARSHIP',
  MERIT_SCHOLARSHIP = 'MERIT_SCHOLARSHIP',
  SPORTS_SCHOLARSHIP = 'SPORTS_SCHOLARSHIP',
  MINORITY_SCHOLARSHIP = 'MINORITY_SCHOLARSHIP',
  EWS_SCHOLARSHIP = 'EWS_SCHOLARSHIP',
  WELFARE_SCHOLARSHIP = 'WELFARE_SCHOLARSHIP',
  SALEM_FOUNDATIONS_SCHOLARSHIP = 'SALEM_FOUNDATIONS_SCHOLARSHIP',
  TAMIL_PUTHALVAN = 'TAMIL_PUTHALVAN',
  PUDUMAIPEN = 'PUDUMAIPEN',
  PRIVATE_TRUST = 'PRIVATE_TRUST',
  COLLEGE_SCHOLARSHIP = 'COLLEGE_SCHOLARSHIP',
  NONE = 'NONE',
}

// Referral Source
export enum ReferralSource {
  FRIENDS_FAMILY = 'FRIENDS_FAMILY',
  SCHOOL_COLLEGE = 'SCHOOL_COLLEGE',
  COUNSELOR = 'COUNSELOR',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  NEWSPAPER_AD = 'NEWSPAPER_AD',
  WEBSITE = 'WEBSITE',
  WHATSAPP = 'WHATSAPP',
  OTHERS = 'OTHERS',
}

// Gender
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// Document Types
export interface DocumentFile {
  name: string;
  url: string;
  uploadedAt: Timestamp;
  size: number;
  type: string;
}

// Sibling Details
export interface SiblingDetails {
  name: string;
  education: string; // School, College, or Graduate
}

// Personal Details
export interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  email: string;
  mobile: string;
  whatsappNumber?: string;
  aadharNumber: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  fatherName: string;
  fatherOccupation: string;
  fatherMobile: string;
  motherName: string;
  motherOccupation: string;
  motherMobile: string;
  guardianName?: string;
  guardianMobile?: string;
  siblings?: SiblingDetails[];
}

// Academic Details
export interface AcademicDetails {
  tenthSchool: string;
  tenthBoard: string;
  tenthYearOfPassing: string;
  tenthPercentage: number;
  tenthMarks: number;
  tenthTotalMarks: number;
  
  twelfthSchool: string;
  twelfthBoard: string;
  twelfthYearOfPassing: string;
  twelfthPercentage: number;
  twelfthMarks: number;
  twelfthTotalMarks: number;
  twelfthGroup: TwelfthGroup;
  
  // Competitive Exam Details (if applicable)
  neetScore?: number;
  neetRank?: number;
  neetYear?: string;
  jeeScore?: number;
  jeeRank?: number;
  jeeYear?: string;
  
  // Entrance Exam Preparation
  preparingForExam?: string;
  
  // Government School/Tamil Medium Questions
  studiedInGovtSchool: boolean;
  studiedInGovtAidedTamilMedium: boolean;
}

// Course Preferences
export interface CoursePreference {
  preferredCourse: CourseType;
  courseSpecialization?: string;
  preferredDistricts?: string[]; // For Engineering courses - districts where student wants to study
  preferredColleges: string[];
  additionalFreeCourses?: string[];
}

// Community & Scholarship Details
export interface CommunityScholarshipDetails {
  community: Community;
  scholarshipType: ScholarshipType[];
  scholarshipDetails?: string;
  annualFamilyIncome: number;
  firstGraduate: boolean;
  needsEducationalLoan: boolean;
}

// Referral Details
export interface ReferralDetails {
  source: ReferralSource;
  referrerName?: string;
  referrerMobile?: string;
  referrerDetails?: string;
  followedSocialMedia: {
    instagram: boolean;
    facebook: boolean;
    youtube: boolean;
  };
}

// Documents
export interface Documents {
  photo?: DocumentFile;
  aadharCard?: DocumentFile;
  tenthMarksheet?: DocumentFile;
  twelfthMarksheet?: DocumentFile;
  transferCertificate?: DocumentFile;
  communityCertificate?: DocumentFile;
  incomeCertificate?: DocumentFile;
  neetScorecard?: DocumentFile;
  jeeScorecard?: DocumentFile;
}

// Complete Student Application
export interface StudentApplication {
  id: string;
  applicationNumber: string;
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  coursePreference: CoursePreference;
  communityScholarship: CommunityScholarshipDetails;
  referralDetails: ReferralDetails;
  documents?: Documents;
  status: ApplicationStatus;
  tags: string[];
  assignedTo?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt: Timestamp;
}

// Admin User
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Timestamp;
  lastLogin?: Timestamp;
  isActive: boolean;
}

// Filter Options for Admin Dashboard
export interface FilterOptions {
  courses?: CourseType[];
  twelfthGroups?: TwelfthGroup[];
  districts?: string[];
  communities?: Community[];
  scholarshipTypes?: ScholarshipType[];
  minMarks?: number;
  maxMarks?: number;
  status?: ApplicationStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

// Statistics for Dashboard
export interface DashboardStats {
  totalApplications: number;
  newApplications: number;
  shortlisted: number;
  completed: number;
  courseWiseCount: Record<CourseType, number>;
  districtWiseCount: Record<string, number>;
  communityWiseCount: Record<Community, number>;
  scholarshipEligible: number;
  highScorers: number;
}
