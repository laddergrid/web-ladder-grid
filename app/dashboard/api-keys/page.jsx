'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GradientText from '@/components/ui/GradientText';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

export default function ApiKeysPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = authService.getUser();
    setUser(userData);
    fetchApiKeys();
  }, [router]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = authService.getAccessToken();

      const response = await fetch(`${BACKEND_API_URL}/api-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }

      const data = await response.json();
      console.log('Fetched API keys:', data);
      setApiKeys(data.data || []);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError('Failed to load API keys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const token = authService.getAccessToken();

      const response = await fetch(`${BACKEND_API_URL}/api-keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newKeyName.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to create API key');
      }

      const response_data = await response.json();
      console.log('API Key created successfully:', response_data);

      setNewlyCreatedKey(response_data.data);
      setNewKeyName('');
      fetchApiKeys();
    } catch (err) {
      console.error('Error creating API key:', err);
      setError('Failed to create API key. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const openRevokeModal = (keyId, keyName) => {
    setKeyToRevoke({ id: keyId, name: keyName });
    setShowRevokeModal(true);
  };

  const closeRevokeModal = () => {
    setShowRevokeModal(false);
    setKeyToRevoke(null);
  };

  const confirmRevokeApiKey = async () => {
    if (!keyToRevoke) return;

    try {
      setError(null);
      const token = authService.getAccessToken();

      const response = await fetch(`${BACKEND_API_URL}/api-keys/${keyToRevoke.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      closeRevokeModal();
      fetchApiKeys();
    } catch (err) {
      console.error('Error revoking API key:', err);
      setError('Failed to revoke API key. Please try again.');
      closeRevokeModal();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy. Please select and copy the key manually.');
    }
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              <GradientText>API Keys</GradientText>
            </h1>
            <p className="text-slate-400">
              Manage your API keys for accessing the Marshal Engine API
            </p>
          </div>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Key
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-card p-4 border-l-4 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* API Keys List */}
        <div className="glass-card p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No API Keys</h3>
              <p className="text-slate-400 mb-4">You haven't created any API keys yet.</p>
              <button
                onClick={() => setShowNewKeyModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Your First Key
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Expires</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr
                      key={key.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="text-white text-sm">{key.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-400 text-sm">
                          {key.expires_in_ms === 0
                            ? 'Never'
                            : `${Math.floor(key.expires_in_ms / (1000 * 60 * 60 * 24))} days`}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => openRevokeModal(key.id, key.name)}
                          className="px-3 py-1.5 text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="glass-card p-6 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border-brand-blue/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ready to integrate?
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Check out our API documentation to learn how to use your API keys and integrate with Marshal.
              </p>
              <Link
                href="/docs/api-reference"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View API Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-brand-cyan">•</span>
              <span>API keys are used to authenticate your requests to the Marshal Engine API</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-cyan">•</span>
              <span>Include your API key as <code className="px-1 py-0.5 bg-white/10 rounded text-brand-cyan">Bearer</code> token</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-cyan">•</span>
              <span>Keep your API keys secure and never share them publicly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-cyan">•</span>
              <span>Revoked keys cannot be restored - you'll need to create a new one</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Create New Key Modal */}
      {showNewKeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
          onClick={(e) => {
            // Close modal when clicking on backdrop
            if (e.target === e.currentTarget) {
              setShowNewKeyModal(false);
              setNewlyCreatedKey(null);
              setNewKeyName('');
              setCopied(false);
            }
          }}
        >
          <div className="glass-card p-6 max-w-md w-full space-y-4 animate-fade-in relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowNewKeyModal(false);
                setNewlyCreatedKey(null);
                setNewKeyName('');
                setCopied(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white pr-8">Create New API Key</h2>

            {newlyCreatedKey ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm mb-2">
                    ✓ API Key created successfully!
                  </p>
                  <p className="text-xs text-slate-400">
                    Make sure to copy your API key now. You won't be able to see it again!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your API Key
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="p-3 bg-brand-surface border border-white/10 rounded-lg">
                      <code className="text-white font-mono text-sm break-all select-all">
                        {newlyCreatedKey.key}
                      </code>
                    </div>
                    {newlyCreatedKey.expires_in_ms !== undefined && (
                      <p className="text-xs text-slate-400 mt-2 mb-2">
                        {newlyCreatedKey.expires_in_ms === 0
                          ? 'Expires in: Never expires'
                          : `Expires in: ${Math.floor(newlyCreatedKey.expires_in_ms / (1000 * 60 * 60 * 24))} days`}
                      </p>
                    )}
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey.key)}
                      disabled={copied}
                      className={`w-full px-4 py-2 text-white rounded-lg transition-all flex items-center justify-center gap-2 ${
                        copied
                          ? 'bg-green-600 cursor-default'
                          : 'bg-brand-purple hover:opacity-90'
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="keyName" className="block text-sm font-medium text-slate-300 mb-2">
                    Key Name
                  </label>
                  <input
                    id="keyName"
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production Key, Development Key"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewKeyModal(false);
                      setNewlyCreatedKey(null);
                      setNewKeyName('');
                      setCopied(false);
                    }}
                    className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createApiKey}
                    disabled={creating || !newKeyName.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Key'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revoke API Key Confirmation Modal */}
      {showRevokeModal && keyToRevoke && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeRevokeModal();
            }
          }}
        >
          <div className="glass-card p-6 max-w-md w-full space-y-4 animate-fade-in relative">
            {/* Close button */}
            <button
              onClick={closeRevokeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white pr-8">Revoke API Key</h2>

            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm mb-2">
                  ⚠️ Warning: This action cannot be undone
                </p>
                <p className="text-xs text-slate-400">
                  Are you sure you want to revoke the API key <span className="font-semibold text-white">"{keyToRevoke.name}"</span>?
                  Any applications using this key will immediately lose access.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeRevokeModal}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRevokeApiKey}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Revoke Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
