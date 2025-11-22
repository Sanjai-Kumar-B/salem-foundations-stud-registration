import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from 'firebase/storage';
import { storage } from './firebase';
import { DocumentFile } from '@/types';
import { Timestamp } from 'firebase/firestore';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

// Upload file to Firebase Storage
export async function uploadFile(
  file: File,
  path: string,
  allowedTypes: string[] = ALLOWED_DOCUMENT_TYPES
): Promise<DocumentFile> {
  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  try {
    const storageRef = ref(storage, path);
    const uploadResult: UploadResult = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    return {
      name: file.name,
      url: downloadURL,
      uploadedAt: Timestamp.now(),
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

// Upload student document
export async function uploadStudentDocument(
  applicationNumber: string,
  documentType: string,
  file: File
): Promise<DocumentFile> {
  const path = `applications/${applicationNumber}/${documentType}/${file.name}`;
  return uploadFile(file, path);
}

// Upload student photo
export async function uploadStudentPhoto(
  applicationNumber: string,
  file: File
): Promise<DocumentFile> {
  const path = `applications/${applicationNumber}/photo/${file.name}`;
  return uploadFile(file, path, ALLOWED_IMAGE_TYPES);
}

// Delete file from Firebase Storage
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

// Delete all student documents
export async function deleteStudentDocuments(applicationNumber: string): Promise<void> {
  try {
    const basePath = `applications/${applicationNumber}`;
    const folderRef = ref(storage, basePath);
    
    // Note: Firebase Storage doesn't support deleting folders directly
    // You need to delete all files individually
    // This is a simplified version - in production, you'd list all files and delete them
    console.log(`Deleting documents for application: ${applicationNumber}`);
  } catch (error) {
    console.error('Error deleting student documents:', error);
    throw new Error('Failed to delete student documents');
  }
}

// Validate file before upload
export function validateFile(
  file: File,
  allowedTypes: string[] = ALLOWED_DOCUMENT_TYPES,
  maxSize: number = MAX_FILE_SIZE
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
