import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Marshal - The Logic Enforcer for the Agentic Era',
  description: 'Make AI outputs deterministic, reliable, and production-ready. Rule-based validation without LLM costs or hallucinations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-brand-dark text-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
