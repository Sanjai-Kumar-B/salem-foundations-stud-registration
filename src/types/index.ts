import { Timestamp } from 'firebase/firestore';

// User Roles
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COUNSELLOR = 'COUNSELLOR',
  REVIEWER = 'REVIEWER',
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
  MEDICAL = 'MEDICAL',
  ENGINEERING = 'ENGINEERING',
  ARTS = 'ARTS',
  NURSING = 'NURSING',
  PARAMEDICAL = 'PARAMEDICAL',
  SOFTWARE = 'SOFTWARE',
}

// +2 Groups
export enum PlusTwoGroup {
  BIOLOGY = 'BIOLOGY',
  MATHS = 'MATHS',
  COMMERCE = 'COMMERCE',
  ARTS = 'ARTS',
}

// Community
export enum Community {
  OC = 'OC',
  BC = 'BC',
  MBC = 'MBC',
  SC = 'SC',
  ST = 'ST',
}

// Scholarship Type
export enum ScholarshipType {
  GOVERNMENT = 'GOVERNMENT',
  TRUST = 'TRUST',
  MERIT = 'MERIT',
  NONE = 'NONE',
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
  motherName: string;
  guardianName?: string;
  guardianMobile?: string;
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
  plusTwoGroup: PlusTwoGroup;
  
  // Competitive Exam Details (if applicable)
  neetScore?: number;
  neetRank?: number;
  neetYear?: string;
  jeeScore?: number;
  jeeRank?: number;
  jeeYear?: string;
}

// Course Preferences
export interface CoursePreference {
  preferredCourse: CourseType;
  alternativeCourse?: CourseType;
  preferredColleges: string[];
  courseSpecialization?: string;
}

// Community & Scholarship Details
export interface CommunityScholarshipDetails {
  community: Community;
  scholarshipType: ScholarshipType;
  scholarshipDetails?: string;
  annualFamilyIncome: number;
  firstGraduate: boolean;
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
  plusTwoGroups?: PlusTwoGroup[];
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
