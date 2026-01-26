'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code || !state) {
        setError('Missing authentication parameters');
        return;
      }

      hasProcessed.current = true;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/google/callback?code=${code}&state=${state}`
        );

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();

        if (data.access_token && data.refresh_token && data.user) {
          authService.setTokens(data.access_token, data.refresh_token);
          authService.setUser(data.user);

          router.push('/dashboard');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Callback error:', error);
        setError('Authentication failed. Please try again.');
        hasProcessed.current = false;
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
