import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Stats from './components/sections/Stats'
import Waitlist from './components/sections/Waitlist'

function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Waitlist />
      </main>
      <Footer />
    </div>
  )
}

export default App
