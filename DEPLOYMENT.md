# Deployment Guide - Salem Foundations Student Portal

This guide will help you deploy the application to Vercel (free hosting for Next.js apps).

## Prerequisites

- Git installed on your computer
- GitHub account
- Vercel account (sign up at https://vercel.com with your GitHub account)

## Step 1: Initialize Git Repository

1. Open PowerShell in your project folder and run:

```powershell
git init
git add .
git commit -m "Initial commit - Salem Foundations Student Portal"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - Repository name: `salem-foundations-portal` (or your preferred name)
   - Description: "Salem Foundations Student Application Portal"
   - Choose **Private** (recommended for production apps)
   - **Do NOT** initialize with README, .gitignore, or license
3. Click "Create repository"

## Step 3: Push Code to GitHub

Copy the commands from GitHub and run them in PowerShell:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/salem-foundations-portal.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `salem-foundations-portal` repository
5. Configure the project:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: .next (default)

6. **Add Environment Variables**:
   Click on "Environment Variables" and add each variable from your `.env.local` file:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDVW2lHtQwUb2GRlp8sCAg5XXv1W0pA98M
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=salemfoundations-studentreg.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=salemfoundations-studentreg
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=40231680738
   NEXT_PUBLIC_FIREBASE_APP_ID=1:40231680738:web:dce676396024b84f227cbb
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-F5YKF3FZSQ
   NEXT_PUBLIC_APP_NAME=Salem Foundations
   ```

7. Click **"Deploy"**

8. Wait for deployment to complete (usually 2-3 minutes)

9. Once deployed, you'll get a URL like: `https://salem-foundations-portal.vercel.app`

### Option B: Deploy via Vercel CLI

```powershell
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Step 5: Update Firebase Settings

After deployment, you need to update Firebase to allow your production domain:

### Update Firebase Authentication

1. Go to Firebase Console: https://console.firebase.google.com/project/salemfoundations-studentreg/authentication/settings
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Vercel domain: `salem-foundations-portal.vercel.app` (use your actual domain)
5. Click **"Add"**

### Update Firestore Security Rules (Optional - for production)

If you want stricter security, update the rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users collection
    match /admins/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'SUPER_ADMIN');
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow create: if true; // Anyone can submit
      allow read, update, delete: if request.auth != null; // Only authenticated admins
    }
  }
}
```

## Step 6: Set Up Custom Domain (Optional)

If you have a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Add the custom domain to Firebase Authorized domains (Step 5)

## Access Your Deployed Application

- **Student Portal**: `https://your-vercel-domain.vercel.app/apply`
- **Admin Panel**: `https://your-vercel-domain.vercel.app/admin/login`

## Automatic Deployments

Every time you push code to GitHub, Vercel will automatically:
- Build and deploy your changes
- Run tests (if configured)
- Create a preview URL for each branch

## Monitoring and Logs

View application logs and performance:
- Vercel Dashboard → Your Project → Deployments
- Click on any deployment to see logs
- Monitor performance in the Analytics tab

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Make sure `.env.local` values match production environment variables

### Firebase Connection Issues
- Verify Firebase API key is correct
- Check that your domain is in Firebase Authorized domains
- Ensure Firestore and Authentication are enabled

### Application Errors
- Check Vercel Runtime Logs
- Enable Error Tracking in Vercel dashboard
- Check browser console for client-side errors

## Support

For issues or questions:
- Check Vercel Documentation: https://vercel.com/docs
- Firebase Documentation: https://firebase.google.com/docs
- Next.js Documentation: https://nextjs.org/docs

---

**Congratulations!** Your Salem Foundations Student Portal is now live! 🎉
