import Container from '../layout/Container'
import GradientText from '../ui/GradientText'

export default function DemoSection() {
  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-brand-purple/5 to-transparent">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try It <GradientText>Live</GradientText>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience Marshal&apos;s capabilities in real-time. No signup required.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* JSON Fixer Card */}
          <a
            href="/demo/fix-json"
            className="glass-card p-8 hover:border-brand-purple/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-brand-purple transition-colors">
                JSON Fixer
              </h3>
            </div>
            <p className="text-slate-400 mb-6">
              Automatically repair malformed JSON with missing quotes, trailing commas,
              and other common syntax errors.
            </p>
            <div className="flex items-center gap-2 text-brand-cyan group-hover:text-brand-blue transition-colors">
              <span>Try it now</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Schema Validator Card */}
          <a
            href="/demo/validate-json"
            className="glass-card p-8 hover:border-brand-purple/50 transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-blue flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold group-hover:text-brand-cyan transition-colors">
                Schema Validator
              </h3>
            </div>
            <p className="text-slate-400 mb-6">
              Validate JSON against OpenAPI specifications. Supports both JSON and YAML
              schema formats.
            </p>
            <div className="flex items-center gap-2 text-brand-cyan group-hover:text-brand-blue transition-colors">
              <span>Try it now</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Note about security */}
        <p className="text-center text-sm text-slate-500 mt-8">
          All processing happens server-side. Your data is never stored. No JavaScript required.
        </p>
      </Container>
    </section>
  )
}
