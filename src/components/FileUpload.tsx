'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { validateFile, formatFileSize } from '@/lib/storage';
import { DocumentFile } from '@/types';

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  required?: boolean;
  maxSize?: number;
  value?: DocumentFile;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({
  label,
  name,
  accept = 'image/*,.pdf',
  required = false,
  maxSize = 5 * 1024 * 1024,
  value,
  onChange,
  error,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(value?.url || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const allowedTypes = accept.split(',').map((type) => {
      if (type.includes('image')) return 'image/jpeg,image/jpg,image/png'.split(',');
      if (type.includes('pdf')) return ['application/pdf'];
      return [];
    }).flat();

    const validation = validateFile(file, allowedTypes, maxSize);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedFile(file);
    onChange(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>

      {!selectedFile && !value ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : error
              ? 'border-danger-500 bg-danger-50'
              : 'border-gray-300 hover:border-primary-400 bg-gray-50'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {accept.includes('image') && 'PNG, JPG, JPEG '}
            {accept.includes('pdf') && 'or PDF '}
            (Max {formatFileSize(maxSize)})
          </p>
        </div>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile?.name || value?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedFile ? formatFileSize(selectedFile.size) : formatFileSize(value?.size || 0)}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-success-500" />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
