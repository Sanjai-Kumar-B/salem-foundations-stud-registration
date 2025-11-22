# Salem Foundations Setup Guide

## Quick Start Guide

This guide will help you set up the Salem Foundations Student Application Portal from scratch.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Sign up](https://firebase.google.com)
- **Code Editor** - VS Code recommended

---

## 🔧 Step-by-Step Setup

### Step 1: Clone or Extract Project

If you have the project as a ZIP file:
```bash
# Extract the ZIP file to your desired location
# Navigate to the project folder
cd Registration_tool
```

If cloning from Git:
```bash
git clone <repository-url>
cd Registration_tool
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. It may take a few minutes.

### Step 3: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Click "Add Project" or "Create a project"

2. **Project Details**
   - Project name: `salem-foundations` (or your preferred name)
   - Click "Continue"
   - Disable Google Analytics (optional for this project)
   - Click "Create project"
   - Wait for project creation (1-2 minutes)

3. **Register Web App**
   - Click the web icon (`</>`) to add Firebase to your web app
   - App nickname: `Salem Foundations Portal`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
   - **IMPORTANT**: Copy the Firebase configuration object shown

### Step 4: Enable Firebase Services

#### Enable Authentication

1. In Firebase Console, click **Authentication** from the left menu
2. Click **Get Started**
3. Click on **Email/Password** under Sign-in method
4. Enable **Email/Password**
5. Click **Save**

#### Create Firestore Database

1. Click **Firestore Database** from the left menu
2. Click **Create database**
3. Select **Production mode**
4. Choose your location (e.g., asia-south1 for India)
5. Click **Enable**

#### Set Up Cloud Storage

1. Click **Storage** from the left menu
2. Click **Get Started**
3. Click **Next** (use production mode)
4. Select same location as Firestore
5. Click **Done**

### Step 5: Configure Firestore Security Rules

1. In **Firestore Database**, click on the **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Applications - Anyone can create, only admins can read
    match /applications/{applicationId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Admins - Only authenticated admins can read their own data
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'SUPER_ADMIN';
    }
  }
}
```

3. Click **Publish**

### Step 6: Configure Storage Security Rules

1. In **Storage**, click on the **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /applications/{applicationNumber}/{allPaths=**} {
      allow create: if true;
      allow read: if request.auth != null;
      allow delete: if request.auth != null && 
        firestore.get(/databases/(default)/documents/admins/$(request.auth.uid)).data.role == 'SUPER_ADMIN';
    }
  }
}
```

3. Click **Publish**

### Step 7: Create Environment File

1. In the project root, find `.env.example`
2. Create a new file named `.env.local`
3. Copy the Firebase config values you got in Step 3:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=salem-foundations.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=salem-foundations
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=salem-foundations.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC...

NEXT_PUBLIC_APP_NAME="Salem Foundations"
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
```

### Step 8: Create Admin User

#### Method 1: Using Firebase Console (Recommended)

1. **Create Authentication User**
   - Go to **Authentication** > **Users**
   - Click **Add user**
   - Email: `admin@salemfoundations.org`
   - Password: Choose a strong password
   - Click **Add user**
   - **Copy the User UID** (you'll need this)

2. **Create Firestore Admin Document**
   - Go to **Firestore Database**
   - Click **Start collection**
   - Collection ID: `admins`
   - Click **Next**
   - Document ID: Paste the User UID you copied
   - Add fields:

   ```
   Field: email          Type: string    Value: admin@salemfoundations.org
   Field: displayName    Type: string    Value: Admin User
   Field: role           Type: string    Value: SUPER_ADMIN
   Field: isActive       Type: boolean   Value: true
   Field: createdAt      Type: timestamp Value: (current timestamp)
   ```

   - Click **Save**

### Step 9: Run the Application

```bash
npm run dev
```

The application should now be running at: http://localhost:3000

### Step 10: Test the Application

1. **Test Student Portal**
   - Open http://localhost:3000
   - Click "Apply Now"
   - Fill out a test application
   - Submit and verify success message

2. **Test Admin Portal**
   - Go to http://localhost:3000/admin/login
   - Login with the admin credentials you created
   - Verify dashboard loads with statistics
   - Check if the test application appears

---

## 🎨 Customization

### Update Branding

Edit the following files to customize:

- `src/app/layout.tsx` - Page title and metadata
- `src/app/page.tsx` - Landing page content
- `tailwind.config.ts` - Colors and theme

### Add More Admin Users

1. Go to Firebase Authentication
2. Add new user with email/password
3. Copy the UID
4. Go to Firestore > admins collection
5. Add new document with the UID and user details

### Modify Districts or Courses

Edit these arrays in:
- `src/app/apply/page.tsx` - DISTRICTS and COLLEGES arrays
- `src/types/index.ts` - Enums for CourseType, Community, etc.

---

## 🚨 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Double-check your API key in `.env.local`
- Ensure there are no extra spaces
- Restart the dev server after changing .env file

### "Permission denied" errors in Firestore
- Verify security rules are published
- Check that admin document exists with correct UID
- Ensure user is authenticated

### Files not uploading
- Check Storage rules are published
- Verify file size is under 5MB
- Check file type (only PDF, JPG, PNG allowed)

### Application won't build
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run build`

---

## 📦 Production Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add Environment Variables**
   - Go to Vercel Dashboard > Project Settings
   - Add all variables from `.env.local`

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize**
```bash
firebase init hosting
```

Select:
- Use existing project
- Build directory: `.next`
- Single-page app: Yes
- GitHub deploys: No

4. **Build and Deploy**
```bash
npm run build
firebase deploy
```

---

## 📞 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review Firebase Console for error messages
3. Check browser console (F12) for errors
4. Contact: info@salemfoundations.org

---

## ✅ Checklist

Before going live, ensure:

- [ ] Firebase project created and configured
- [ ] Environment variables set correctly
- [ ] Security rules published for Firestore and Storage
- [ ] At least one admin user created
- [ ] Application tested end-to-end
- [ ] Branding customized
- [ ] Production deployment successful
- [ ] Backup and monitoring set up

---

**You're all set! 🎉**

Your Salem Foundations Student Application Portal is now ready to use.
