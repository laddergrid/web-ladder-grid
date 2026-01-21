import { NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

export async function POST(request) {
  try {
    const { json, schema, operationId } = await request.json()

    if (!json) {
      return NextResponse.json(
        { error: 'JSON input is required' },
        { status: 400 }
      )
    }

    if (!schema) {
      return NextResponse.json(
        { error: 'OpenAPI schema is required' },
        { status: 400 }
      )
    }

    if (!operationId) {
      return NextResponse.json(
        { error: 'Operation ID is required' },
        { status: 400 }
      )
    }

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
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.error || 'Validation failed' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Backend response:', JSON.stringify(data, null, 2))

    // Map backend response to frontend expected format
    // Backend returns: { field, error } -> Frontend expects: { path, message }
    const mappedErrors = data.errors?.map(err => ({
      path: err.field,
      message: err.error
    })) || []

    // Explicitly convert to boolean - if is_valid is undefined, treat as invalid
    const isValid = data.is_valid === true

    return NextResponse.json({
      valid: isValid,
      errors: mappedErrors
    })

  } catch (error) {
    console.error('Validate JSON error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
