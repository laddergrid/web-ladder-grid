import Container from '../layout/Container'
import GradientText from '../ui/GradientText'

export default function Stats() {
  const stats = [
    {
      number: '< 1ms',
      label: 'Validation Latency',
      description: 'Sub-millisecond processing'
    },
    {
      number: '0',
      label: 'Additional LLM Calls',
      description: 'Zero extra API costs'
    },
    {
      number: '100%',
      label: 'Schema Compliance',
      description: 'Guaranteed type safety'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-brand-purple/5">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-2">
                <GradientText>{stat.number}</GradientText>
              </div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-slate-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
