'use client'

import { useState } from 'react'
import Button from '../ui/Button'

const EXAMPLE_INVALID_JSON = `{
  name: "John Doe",
  age: 30,
  email: 'john@example.com',
  active: True,
  tags: ["developer", "designer",],
  address: {
    city: "New York"
    country: "USA"
  }
}`

export default function JsonFixerDemo({ onFix }) {
  const [input, setInput] = useState(EXAMPLE_INVALID_JSON)
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFix = async () => {
    if (!input.trim()) {
      setError('Please enter some JSON to fix')
      return
    }

    setIsLoading(true)
    setError('')
    setOutput('')

    try {
      // This will be replaced with actual API call
      const result = await onFix(input)
      setOutput(result)
    } catch (err) {
      setError(err.message || 'Failed to fix JSON')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleLoadExample = () => {
    setInput(EXAMPLE_INVALID_JSON)
    setOutput('')
    setError('')
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">JSON Fixer</h3>
        <div className="flex gap-2">
          <button
            onClick={handleLoadExample}
            className="text-sm text-brand-purple hover:text-brand-blue transition-colors"
          >
            Load Example
          </button>
          <button
            onClick={handleClear}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-slate-400 text-sm mb-6">
        Paste invalid or malformed JSON and get it automatically fixed.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Input (Invalid JSON)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your invalid JSON here..."
            className="w-full h-64 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Output (Fixed JSON)
          </label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              placeholder="Fixed JSON will appear here..."
              className="w-full h-64 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none resize-none text-green-400"
              spellCheck={false}
            />
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button onClick={handleFix} disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Fixing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fix JSON
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
