'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, Home } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const applicationNumber = searchParams.get('number');
  const applicationId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 via-white to-success-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="card text-center">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying to Salem Foundations. Your application has been received and is
            under review.
          </p>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-700 mb-2">Your Application Number</p>
            <p className="text-3xl font-bold text-primary-600">{applicationNumber}</p>
            <p className="text-sm text-gray-600 mt-2">
              Please save this number for future reference
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900">What's Next?</h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-sm">1</span>
                </span>
                <span>Our counselors will review your application within 2-3 business days</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-sm">2</span>
                </span>
                <span>You will receive an email/SMS with further instructions</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-sm">3</span>
                </span>
                <span>Keep your documents ready for the counseling session</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn btn-primary flex items-center justify-center">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              For any queries, contact us at{' '}
              <a href="mailto:admin@salemfoundations.com" className="text-primary-600 hover:underline">
                admin@salemfoundations.com
              </a>{' '}
              or call{' '}
              <a href="tel:+918838503547" className="text-primary-600 hover:underline">
                +91 88385 03547
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
