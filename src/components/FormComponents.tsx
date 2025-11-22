'use client';

import React from 'react';
import { useFormikContext } from 'formik';

interface FormStepProps {
  children: React.ReactNode;
  currentStep: number;
  stepNumber: number;
}

export function FormStep({ children, currentStep, stepNumber }: FormStepProps) {
  if (currentStep !== stepNumber) {
    return null;
  }

  return <div className="space-y-6">{children}</div>;
}

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
}: FormInputProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${touched[name] && errors[name] ? 'border-danger-500' : ''}`}
      />
      {touched[name] && errors[name] && (
        <p className="error-text">{errors[name] as string}</p>
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function FormSelect({
  label,
  name,
  options,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
}: FormSelectProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`input ${touched[name] && errors[name] ? 'border-danger-500' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {touched[name] && errors[name] && (
        <p className="error-text">{errors[name] as string}</p>
      )}
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export function FormTextarea({
  label,
  name,
  placeholder,
  required = false,
  rows = 3,
}: FormTextareaProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={values[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        className={`input ${touched[name] && errors[name] ? 'border-danger-500' : ''}`}
      />
      {touched[name] && errors[name] && (
        <p className="error-text">{errors[name] as string}</p>
      )}
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  name: string;
  description?: string;
}

export function FormCheckbox({ label, name, description }: FormCheckboxProps) {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  return (
    <div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={values[name] || false}
            onChange={(e) => setFieldValue(name, e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
        </div>
        <div className="ml-3">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {touched[name] && errors[name] && (
        <p className="error-text">{errors[name] as string}</p>
      )}
    </div>
  );
}

interface NestedFormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function NestedFormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
}: NestedFormInputProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

  // Handle nested field access
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const value = getNestedValue(values, name) || '';
  const error = getNestedValue(errors, name);
  const touch = getNestedValue(touched, name);

  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`input ${touch && error ? 'border-danger-500' : ''}`}
      />
      {touch && error && <p className="error-text">{error as string}</p>}
    </div>
  );
}

interface NestedFormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function NestedFormSelect({
  label,
  name,
  options,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
}: NestedFormSelectProps) {
  const { values, errors, touched, handleChange, handleBlur } = useFormikContext<any>();

  // Handle nested field access
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const value = getNestedValue(values, name) || '';
  const error = getNestedValue(errors, name);
  const touch = getNestedValue(touched, name);

  return (
    <div>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`input ${touch && error ? 'border-danger-500' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {touch && error && <p className="error-text">{error as string}</p>}
    </div>
  );
}
