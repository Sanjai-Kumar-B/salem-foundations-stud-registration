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
      - Engineering & Technology (17 specializations)
      - Medical & Health Sciences (15 specializations)
      - Arts & Science (17 specializations)
      - Law & Civil Services
      - Agriculture (4 specializations)
      - Architecture (4 specializations)
      - Marine (4 specializations)
      - Aviation (5 specializations)
      - Hotel Management (4 specializations)
      - Veterinary (3 specializations)
      - Fisheries (3 specializations)
      - Others (custom input)
    - Multiple college type selection (up to 3)
    - 4 additional free courses: Spoken English, Coding, Abroad Courses, Soft Skills
  - **Step 4 - Community & Scholarship**:
    - 7 community options (including BCM, SC(A))
    - **Multi-select scholarships** (18 types):
      - Government scholarships (7 types)
      - Salem Foundations Scholarship
      - Tamil Puthalvan, Pudumaipen
      - Welfare Scholarship, and more
    - Educational loan requirement
    - First graduate status
  - **Step 5 - Referral Tracking**:
    - Counselor referral option with mobile number
    - Social media follow integration (Instagram, Facebook, YouTube)
    - Source tracking

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
  - Multi-scholarship type filtering
  - Mark range filtering (80+, 90+, etc.)
  - Status-based filtering
  - Real-time search across all fields

- **Application Management**
  - Detailed student profile view
  - Display of multiple selected scholarships
  - Educational loan status
  - Tamil medium education status
  - Entrance exam preparation details
  - Custom course inputs for "Others" category
  - Document preview and download
  - Status updates with notes

- **Analytics & Reports**
  - Course-wise distribution (12 categories)
  - District-wise statistics
  - Community demographics
  - Multi-scholarship analysis
  - High scorer identification (90%+ tracking)
  - Entrance exam preparation trends

- **Data Export**
  - Export to Excel (.xlsx) with all fields including multiple scholarships
  - Export to CSV
  - PDF generation with complete application details
  - Filtered data export
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
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   ├── apply/                    # Student application module
│   │   │   ├── page.tsx              # Multi-step form
│   │   │   └── success/page.tsx      # Success confirmation
│   │   └── admin/                    # Admin module
│   │       ├── login/page.tsx        # Admin login
│   │       ├── dashboard/page.tsx    # Dashboard with stats
│   │       ├── applications/page.tsx # Applications list
│   │       └── analytics/page.tsx    # Analytics & charts
│   ├── components/                   # Reusable components
│   │   ├── FormComponents.tsx        # Form input components
│   │   ├── FileUpload.tsx            # File upload component
│   │   └── AdminLayout.tsx           # Admin layout wrapper
│   ├── lib/                          # Utility libraries
│   │   ├── firebase.ts               # Firebase configuration
│   │   ├── firestore.ts              # Firestore operations
│   │   ├── storage.ts                # Storage operations
│   │   ├── validations.ts            # Yup validation schemas
│   │   └── utils.ts                  # Helper functions
│   ├── hooks/                        # Custom React hooks
│   │   └── useAuth.ts                # Authentication hook
│   └── types/                        # TypeScript definitions
│       └── index.ts                  # Type definitions
├── public/                           # Static assets
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind configuration
├── next.config.mjs                   # Next.js configuration
└── README.md                         # This file
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
    tenthSchool, tenthBoard (dropdown), tenthMarks, tenthPercentage,
    twelfthSchool, twelfthBoard (dropdown), twelfthMarks, twelfthPercentage,
    twelfthGroup (Maths-Biology, Maths-CS, CS-Biology, Commerce, Arts, Vocational),
    neetScore, neetRank, neetYear,
    jeeScore, jeeRank, jeeYear,
    preparingForExam (33 entrance exam options),
    studiedInTamilMedium (boolean)
  },
  coursePreference: {
    preferredCourse (12 categories),
    courseSpecialization (conditional dropdown or custom input),
    preferredColleges (array, max 3),
    additionalFreeCourses (array of 4 options)
  },
  communityScholarship: {
    community (7 options including BCM, SC(A)),
    scholarshipType (array - multi-select from 18 types),
    scholarshipDetails,
    annualFamilyIncome,
    firstGraduate (boolean),
    needsEducationalLoan (boolean)
  },
  referralDetails: {
    source (Counselor, Friends/Family, Social Media, etc.),
    referrerName, referrerMobile,
    followedSocialMedia: { instagram, facebook, youtube }
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

### November 2025 - Major Feature Enhancements

#### Form Enhancements
- ✅ **Extended Course Categories**: Added 7 new course types (Agriculture, Architecture, Marine, Aviation, Hotel Management, Veterinary, Fisheries)
- ✅ **Specialized Course Dropdowns**: 49 total specialization options across all categories
- ✅ **Multi-Select Scholarships**: Students can now select multiple scholarships (18 types available)
- ✅ **Educational Loan Field**: New required field for loan requirement tracking
- ✅ **33 Entrance Exams**: Comprehensive entrance exam preparation dropdown
- ✅ **Tamil Medium Tracking**: Dedicated field for Tamil medium education (6th-12th)
- ✅ **Additional Free Courses**: 4 optional free course selections

#### New Scholarship Types
- Salem Foundations Scholarship
- Welfare Scholarship
- Tamil Puthalvan
- Pudumaipen
- (Total 18 scholarship options)

#### Application Number System
- ✅ **Truly Unique Generation**: Uses Firestore document ID for guaranteed uniqueness
- ✅ **Format**: SF{YY}{MM}{UNIQUE6} (e.g., SF2511A3F2D9)
- ✅ **Sync Fix**: Student and admin now see the same application number

#### Admin Dashboard Updates
- ✅ **Multi-Scholarship Display**: Shows all selected scholarships as bulleted list
- ✅ **Educational Loan Status**: Displays loan requirement
- ✅ **Extended Filters**: Support for 12 course types and 18 scholarship types
- ✅ **Enhanced Export**: Excel/PDF exports include all new fields

#### Technical Improvements
- ✅ **Updated Firestore Rules**: Public write access for ratings collection
- ✅ **Array Handling**: Proper handling of multi-select scholarship arrays
- ✅ **Type Safety**: Comprehensive TypeScript updates for new fields
- ✅ **Validation Schemas**: Updated Yup validations for all new fields

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
- [ ] Email notifications with application confirmation
- [ ] Student portal for application tracking
- [ ] Document verification system
- [ ] Interview scheduling module
- [ ] Payment gateway integration for fees
- [ ] Mobile app for students
- [ ] Advanced analytics dashboard with charts
- [ ] Bulk operations for admin
- [ ] Application comparison feature

---

<div align="center">

**Built with ❤️ by SANJAI KUMAR**

**Version 2.0** | Last Updated: November 2025

[⬆ Back to Top](#salem-foundations---student-application-automation-system)

</div>
