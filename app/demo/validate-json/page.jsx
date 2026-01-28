import { redirect } from 'next/navigation'
import yaml from 'js-yaml'
import Container from '@/components/layout/Container'
import GradientText from '@/components/ui/GradientText'
import ValidateJsonForm from './ValidateJsonForm'

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
            <ValidateJsonForm
              action={validateJson}
              inputJson={inputJson}
              inputSchema={inputSchema}
              inputOperationId={inputOperationId}
              errorMsg={errorMsg}
              validated={validated}
              isValid={isValid}
              validationErrors={validationErrors}
              operations={operations}
              EXAMPLE_JSON={EXAMPLE_JSON}
              EXAMPLE_SCHEMA={EXAMPLE_SCHEMA}
            />

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
