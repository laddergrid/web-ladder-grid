import { NextResponse } from 'next/server'

// TODO: Replace with your actual backend API URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, company, role, useCase } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Call your backend API here
    const response = await fetch(`${BACKEND_API_URL}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, company, role, useCase })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.message || 'Failed to join waitlist' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
