import { redirect } from 'next/navigation'
import Container from '@/components/layout/Container'
import GradientText from '@/components/ui/GradientText'
import FixJsonForm from './FixJsonForm'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080'
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
            <FixJsonForm
              action={fixJson}
              inputJson={inputJson}
              error={error}
              success={success}
              fixedJson={fixedJson}
              EXAMPLE_JSON={EXAMPLE_JSON}
            />

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
