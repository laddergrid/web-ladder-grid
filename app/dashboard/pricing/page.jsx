'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GradientText from '@/components/ui/GradientText';

export default function PricingPage() {
  return (
    <DashboardLayout user={null}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-brand-purple/20 border border-brand-purple/30 mb-4">
            <span className="text-brand-purple font-semibold text-sm">Public Beta</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Try <GradientText>Marshal API</GradientText> for Free
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We're currently in public beta. Get started with generous free credits and help us shape the future of our API.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="glass-card bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border-brand-purple/30 p-8 md:p-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Public Beta Access</h2>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-6xl font-bold">
                <GradientText>Free</GradientText>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
              <div className="text-5xl font-bold text-white mb-2">30,000</div>
              <div className="text-lg text-slate-300">API calls per month</div>
            </div>

            <div className="space-y-3 text-left mb-8 max-w-md mx-auto">
              <div className="flex items-start text-slate-200">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Full API access to all endpoints</span>
              </div>
              <div className="flex items-start text-slate-200">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-start text-slate-200">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Community support</span>
              </div>
              <div className="flex items-start text-slate-200">
                <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Help shape our product roadmap</span>
              </div>
            </div>

            <Link
              href="/dashboard/api-keys"
              className="inline-block w-full max-w-md mx-auto bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold py-4 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Your API Key
            </Link>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-brand-purple/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Start Building Today
            </h3>
            <p className="text-slate-400">
              Integrate our API into your application and start testing immediately. No waiting, no approval process.
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Your Feedback Matters
            </h3>
            <p className="text-slate-400">
              As a beta user, your input directly influences our features and pricing structure. Let us know what you need.
            </p>
          </div>
        </div>

        {/* Future Pricing Notice */}
        <div className="glass-card p-6 border-brand-cyan/30 bg-brand-cyan/5">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-3">
              What About Future Pricing?
            </h3>
            <p className="text-slate-300 mb-3">
              We're working on a pricing structure that's fair and transparent. During the public beta phase, enjoy unlimited access to help us refine our offerings.
            </p>
            <p className="text-sm text-brand-cyan">
              Early adopters will receive special benefits when we launch our paid tiers. Don't miss out!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
