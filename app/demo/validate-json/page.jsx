import { redirect } from 'next/navigation'
import yaml from 'js-yaml'
import Container from '@/components/layout/Container'
import GradientText from '@/components/ui/GradientText'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

// Parse schema text as JSON or YAML
function parseSchema(schemaText) {
  const trimmed = schemaText.trim()

  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed)
    } catch {
      // Fall through to YAML
    }
  }

  try {
    return yaml.load(trimmed)
  } catch {
    return null
  }
}

// Extract operationIds from OpenAPI spec
function extractOperationIds(schemaText) {
  try {
    const schema = parseSchema(schemaText)
    if (!schema) return []

    const operations = []

    if (schema.paths) {
      for (const [path, methods] of Object.entries(schema.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
          if (operation && typeof operation === 'object' && operation.operationId) {
            operations.push({
              id: operation.operationId,
              method: method.toUpperCase(),
              path: path,
              summary: operation.summary || ''
            })
          }
        }
      }
    }

    return operations
  } catch {
    return []
  }
}

async function validateJson(formData) {
  'use server'

  const json = formData.get('json')
  const schema = formData.get('schema')
  const operationId = formData.get('operationId')

  const params = new URLSearchParams()
  if (json) params.set('json', json)
  if (schema) params.set('schema', schema)
  if (operationId) params.set('operationId', operationId)

  if (!schema || !schema.trim()) {
    params.set('error', 'OpenAPI schema is required')
    redirect(`/demo/validate-json?${params.toString()}`)
  }

  if (!operationId || !operationId.trim()) {
    params.set('error', 'Operation ID is required')
    redirect(`/demo/validate-json?${params.toString()}`)
  }

  if (!json || !json.trim()) {
    params.set('error', 'JSON input is required')
    redirect(`/demo/validate-json?${params.toString()}`)
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (BACKEND_API_KEY) {
      headers['X-API-Key'] = BACKEND_API_KEY
    }

    const response = await fetch(`${BACKEND_API_URL}/validator/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        open_api_spec: schema,
        json_string: json,
        operation_id: operationId
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      params.set('error', error.error || 'Validation failed')
      redirect(`/demo/validate-json?${params.toString()}`)
    }

    const data = await response.json()
    const isValid = data.is_valid === true
    const errors = data.errors || []

    params.set('validated', 'true')
    params.set('valid', isValid.toString())
    if (errors.length > 0) {
      params.set('errors', JSON.stringify(errors))
    }
    redirect(`/demo/validate-json?${params.toString()}`)

  } catch (error) {
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error
    }
    params.set('error', 'Internal server error')
    redirect(`/demo/validate-json?${params.toString()}`)
  }
}

const EXAMPLE_JSON = `{
  "id": 123,
  "name": "Widget Pro",
  "price": "29.99",
  "inStock": "yes",
  "category": "electronics"
}`

const EXAMPLE_SCHEMA = `openapi: 3.0.0
info:
  title: Product API
  version: 1.0.0
paths:
  /products:
    post:
      operationId: createProduct
      summary: Create a new product
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Product'
    get:
      operationId: listProducts
      summary: List all products
components:
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
      properties:
        id:
          type: integer
        name:
          type: string
          minLength: 1
        price:
          type: number
        inStock:
          type: boolean
        category:
          type: string
          enum:
            - electronics
            - clothing
            - food`

export default function ValidateJsonPage({ searchParams }) {
  const errorMsg = searchParams?.error
  const validated = searchParams?.validated === 'true'
  const isValid = searchParams?.valid === 'true'
  const inputJson = searchParams?.json || ''
  const inputSchema = searchParams?.schema || ''
  const inputOperationId = searchParams?.operationId || ''

  let validationErrors = []
  if (searchParams?.errors) {
    try {
      validationErrors = JSON.parse(searchParams.errors)
    } catch {}
  }

  // Extract operations from schema for dropdown
  const operations = extractOperationIds(inputSchema)

  return (
    <main className="min-h-screen bg-brand-dark pt-24 pb-16">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GradientText>Schema Validator</GradientText>
            </h1>
            <p className="text-xl text-slate-300">
              Validate JSON against an OpenAPI schema. No JavaScript required.
            </p>
          </div>

          <div className="glass-card p-6">
            <form action={validateJson} method="POST">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Schema Input Panel */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="schema" className="block text-sm font-medium text-slate-300">
                      OpenAPI Schema (JSON or YAML)
                    </label>
                    <a
                      href={`/demo/validate-json?schema=${encodeURIComponent(EXAMPLE_SCHEMA)}&json=${encodeURIComponent(EXAMPLE_JSON)}`}
                      className="text-sm text-brand-purple hover:text-brand-blue transition-colors"
                    >
                      Load Example
                    </a>
                  </div>
                  <textarea
                    id="schema"
                    name="schema"
                    defaultValue={inputSchema}
                    placeholder="Paste your OpenAPI schema (JSON or YAML) here..."
                    className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
                    spellCheck={false}
                    required
                  />
                </div>

                {/* JSON Input Panel */}
                <div className="space-y-2">
                  <label htmlFor="json" className="block text-sm font-medium text-slate-300">
                    JSON to Validate
                  </label>
                  <textarea
                    id="json"
                    name="json"
                    defaultValue={inputJson}
                    placeholder="Paste your JSON here..."
                    className="w-full h-48 px-4 py-3 bg-brand-dark border border-white/10 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
                    spellCheck={false}
                    required
                  />
                </div>
              </div>

              {/* Operation ID Selection */}
              <div className="mt-4 space-y-2">
                <label htmlFor="operationId" className="block text-sm font-medium text-slate-300">
                  Operation ID
                </label>
                {operations.length > 0 ? (
                  <select
                    id="operationId"
                    name="operationId"
                    defaultValue={inputOperationId || operations[0]?.id}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    required
                  >
                    {operations.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.method} {op.path} - {op.id}{op.summary ? ` (${op.summary})` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="operationId"
                    name="operationId"
                    defaultValue={inputOperationId}
                    placeholder="Enter operation ID (e.g., createProduct)"
                    className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    required
                  />
                )}
                {operations.length === 0 && inputSchema.trim() && (
                  <p className="text-xs text-yellow-500">
                    Tip: Your OpenAPI spec needs paths with operationId fields. Enter the operation ID manually or update your schema.
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Validation Result */}
              {validated && (
                <div className={`mt-4 p-4 rounded-lg border ${
                  isValid
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isValid ? (
                      <>
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold text-green-400">Valid JSON</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-semibold text-red-400">Validation Errors</span>
                      </>
                    )}
                  </div>

                  {validationErrors.length > 0 && (
                    <ul className="space-y-2 mt-3">
                      {validationErrors.map((err, index) => (
                        <li key={index} className="text-sm text-red-300 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>
                            <code className="text-brand-cyan">{err.field}</code>: {err.error}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Validate
                </button>
                <a
                  href="/demo/validate-json"
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Clear
                </a>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <a
                href="/demo/fix-json"
                className="text-sm text-brand-cyan hover:text-brand-blue transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try JSON Fixer instead
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
