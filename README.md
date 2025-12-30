# Salem Foundations - Student Application Automation System

<div align="center">

![Salem Foundations Logo](https://img.shields.io/badge/Salem-Foundations-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.12-orange?style=for-the-badge&logo=firebase)

**Digital Admission Automation & Student Management System**

[Features](#-key-features) •
[Installation](#-installation) •
[Configuration](#%EF%B8%8F-configuration) •
[Usage](#-usage) •
[Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#%EF%B8%8F-configuration)
- [Usage](#-usage)
- [Firebase Setup](#-firebase-setup)
- [Deployment](#-deployment)
- [Security](#-security)
- [Latest Updates](#-latest-updates)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Salem Foundations Student Application Automation System** is a comprehensive web-based platform designed to digitize and automate the entire student admission process. This system replaces traditional paper-based applications with an efficient, secure, and user-friendly digital solution.

### Purpose

- **For Students**: Submit applications online with ease, track application status, and receive instant confirmation with unique application number
- **For Administrators**: Manage applications efficiently with advanced filtering, multi-select scholarships, analytics, and export capabilities
- **For the Organization**: Reduce manual work, eliminate paperwork, enable data-driven decisions with real-time insights

---

## ✨ Key Features

### 🎓 Student Module

- **5-Step Application Form**
  - **Step 1 - Personal Details**: Complete family information with mandatory parent mobile numbers, state dropdown (6 states), 38 Tamil Nadu districts
  - **Step 2 - Academic Details**: 
    - 10th & 12th records with board dropdown (CBSE, Matric, State Board, ICSE)
    - 12th Group options: Maths-Biology, Maths-Computer Science, Computer Science-Biology
    - NEET/JEE scores (optional)
    - 33 Entrance exam preparation options (JEE, NEET, CLAT, NATA, etc.)
    - Tamil medium education tracking (6th-12th)
  - **Step 3 - Course Preferences**: 
    - 12 course categories with specialized options:
      - Engineering & Technology (8 specializations including B.E/B.Tech CS, Mechanical, EEE, AI & DS, Polytechnic, ITI)
      - Medical & Health Sciences (7 specializations including MBBS, BDS, B.Sc Nursing, Pharmacy, Paramedical)
      - Arts & Science (5 specializations including B.A/B.Sc/B.Com, BBA/BCA, Agriculture, B.Ed, Hotel Management)
      - Law & Civil Services (3 specializations)
      - Others (custom text input for unlisted courses)
    - **Engineering Students - Location Preferences**:
      - District selection: Choose from 36 Tamil Nadu districts
      - College selection: Browse 600+ engineering colleges organized by district
      - Select up to 3 preferred colleges from chosen districts
      - Smart filtering: Colleges automatically filtered by selected districts
    - **Non-Engineering Students**:
      - College type selection: Government, Private, Abroad (max 3 selections)
    - 4 additional free courses: Spoken English, Coding, Abroad Courses, Soft Skills
  - **Step 4 - Community & Scholarship**:
    - 7 community options (OC, BC, BCM, MBC, SC, SC(A), ST)
    - **14 Scholarship Types** (single or multiple selection):
      - 75% Government Scholarship
      - Post Matric Government Scholarship
      - TNMM Government Scholarship
      - Central Sector Government Scholarship
      - NSP Government Scholarship
      - State Scholarship
      - Moovalur Scholarship
      - Merit Scholarship
      - Sports Scholarship
      - Minority Scholarship
      - EWS Scholarship
      - Private Trust
      - College Scholarship
      - None
    - Educational loan requirement
    - Annual family income
    - First graduate status
  - **Step 5 - Referral Tracking**:
    - Source tracking: How did you hear about Salem Foundations?
      - Friends/Family (with referrer details)
      - School/College (with institution details)
      - Social Media
      - Newspaper Advertisement
      - Website
      - WhatsApp
      - Others (custom input)
    - Optional counselor referral with name and mobile number
    - Social media follow integration:
      - Instagram: [@salemfoundations](https://www.instagram.com/salemfoundations?igsh=cGlpNW95czNmYW93)
      - Facebook: [Salem Foundations](https://www.facebook.com/salemfoundations)
      - YouTube: [@salemfoundations-smedutrust](https://youtube.com/@salemfoundations-smedutrust?si=IN0hlh3vuw6ziumQ)
    - Interactive checkboxes to track social media engagement

- **Auto-Validation & Smart Features**
  - WhatsApp number mandatory with validation
  - Conditional course specialization dropdowns
  - Real-time percentage calculation
  - Unique application number generation (format: SF{YY}{MM}{UNIQUE6})
  - Progress indicator with step validation

### 🔐 Admin Module

- **Authentication & Authorization**
  - Firebase Authentication integration
  - Role-based access control (Super Admin, Counsellor, Reviewer)
  - Secure session management

- **Comprehensive Dashboard**
  - Real-time statistics and metrics
  - Application status overview
  - Recent applications list with application numbers
  - Course and community distribution charts
  - Scholarship eligibility tracking

- **Advanced Filtering & Search**
  - Filter by 12 course types
  - District-wise filtering (38 TN districts)
  - Community-based filtering (7 options)
  - Scholarship type filtering (14 types)
  - 12th Group filtering (9 options)
  - Mark range filtering (80+, 90+, etc.)
  - Status-based filtering
  - Real-time search across all fields

- **Application Management**
  - Detailed student profile view
  - Display of selected scholarships (up to 14 types)
  - Educational loan status
  - Tamil medium education status (6th-12th)
  - Entrance exam preparation details (33 exam types)
  - Custom course inputs for "Others" category
  - 12th Group display with detailed subject combinations
  - **Engineering Applications - Location Preferences**:
    - View preferred districts as visual badges
    - Display selected colleges from each district
    - Export district/college preferences in Excel and PDF reports
  - **Non-Engineering Applications**:
    - Display selected college types (Government/Private/Abroad)
  - Referral source tracking with referrer details
  - Social media engagement tracking
  - Document preview and download
  - Status updates with notes

- **Analytics & Reports**
  - Course-wise distribution (12 categories with specializations)
  - District-wise statistics (38 TN districts)
  - Community demographics (7 categories)
  - Scholarship analysis (14 types)
  - High scorer identification (90%+ tracking)
  - Entrance exam preparation trends (33 exam types)
  - Referral source analytics
  - Social media engagement metrics

- **Data Export**
  - Export to Excel (.xlsx) with all fields including scholarships and referrals
  - Export to CSV with complete application data
  - PDF generation with detailed application information
  - Engineering applications include district and college preferences
  - Filtered data export with custom selections
  - Application-wise PDF download

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2 (React 18.3)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **Form Management**: Formik 2.4 + Yup 1.4
- **Icons**: Lucide React 0.378
- **Notifications**: React Hot Toast 2.4

### Backend (Serverless)
- **Database**: Firebase Firestore (with updated security rules)
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Authentication
- **Hosting**: Vercel / Firebase Hosting

### Additional Libraries
- **Charts**: Recharts 2.12
- **PDF Generation**: jsPDF 2.5 + jsPDF-AutoTable 3.8
- **Excel Export**: XLSX 0.18
- **Date Formatting**: date-fns 3.6

---

## 📁 Project Structure

```
Registration_tool/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Landing page with hero section
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── globals.css               # Global styles and Tailwind directives
│   │   ├── apply/                    # Student application module
│   │   │   ├── page.tsx              # 5-step multi-step form with validation
│   │   │   └── success/page.tsx      # Success confirmation with application number
│   │   └── admin/                    # Admin module (protected routes)
│   │       ├── login/page.tsx        # Admin authentication
│   │       ├── dashboard/page.tsx    # Dashboard with real-time statistics
│   │       ├── applications/page.tsx # Applications list with filters
│   │       └── analytics/page.tsx    # Analytics with charts and reports
│   ├── components/                   # Reusable React components
│   │   ├── FormComponents.tsx        # Form input components (text, select, radio, checkbox)
│   │   ├── ApplicationForm.tsx       # Main application form component
│   │   ├── FileUpload.tsx            # File upload component with validation
│   │   └── AdminLayout.tsx           # Admin layout wrapper with navigation
│   ├── data/                         # Static data files
│   │   ├── collegesByDistrict.ts     # 600+ Engineering colleges organized by 36 TN districts
│   │   ├── engineeringCollegesByDistrict.ts  # Engineering-specific college data
│   │   ├── mbbsCollegesByDistrict.ts # Medical colleges data
│   │   └── schoolsByDistrict.ts      # School data by district
│   ├── lib/                          # Utility libraries and helpers
│   │   ├── firebase.ts               # Firebase SDK initialization and configuration
│   │   ├── firestore.ts              # Firestore CRUD operations and queries
│   │   ├── storage.ts                # Firebase Storage file operations
│   │   ├── validations.ts            # Yup validation schemas for all form steps
│   │   ├── export.ts                 # Export utilities (Excel/CSV/PDF generation)
│   │   └── utils.ts                  # Helper functions and utilities
│   ├── hooks/                        # Custom React hooks
│   │   └── useAuth.ts                # Authentication hook with Firebase Auth
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts                  # All interfaces, enums, and type definitions
│   └── assests/                      # Static assets (images, icons, etc.)
├── public/                           # Static public assets
├── College_list_csv/                 # CSV files with college data (600+ colleges)
├── School_list_csv/                  # CSV files with school data
├── scripts/                          # Data parsing and utility scripts
│   ├── parseColleges.js              # Parse college CSV files
│   ├── parseEngineeringColleges.js   # Parse engineering colleges
│   ├── parseSchools.js               # Parse school data
│   └── analyzeSchoolData.js          # Analyze school data structure
├── .env.example                      # Environment variables template with Firebase config
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript compiler configuration
├── tailwind.config.ts                # Tailwind CSS configuration with custom theme
├── next.config.mjs                   # Next.js configuration with image domains
├── firebase.json                     # Firebase hosting configuration
├── firestore.rules                   # Firestore security rules
├── FORM_UPDATES.md                   # Detailed changelog of form updates
├── SETUP_GUIDE.md                    # Step-by-step setup instructions
├── DEPLOYMENT.md                     # Deployment guide for Vercel/Firebase
└── README.md                         # This comprehensive documentation
```

---

## 🚀 Installation

### Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher (or yarn/pnpm)
- **Firebase Account**: Create at [firebase.google.com](https://firebase.google.com)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/salem-foundations-portal.git
cd salem-foundations-portal
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Application Settings
NEXT_PUBLIC_APP_NAME="Salem Foundations"
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

---

## ⚙️ Configuration

### Firebase Setup

#### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: `salem-foundations`
4. Follow the setup wizard

#### 2. Enable Authentication

1. Navigate to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable **Google** sign-in

#### 3. Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode**
4. Select your region

#### 4. Set Up Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Applications collection - Students can create, admins can read/update
    match /applications/{applicationId} {
      allow create: if request.auth == null; // Allow anonymous creation
      allow read, update: if request.auth != null && 
                            exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admins collection - Only admins can read
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'SUPER_ADMIN';
    }
  }
}
```

#### 5. Set Up Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /applications/{applicationNumber}/{allPaths=**} {
      allow create: if request.auth == null; // Allow anonymous upload during application
      allow read: if request.auth != null;   // Only authenticated users can read
    }
  }
}
```

#### 6. Create Admin Users

Navigate to Firestore and create a document in the `admins` collection:

```json
{
  "uid": "firebase_auth_uid_here",
  "email": "admin@salemfoundations.org",
  "displayName": "Admin Name",
  "role": "SUPER_ADMIN",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

Then create the corresponding user in **Authentication**.

---

## 💻 Usage

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Add Environment Variables**

In Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add all variables from `.env.local`

### Deploy to Firebase Hosting

1. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**

```bash
firebase login
```

3. **Initialize Firebase**

```bash
firebase init hosting
```

4. **Build and Deploy**

```bash
npm run build
firebase deploy
```

---

## 🔒 Security

### Best Practices Implemented

- ✅ Firebase Authentication for admin access
- ✅ Role-based access control (RBAC)
- ✅ Firestore security rules (updated for ratings and multi-field access)
- ✅ Storage security rules
- ✅ Input validation (client & server with Yup schemas)
- ✅ File type and size validation
- ✅ XSS protection
- ✅ CSRF protection (Next.js built-in)
- ✅ Unique application number generation (Firestore ID-based)

### Security Rules

- Students can create applications and submit ratings (no login required)
- Admins must authenticate to access dashboard
- Only authorized admins can view/modify applications
- File uploads are validated for type and size
- Sensitive data is protected in Firestore
- Public write access for ratings collection with timestamp tracking

---

## 📊 Data Model

### Student Application Schema

```typescript
{
  id: string,
  applicationNumber: string, // Format: SF{YY}{MM}{UNIQUE6}
  personalDetails: {
    firstName, lastName, dateOfBirth, gender,
    email, mobile, whatsappNumber (mandatory),
    aadharNumber, address (with district & state dropdown),
    fatherName, fatherMobile (mandatory),
    motherName, motherMobile (mandatory),
    guardianName, guardianMobile
  },
  academicDetails: {
    tenthSchool, tenthBoard (dropdown: CBSE, Matric, State Board, ICSE), 
    tenthMarks, tenthPercentage,
    twelfthSchool, twelfthBoard (dropdown: CBSE, Matric, State Board, ICSE), 
    twelfthMarks, twelfthPercentage,
    twelfthGroup (9 options: PCB, PCM, PCCS, Commerce combinations, Arts combinations, Vocational),
    neetScore, neetRank, neetYear,
    jeeScore, jeeRank, jeeYear,
    preparingForExam (33 entrance exam options),
    studiedInTamilMedium (boolean, grades 6-12)
  },
  coursePreference: {
    preferredCourse (12 categories),
    courseSpecialization (conditional dropdown or custom text input),
    preferredDistricts (array - for Engineering students only),
    preferredColleges (array, max 3 - Engineering students from district-based list),
    collegeTypes (array, max 3 - Non-Engineering: Government, Private, Abroad),
    additionalFreeCourses (array of 4 options: Spoken English, Coding, Abroad Courses, Soft Skills)
  },
  communityScholarship: {
    community (7 options: OC, BC, BCM, MBC, SC, SC(A), ST),
    scholarshipType (14 options - can select multiple or None):
      - 75% Government Scholarship
      - Post Matric Government Scholarship
      - TNMM Government Scholarship
      - Central Sector Government Scholarship
      - NSP Government Scholarship
      - State Scholarship
      - Moovalur Scholarship
      - Merit Scholarship
      - Sports Scholarship
      - Minority Scholarship
      - EWS Scholarship
      - Private Trust
      - College Scholarship
      - None,
    scholarshipDetails (optional text),
    annualFamilyIncome,
    firstGraduate (boolean),
    needsEducationalLoan (boolean)
  },
  referralDetails: {
    source (Friends/Family, School/College, Social Media, Newspaper, Website, WhatsApp, Others),
    referrerName (conditional - required for Friends/Family and School/College sources),
    referrerMobile (conditional - required for Friends/Family and School/College sources),
    otherSource (conditional - required if source is Others),
    followedSocialMedia: { 
      instagram (boolean), 
      facebook (boolean), 
      youtube (boolean) 
    }
  },
  status: "NEW" | "SHORTLISTED" | "FOLLOW_UP" | "COMPLETED" | "REJECTED",
  tags: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp,
  submittedAt: Timestamp
}
```

---

## 🆕 Latest Updates

### December 2025 - Comprehensive System Enhancement

#### Form Structure Improvements
- ✅ **5-Step Application Process**: Enhanced from 4 to 5 steps with referral tracking
- ✅ **WhatsApp Number Mandatory**: Required field with 10-digit validation
- ✅ **Complete Parent Contact**: Father and mother mobile numbers now mandatory
- ✅ **38 Tamil Nadu Districts**: Comprehensive district dropdown covering all TN districts
- ✅ **State Dropdown**: Changed from text input to dropdown (6 states)
- ✅ **Board Selection**: Dropdown with CBSE, Matric, State Board, ICSE options

#### Academic Enhancements
- ✅ **Enhanced 12th Group Options**: 9 detailed combinations including:
  - Science groups (PCB, PCM, PCCS)
  - Commerce groups (with Accountancy, CA, Maths)
  - Arts groups (with History, Economics)
  - Vocational courses
- ✅ **Conditional Course Specializations**: Dynamic dropdowns based on course selection
- ✅ **NEET/JEE Score Tracking**: Optional fields for entrance exam scores and ranks
- ✅ **33 Entrance Exam Options**: Comprehensive entrance exam preparation tracking

#### Course & College Selection
- ✅ **12 Course Categories**: Engineering, Medical, Arts & Science, Law, and more
- ✅ **Engineering Location Preferences**: 
  - District-wise college selection system
  - 600+ engineering colleges organized by 36 TN districts
  - Smart cascading selection (Districts → Colleges)
  - Maximum 3 college selections per student
- ✅ **Simplified College Types**: Government, Private, Abroad (max 3 selections for non-engineering)
- ✅ **4 Additional Free Courses**: Spoken English, Coding, Abroad Courses, Soft Skills

#### Community & Scholarship System
- ✅ **7 Community Options**: Including BCM and SC(A) for better demographic tracking
- ✅ **14 Scholarship Types**: Comprehensive government and private scholarship options:
  - 75% Government Scholarship
  - Post Matric, TNMM, Central Sector, NSP Scholarships
  - Merit, Sports, Minority, EWS Scholarships
  - Private Trust and College Scholarships
- ✅ **Multi-Select Support**: Students can select multiple applicable scholarships
- ✅ **Educational Loan Tracking**: Dedicated field for loan requirement
- ✅ **First Graduate Status**: Track first-generation college students

#### Referral & Social Media Integration (Step 5)
- ✅ **Referral Source Tracking**: How students heard about Salem Foundations
- ✅ **Counselor Referrals**: Optional referrer name and mobile number
- ✅ **Social Media Follow Integration**: 
  - Instagram, Facebook, YouTube checkboxes
  - Direct links to Salem Foundations social media pages
  - Beautiful gradient-styled platform cards
- ✅ **Source Options**: Friends/Family, School/College, Social Media, Newspaper, Website, WhatsApp, Others

#### Application Number System
- ✅ **Truly Unique Generation**: Uses Firestore document ID for guaranteed uniqueness
- ✅ **Format**: SF{YY}{MM}{UNIQUE6} (e.g., SF2512A3F2D9)
- ✅ **Sync Fix**: Student and admin now see the same application number

#### Admin Dashboard Updates
- ✅ **Enhanced Filters**: Support for all 12 course types and 7 communities
- ✅ **Multi-Field Scholarship Display**: Shows all selected scholarships
- ✅ **Engineering Preferences Display**:
  - Visual badge display for preferred districts
  - Organized college list by district
  - Export includes district and college preferences
- ✅ **Comprehensive Data Export**: Excel, CSV, and PDF with all new fields
- ✅ **12th Group Updated**: Changed from "+2 Group" throughout admin panel

#### Technical Improvements
- ✅ **Type Safety**: Comprehensive TypeScript updates with new enums and interfaces
- ✅ **Validation Schemas**: Updated Yup validations for all mandatory fields
- ✅ **Conditional Validation**: Dynamic validation based on course and referral selections
- ✅ **Data Management**:
  - New `collegesByDistrict.ts` data file with 600+ colleges
  - Optimized college filtering by district selection
  - Proper handling of multi-select arrays
- ✅ **Build Status**: Zero TypeScript errors, full type safety maintained

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and queries:

- **Email**: admin@salemfoundations.com
- **Phone**: +91 88385 03547
- **Website**: [www.salemfoundations.org](https://www.salemfoundations.org)
- **GitHub**: [salem-foundations-stud-registration](https://github.com/Sanjai-Kumar-B/salem-foundations-stud-registration)

---

## 🙏 Acknowledgments

- Salem Foundations team for requirements and feedback
- Firebase for backend infrastructure and serverless capabilities
- Next.js team for the amazing framework and developer experience
- Vercel for seamless deployment platform
- Open source community for the excellent libraries used

---

## 📈 Future Enhancements

- [ ] SMS notifications for application status updates
- [ ] Email notifications with application confirmation and unique application number
- [ ] Student portal for application tracking and status checking
- [ ] Document verification system with admin approval workflow
- [ ] Interview scheduling module with calendar integration
- [ ] Payment gateway integration for application and course fees
- [ ] Mobile app for students (Android/iOS)
- [ ] Advanced analytics dashboard with interactive charts and trends
- [ ] Bulk operations for admin (bulk status updates, bulk exports)
- [ ] Application comparison feature for counselors
- [ ] Automated scholarship eligibility checker based on criteria
- [ ] Integration with college admission APIs
- [ ] Multi-language support (Tamil, English)
- [ ] Video interview capability
- [ ] Digital signature for documents

---

<div align="center">

**Built with ❤️ by SANJAI KUMAR**

**Version 2.1** | Last Updated: December 2025

[⬆ Back to Top](#salem-foundations---student-application-automation-system)

</div>
