'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from './Container'
import Button from '../ui/Button'
import { authService } from '@/lib/auth'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated())

    const unsubscribe = authService.onAuthChange(() => {
      setIsAuthenticated(authService.isAuthenticated())
    })

    return unsubscribe
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setMobileMenuOpen(false)
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">Marshal</span>
            <span className="ml-2 text-sm text-slate-400">by Ladder Grid</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-slate-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="/docs/api-reference" className="text-slate-300 hover:text-white transition-colors">
              API Docs
            </a>
            <a href="/#demo" className="text-slate-300 hover:text-white transition-colors">
              Demo
            </a>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <a href="/#features" className="text-slate-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="/#demo" className="text-slate-300 hover:text-white transition-colors">
                Demo
              </a>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button size="sm" variant="secondary" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
