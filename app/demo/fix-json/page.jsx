import { redirect } from 'next/navigation'
import Container from '@/components/layout/Container'
import GradientText from '@/components/ui/GradientText'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

async function fixJson(formData) {
  'use server'

  const json = formData.get('json')

  if (!json || !json.trim()) {
    redirect('/demo/fix-json?error=JSON input is required')
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (BACKEND_API_KEY) {
      headers['X-API-Key'] = BACKEND_API_KEY
    }

    const response = await fetch(`${BACKEND_API_URL}/repair/fix-json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ json_to_fix: json }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      const errorMsg = encodeURIComponent(error.error || 'Failed to fix JSON')
      redirect(`/demo/fix-json?error=${errorMsg}&json=${encodeURIComponent(json)}`)
    }

    const data = await response.json()
    const fixedJson = encodeURIComponent(data.fixed_json || '')
    redirect(`/demo/fix-json?success=true&json=${encodeURIComponent(json)}&fixed=${fixedJson}`)

  } catch (error) {
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error
    }
    const errorMsg = encodeURIComponent('Internal server error')
    redirect(`/demo/fix-json?error=${errorMsg}&json=${encodeURIComponent(json)}`)
  }
}

const EXAMPLE_JSON = `{
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

export default function FixJsonPage({ searchParams }) {
  const error = searchParams?.error
  const success = searchParams?.success
  const inputJson = searchParams?.json ? decodeURIComponent(searchParams.json) : ''
  const fixedJson = searchParams?.fixed ? decodeURIComponent(searchParams.fixed) : ''

  return (
    <main className="min-h-screen bg-brand-dark pt-24 pb-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>JSON Fixer</GradientText>
            </h1>
            <p className="text-xl text-slate-300">
              Fix malformed JSON automatically. No JavaScript required.
            </p>
          </div>

          <div className="glass-card p-6">
            <form action={fixJson} method="POST">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="json" className="block text-sm font-medium text-slate-300">
                      Malformed JSON
                    </label>
                    <a
                      href={`/demo/fix-json?json=${encodeURIComponent(EXAMPLE_JSON)}`}
                      className="text-sm text-brand-purple hover:text-brand-blue transition-colors"
                    >
                      Load Example
                    </a>
                  </div>
                  <textarea
                    id="json"
                    name="json"
                    defaultValue={inputJson}
                    placeholder="Paste your malformed JSON here..."
                    className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
                    spellCheck={false}
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {success && fixedJson && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Fixed JSON
                    </label>
                    <div className="relative">
                      <textarea
                        value={fixedJson}
                        readOnly
                        className="w-full h-48 px-4 py-3 bg-green-500/5 border border-green-500/30 rounded-lg font-mono text-sm text-green-300 resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fix JSON
                  </button>
                  <a
                    href="/demo/fix-json"
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    Clear
                  </a>
                </div>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <a
                href="/demo/validate-json"
                className="text-sm text-brand-cyan hover:text-brand-blue transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Try Schema Validator instead
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            All processing happens server-side. Your data is never stored.
          </p>
        </div>
      </Container>
    </main>
  )
}
