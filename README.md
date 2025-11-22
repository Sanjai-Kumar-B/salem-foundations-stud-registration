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
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Salem Foundations Student Application Automation System** is a comprehensive web-based platform designed to digitize and automate the entire student admission process. This system replaces traditional paper-based applications with an efficient, secure, and user-friendly digital solution.

### Purpose

- **For Students**: Submit applications online with ease, upload documents securely, and track application status
- **For Administrators**: Manage applications efficiently with advanced filtering, sorting, analytics, and export capabilities
- **For the Organization**: Reduce manual work, eliminate paperwork, enable data-driven decisions

---

## ✨ Key Features

### 🎓 Student Module

- **Multi-Step Application Form**
  - Personal details with address validation
  - Academic records (10th & 12th with competitive exam scores)
  - Course preferences with college selection
  - Community and scholarship information
  - Progress indicator with step validation

- **Document Management**
  - Secure file upload (photos, certificates, marksheets)
  - Support for PDF, JPG, PNG formats
  - File size and type validation
  - Drag-and-drop interface
  - Real-time upload progress

- **Auto-Validation**
  - Aadhar number validation
  - Email and mobile number verification
  - Percentage calculation
  - Mandatory field checks

### 🔐 Admin Module

- **Authentication & Authorization**
  - Firebase Authentication integration
  - Role-based access control (Super Admin, Counsellor, Reviewer)
  - Secure session management

- **Comprehensive Dashboard**
  - Real-time statistics and metrics
  - Application status overview
  - Recent applications list
  - Course and community distribution charts

- **Advanced Filtering**
  - Filter by course type, district, community
  - +2 group and scholarship type filters
  - Mark range filtering (80+, 90+, etc.)
  - Status-based filtering
  - Real-time search

- **Application Management**
  - Detailed student profile view
  - Document preview and download
  - Status updates (New, Shortlisted, Follow-up, Completed)
  - Notes and comments

- **Analytics & Reports**
  - Course-wise distribution
  - District-wise statistics
  - Community demographics
  - Scholarship eligibility tracking
  - High scorer identification

- **Data Export**
  - Export to Excel (.xlsx)
  - Export to CSV
  - PDF generation with auto-filled forms
  - Filtered data export

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
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting / Vercel

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
- ✅ Firestore security rules
- ✅ Storage security rules
- ✅ Input validation (client & server)
- ✅ File type and size validation
- ✅ XSS protection
- ✅ CSRF protection (Next.js built-in)

### Security Rules

- Students can only create applications (no login required)
- Admins must authenticate to access dashboard
- Only authorized admins can view/modify applications
- File uploads are validated for type and size
- Sensitive data is protected in Firestore

---

## 📊 Data Model

### Student Application Schema

```typescript
{
  id: string,
  applicationNumber: string,
  personalDetails: {
    firstName, lastName, dateOfBirth, gender,
    email, mobile, aadharNumber, address, ...
  },
  academicDetails: {
    tenthSchool, tenthMarks, tenthPercentage,
    twelfthSchool, twelfthMarks, twelfthPercentage,
    plusTwoGroup, neetScore, jeeScore, ...
  },
  coursePreference: {
    preferredCourse, alternativeCourse,
    preferredColleges, courseSpecialization
  },
  communityScholarship: {
    community, scholarshipType,
    annualFamilyIncome, firstGraduate
  },
  documents: {
    photo, aadharCard, tenthMarksheet,
    twelfthMarksheet, communityCertificate, ...
  },
  status: "NEW" | "SHORTLISTED" | "FOLLOW_UP" | "COMPLETED",
  tags: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp,
  submittedAt: Timestamp
}
```

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

- **Email**: info@salemfoundations.org
- **Phone**: +91 98765 43210
- **Website**: [www.salemfoundations.org](https://www.salemfoundations.org)

---

## 🙏 Acknowledgments

- Salem Foundations team for requirements and feedback
- Firebase for backend infrastructure
- Next.js team for the amazing framework
- Open source community for the libraries used

---

<div align="center">

**Built with ❤️ by Salem Foundations Development Team**

</div>
