import { NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

export async function POST(request) {
  try {
    const { json } = await request.json()

    if (!json) {
      return NextResponse.json(
        { error: 'JSON input is required' },
        { status: 400 }
      )
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    if (BACKEND_API_KEY) {
      headers['X-API-Key'] = BACKEND_API_KEY
    }

    const response = await fetch(`${BACKEND_API_URL}/repair/fix-json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ json_to_fix: json })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.error || 'Failed to fix JSON' },
        { status: response.status }
      )
    }

    const data = await response.json()
    // Map backend response to frontend expected format
    return NextResponse.json({ fixed: data.fixed_json })

  } catch (error) {
    console.error('Fix JSON error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
