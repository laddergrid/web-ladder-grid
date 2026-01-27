'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GradientText from '@/components/ui/GradientText';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastUsedTimestamp, setLastUsedTimestamp] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
    fetchUsageStats();
  }, [router]);

  const fetchUsageStats = async () => {
    try {
      setLoadingStats(true);
      const token = authService.getAccessToken();

      const response = await fetch(`${BACKEND_API_URL}/api-keys/usage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch usage stats');
      }

      const data = await response.json();
      setUsageStats(data);
      setLastUsedTimestamp(data.last_updated_at_in_ms);
    } catch (err) {
      console.error('Error fetching usage stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const formatTimestamp = (timestampMs) => {
    if (!timestampMs || timestampMs === 0) {
      return 'Never';
    }
    const date = new Date(timestampMs);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

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
          <h1 className="text-3xl text-white mb-2">
            Welcome back, <GradientText>{user.first_name || user.email}!</GradientText>
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your API keys and monitor your usage from this dashboard.
          </p>
        </div>

        {/* API Usage Stats */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md text-white">API Usage</h2>
            <button
              onClick={fetchUsageStats}
              className="text-sm text-brand-cyan hover:text-brand-blue transition-colors flex items-center gap-1"
              title="Refresh"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
            </div>
          ) : usageStats ? (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Monthly Quota Usage</span>
                  <span className="text-sm font-semibold text-white">
                    {((usageStats.quota_used / usageStats.allocated_monthly_calls) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (usageStats.quota_used / usageStats.allocated_monthly_calls) >= 0.9
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : (usageStats.quota_used / usageStats.allocated_monthly_calls) >= 0.7
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-brand-purple to-brand-blue'
                    }`}
                    style={{
                      width: `${Math.min((usageStats.quota_used / usageStats.allocated_monthly_calls) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                {lastUsedTimestamp !== null && (
                  <div className="mt-2 text-xs text-slate-400">
                    Last API call: <span className="text-slate-300">{formatTimestamp(lastUsedTimestamp)}</span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-brand-surface border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-purple/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Monthly Quota</p>
                      <p className="text-2xl font-bold text-white">
                        {usageStats.allocated_monthly_calls.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-surface border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Used</p>
                      <p className="text-2xl font-bold text-white">
                        {usageStats.quota_used.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-surface border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-cyan/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Remaining</p>
                      <p className="text-2xl font-bold text-white">
                        {usageStats.remaining_calls.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Unable to load usage statistics</p>
            </div>
          )}
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
                <br></br>
                <br></br>
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
