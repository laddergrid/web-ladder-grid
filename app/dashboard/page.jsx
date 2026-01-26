'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GradientText from '@/components/ui/GradientText';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="glass-card p-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <GradientText>{user.first_name || user.email}</GradientText>!
          </h1>
          <p className="text-slate-400">
            Manage your API keys and monitor your usage from this dashboard.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/api-keys">
            <div className="glass-card p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">API Keys</h3>
              <p className="text-slate-400 text-sm">
                Create and manage your API keys for accessing the Marshal Engine API.
              </p>
            </div>
          </Link>

          <Link href="/demo/validate-json">
            <div className="glass-card p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-cyan rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Validate JSON</h3>
              <p className="text-slate-400 text-sm">
                Validate your JSON against OpenAPI specifications.
              </p>
            </div>
          </Link>

          <Link href="/demo/fix-json">
            <div className="glass-card p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan to-brand-purple rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fix JSON</h3>
              <p className="text-slate-400 text-sm">
                Automatically repair malformed JSON strings.
              </p>
            </div>
          </Link>
        </div>

        {/* Getting Started */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
          <div className="space-y-4 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-purple font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Create an API Key</h3>
                <p className="text-sm text-slate-400">
                  Go to the API Keys section and create your first API key to start using the Marshal Engine API.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-blue font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Try the Demo</h3>
                <p className="text-sm text-slate-400">
                  Test the JSON validation and repair features using our interactive demo tools.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-cyan/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-brand-cyan font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Integrate with Your App</h3>
                <p className="text-sm text-slate-400">
                  Use your API key to integrate the Marshal Engine API into your applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
