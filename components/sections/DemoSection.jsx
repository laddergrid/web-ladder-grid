'use client'

import { useState } from 'react'
import Container from '../layout/Container'
import GradientText from '../ui/GradientText'
import JsonFixerDemo from '../demo/JsonFixerDemo'
import JsonValidatorDemo from '../demo/JsonValidatorDemo'

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState('fixer')

  // These functions will call server actions or API routes
  // The actual backend API will be configured later
  const handleFixJson = async (input) => {
    const response = await fetch('/api/fix-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: input })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fix JSON')
    }

    const data = await response.json()
    return data.fixed
  }

  const handleValidateJson = async (json, schema, operationId) => {
    const response = await fetch('/api/validate-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json, schema, operationId })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Validation failed')
    }

    return await response.json()
  }

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try It <GradientText>Live</GradientText>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience Marshal&apos;s capabilities in real-time. No signup required.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('fixer')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'fixer'
                  ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                JSON Fixer
              </span>
            </button>
            <button
              onClick={() => setActiveTab('validator')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'validator'
                  ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Schema Validator
              </span>
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'fixer' ? (
            <JsonFixerDemo onFix={handleFixJson} />
          ) : (
            <JsonValidatorDemo onValidate={handleValidateJson} />
          )}
        </div>

        {/* Note about security */}
        <p className="text-center text-sm text-slate-500 mt-8">
          All processing happens server-side. Your data is never stored.
        </p>
      </Container>
    </section>
  )
}
