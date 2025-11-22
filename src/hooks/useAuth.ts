'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AdminUser } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          
          if (adminDoc.exists()) {
            const adminData = adminDoc.data() as AdminUser;
            
            if (adminData.isActive) {
              setUser(adminData);
            } else {
              await auth.signOut();
              router.push('/admin/login');
            }
          } else {
            await auth.signOut();
            router.push('/admin/login');
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          await auth.signOut();
          router.push('/admin/login');
        }
      } else {
        setUser(null);
        router.push('/admin/login');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { user, loading };
}

export async function logout() {
  try {
    await auth.signOut();
    sessionStorage.removeItem('adminUser');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
