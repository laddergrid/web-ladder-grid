import Container from '../layout/Container'
import Button from '../ui/Button'
import Input from '../ui/Input'
import useWaitlistForm from '../../hooks/useWaitlistForm'

export default function Waitlist() {
  const { formData, status, errorMessage, handleChange, handleSubmit } = useWaitlistForm()

  return (
    <section id="waitlist" className="py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Early Access
            </h2>
            <p className="text-xl text-slate-300">
              Join developers building reliable AI agents
            </p>
          </div>

          {status === 'success' ? (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
              <p className="text-slate-300">
                We'll reach out soon with early access details.
              </p>
            </div>
          ) : (
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name *"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
                    >
                      <option value="">Select a role</option>
                      <option value="developer">Developer</option>
                      <option value="engineering-manager">Engineering Manager</option>
                      <option value="cto">CTO</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Use Case (Optional)
                  </label>
                  <textarea
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your AI agent use case..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Submitting...' : 'Join Waitlist'}
                  </Button>
                  <p className="text-sm text-slate-400 text-center mt-4">
                    We respect your privacy. No spam, ever.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
