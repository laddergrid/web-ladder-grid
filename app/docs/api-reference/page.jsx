'use client';

import { useState } from 'react';
import Link from 'next/link';
import GradientText from '@/components/ui/GradientText';

export default function ApiReferencePage() {
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sections = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'validator', name: 'JSON Validator', icon: '✓' },
    { id: 'repair', name: 'JSON Repair', icon: '🔧' },
  ];

  const endpoints = {
    validator: [
      {
        method: 'POST',
        path: '/validator/validate',
        summary: 'Validate JSON against OpenAPI specification',
        description: 'Validates a JSON string against a provided OpenAPI specification schema',
        auth: 'Bearer API Key',
        requestBody: {
          open_api_spec: '{"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "number"}}, "required": ["name"]}',
          json_string: '{"name": "John Doe", "age": 30}',
          operation_id: 'createUser'
        },
        response: {
          is_valid: true,
          errors: []
        }
      }
    ],
    repair: [
      {
        method: 'POST',
        path: '/repair/fix-json',
        summary: 'Fix malformed JSON',
        description: 'Attempts to repair and fix malformed or invalid JSON strings',
        auth: 'Bearer API Key',
        requestBody: {
          json_to_fix: '{"name": "John", age: 30, "city": "New York"'
        },
        response: {
          fixed_json: '{"name": "John", "age": 30, "city": "New York"}'
        }
      }
    ]
  };

  const MethodBadge = ({ method }) => {
    const colors = {
      GET: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      POST: 'bg-green-500/20 text-green-400 border-green-500/30',
      DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
      PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${colors[method]}`}>
        {method}
      </span>
    );
  };

  const CodeBlock = ({ code, id }) => {
    const isCopied = copiedId === id;

    return (
      <div className="relative group">
        <pre className="bg-brand-surface border border-white/10 rounded-lg p-4 pr-12 overflow-x-auto">
          <code className="text-sm text-slate-300">{code}</code>
        </pre>
        <button
          onClick={() => copyToClipboard(code, id)}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
            isCopied
              ? 'bg-green-600 text-white'
              : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title="Copy to clipboard"
        >
          {isCopied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-brand-surface/80 backdrop-blur-md border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <GradientText>Marshal</GradientText>
              </span>
            </Link>
            <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 w-64 h-[calc(100vh-4rem)] bg-brand-surface border-r border-white/10 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                  selectedSection === section.id
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 max-w-5xl">
          {selectedSection === 'getting-started' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  <GradientText>API Reference</GradientText>
                </h1>
                <p className="text-slate-400 text-lg">
                  Complete documentation for the Marshal Engine API - JSON validation and repair services
                </p>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Base URL</h2>
                <div className="bg-brand-surface border border-white/10 rounded-lg p-4">
                  <code className="text-brand-cyan">https://api.laddergrid.com</code>
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
                <p className="text-slate-400 mb-4">
                  The Marshal Engine API uses Bearer token authentication with API keys.
                </p>
                <div className="p-4 bg-brand-surface border border-white/10 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Bearer API Key</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Include your API key in the Authorization header as a Bearer token for all requests.
                  </p>
                  <div className="bg-black/30 rounded p-3 mt-2">
                    <code className="text-xs text-brand-cyan">
                      Authorization: Bearer lg-m-550e8400-e29b-41d4-a716-446655440000
                    </code>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
                <ol className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple text-sm font-semibold">1</span>
                    <span>Sign up and log in to your Marshal Engine account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple text-sm font-semibold">2</span>
                    <span>Create an API key from your dashboard</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple text-sm font-semibold">3</span>
                    <span>Use your API key as a Bearer token to access the API endpoints</span>
                  </li>
                </ol>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Example Request</h2>
                <CodeBlock
                  id="getting-started-example"
                  code={`curl -X POST https://api.laddergrid.com/validator/validate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "open_api_spec": "{\\"type\\":\\"object\\"}",
    "json_string": "{\\"name\\":\\"John\\"}",
    "operation_id": "createUser"
  }'`}
                />
              </div>
            </div>
          )}

          {selectedSection !== 'getting-started' && endpoints[selectedSection] && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  <GradientText>{sections.find(s => s.id === selectedSection)?.name}</GradientText>
                </h1>
                <p className="text-slate-400">
                  API endpoints for {selectedSection.replace('-', ' ')} operations
                </p>
              </div>

              {endpoints[selectedSection].map((endpoint, index) => (
                <div key={index} className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <MethodBadge method={endpoint.method} />
                    <code className="text-white font-mono text-sm">{endpoint.path}</code>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{endpoint.summary}</h3>
                    <p className="text-slate-400 text-sm">{endpoint.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Authentication</span>
                      <p className="text-white font-medium">{endpoint.auth}</p>
                    </div>
                  </div>

                  {endpoint.params && endpoint.params.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                      <div className="space-y-2">
                        {endpoint.params.map((param, idx) => (
                          <div key={idx} className="p-3 bg-brand-surface border border-white/10 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-brand-cyan text-sm">{param.name}</code>
                              <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-slate-400">
                                {param.type}
                              </span>
                              {param.required && (
                                <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                                  required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {endpoint.requestBody && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Request Body</h4>
                      <CodeBlock
                        id={`${selectedSection}-${index}-request`}
                        code={JSON.stringify(endpoint.requestBody, null, 2)}
                      />
                    </div>
                  )}

                  {endpoint.response && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Response (200 OK)</h4>
                      <CodeBlock
                        id={`${selectedSection}-${index}-response`}
                        code={JSON.stringify(endpoint.response, null, 2)}
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Example Request</h4>
                    <CodeBlock
                      id={`${selectedSection}-${index}-curl`}
                      code={`curl -X ${endpoint.method} https://api.laddergrid.com${endpoint.path} \\
  -H "Authorization: ${endpoint.auth === 'None' ? 'Not required' : endpoint.auth}" \\
  -H "Content-Type: application/json"${endpoint.requestBody ? ` \\
  -d '${JSON.stringify(endpoint.requestBody)}'` : ''}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
