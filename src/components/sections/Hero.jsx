import Container from '../layout/Container'
import Button from '../ui/Button'
import GradientText from '../ui/GradientText'

export default function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/10 to-transparent" />

      <Container>
        <div className="text-center max-w-4xl mx-auto animate-fade-in relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
            <span className="text-sm">Now in Private Beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <GradientText>The Logic Enforcer</GradientText>
            <br />
            for the Agentic Era
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Make AI outputs deterministic, reliable, and production-ready.
            <br />
            Rule-based validation without LLM costs or hallucinations.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-semibold">
              &lt; 1ms Latency
            </div>
            <div className="px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-sm font-semibold">
              Zero LLM Costs
            </div>
            <div className="px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-sm font-semibold">
              100% Rule-Based
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={scrollToWaitlist}>
              Get Early Access
            </Button>
            <Button size="lg" variant="secondary">
              View Documentation
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
