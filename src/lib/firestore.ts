import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  WhereFilterOp,
} from 'firebase/firestore';
import { db } from './firebase';
import { StudentApplication, FilterOptions, ApplicationStatus } from '@/types';
import { generateApplicationNumber } from './utils';

const APPLICATIONS_COLLECTION = 'applications';

// Create new application
export async function createApplication(
  applicationData: Omit<StudentApplication, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'tags' | 'documents'>
): Promise<{ id: string; applicationNumber: string }> {
  try {
    const now = Timestamp.now();
    
    // Generate a unique temporary ID to create application number
    const tempId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const applicationNumber = generateApplicationNumber(tempId);
    
    const application = {
      ...applicationData,
      applicationNumber,
      tags: generateAutoTags(applicationData),
      createdAt: now,
      updatedAt: now,
      submittedAt: now,
    };

    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), application);
    
    return { id: docRef.id, applicationNumber };
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

// Get application by ID
export async function getApplicationById(id: string): Promise<StudentApplication | null> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as StudentApplication;
    }
    return null;
  } catch (error) {
    console.error('Error getting application:', error);
    throw new Error('Failed to get application');
  }
}

// Update application
export async function updateApplication(
  id: string,
  updates: Partial<StudentApplication>
): Promise<void> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating application:', error);
    throw new Error('Failed to update application');
  }
}

// Delete application
export async function deleteApplication(id: string): Promise<void> {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application');
  }
}

// Get all applications with filters
export async function getApplications(
  filters?: FilterOptions
): Promise<StudentApplication[]> {
  try {
    let q = query(collection(db, APPLICATIONS_COLLECTION));

    // Apply filters
    if (filters) {
      if (filters.courses && filters.courses.length > 0) {
        q = query(q, where('coursePreference.preferredCourse', 'in', filters.courses));
      }

      if (filters.status && filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }

      if (filters.communities && filters.communities.length > 0) {
        q = query(q, where('communityScholarship.community', 'in', filters.communities));
      }

      if (filters.twelfthGroups && filters.twelfthGroups.length > 0) {
        q = query(q, where('academicDetails.twelfthGroup', 'in', filters.twelfthGroups));
      }

      if (filters.districts && filters.districts.length > 0) {
        q = query(q, where('personalDetails.address.district', 'in', filters.districts));
      }
    }

    // Order by submission date (newest first)
    q = query(q, orderBy('submittedAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const applications: StudentApplication[] = [];

    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as StudentApplication);
    });

    // Apply client-side filters for complex conditions
    let filteredApplications = applications;

    if (filters) {
      if (filters.minMarks !== undefined) {
        filteredApplications = filteredApplications.filter(
          (app) => app.academicDetails.twelfthMarks >= filters.minMarks!
        );
      }

      if (filters.maxMarks !== undefined) {
        filteredApplications = filteredApplications.filter(
          (app) => app.academicDetails.twelfthMarks <= filters.maxMarks!
        );
      }

      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        filteredApplications = filteredApplications.filter(
          (app) =>
            app.applicationNumber.toLowerCase().includes(searchLower) ||
            app.personalDetails.firstName.toLowerCase().includes(searchLower) ||
            app.personalDetails.lastName.toLowerCase().includes(searchLower) ||
            app.personalDetails.email.toLowerCase().includes(searchLower) ||
            app.personalDetails.mobile.includes(searchLower)
        );
      }
    }

    return filteredApplications;
  } catch (error) {
    console.error('Error getting applications:', error);
    throw new Error('Failed to get applications');
  }
}

// Update application status
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string
): Promise<void> {
  try {
    const updates: Partial<StudentApplication> = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (notes) {
      updates.notes = notes;
    }

    const docRef = doc(db, APPLICATIONS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status');
  }
}

// Generate auto tags based on application data
function generateAutoTags(application: Omit<StudentApplication, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'tags'>): string[] {
  const tags: string[] = [];

  // Add group tag
  tags.push(application.academicDetails.twelfthGroup);

  // Add high scorer tags
  if (application.academicDetails.twelfthPercentage >= 90) {
    tags.push('90+ Percentage');
  }
  if (application.academicDetails.twelfthPercentage >= 80) {
    tags.push('80+ Percentage');
  }

  // Add NEET/JEE tags
  if (application.academicDetails.neetScore) {
    tags.push('NEET Applicant');
    if (application.academicDetails.neetScore >= 600) {
      tags.push('High NEET Score');
    }
  }
  if (application.academicDetails.jeeScore) {
    tags.push('JEE Applicant');
    if (application.academicDetails.jeeScore >= 250) {
      tags.push('High JEE Score');
    }
  }

  // Add scholarship tag
  if (application.communityScholarship.scholarshipType && 
      application.communityScholarship.scholarshipType.length > 0 && 
      !application.communityScholarship.scholarshipType.includes('NONE' as any)) {
    tags.push('Scholarship Eligible');
  }

  // Add first graduate tag
  if (application.communityScholarship.firstGraduate) {
    tags.push('First Graduate');
  }

  // Add course tag
  tags.push(application.coursePreference.preferredCourse);

  return tags;
}

// Get application statistics
export async function getApplicationStatistics() {
  try {
    const applications = await getApplications();

    const stats = {
      totalApplications: applications.length,
      newApplications: applications.filter((app) => app.status === ApplicationStatus.NEW).length,
      selected: applications.filter((app) => app.status === ApplicationStatus.SELECTED).length,
      completed: applications.filter((app) => app.status === ApplicationStatus.COMPLETED).length,
      courseWiseCount: {} as Record<string, number>,
      districtWiseCount: {} as Record<string, number>,
      communityWiseCount: {} as Record<string, number>,
      scholarshipEligible: applications.filter(
        (app) => Array.isArray(app.communityScholarship.scholarshipType) && 
                 app.communityScholarship.scholarshipType.length > 0 && 
                 !app.communityScholarship.scholarshipType.includes('NONE' as any)
      ).length,
      highScorers: applications.filter((app) => app.academicDetails.twelfthPercentage >= 90).length,
    };

    // Calculate course-wise count
    applications.forEach((app) => {
      const course = app.coursePreference.preferredCourse;
      stats.courseWiseCount[course] = (stats.courseWiseCount[course] || 0) + 1;
    });

    // Calculate district-wise count
    applications.forEach((app) => {
      const district = app.personalDetails.address.district;
      stats.districtWiseCount[district] = (stats.districtWiseCount[district] || 0) + 1;
    });

    // Calculate community-wise count
    applications.forEach((app) => {
      const community = app.communityScholarship.community;
      stats.communityWiseCount[community] = (stats.communityWiseCount[community] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw new Error('Failed to get statistics');
  }
}

// Store student rating feedback
export async function storeStudentRating(
  ratingData: {
    rating: number;
    comment?: string;
    userId?: string;
  }
): Promise<string> {
  try {
    const now = Timestamp.now();
    
    // Clean up the data - remove undefined values
    const rating: any = {
      rating: ratingData.rating,
      timestamp: now,
      createdAt: now,
    };

    // Only add optional fields if they exist
    if (ratingData.comment) {
      rating.comment = ratingData.comment;
    }
    if (ratingData.userId) {
      rating.userId = ratingData.userId;
    }

    console.log('Attempting to store rating:', rating);
    const docRef = await addDoc(collection(db, 'ratings'), rating);
    console.log('Rating stored successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error('Error storing rating:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    throw error; // Throw the original error instead of wrapping it
  }
}
