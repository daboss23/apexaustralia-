import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PerformanceSection from '@/components/PerformanceSection'
import ProductShowcase from '@/components/ProductShowcase'
import TechnologySection from '@/components/TechnologySection'
import DashboardSection from '@/components/DashboardSection'
import SportsSection from '@/components/SportsSection'
import ResultsSection from '@/components/ResultsSection'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="bg-apex-black text-apex-white">
      <Navbar />
      <Hero />
      <PerformanceSection />
      <ProductShowcase />
      <TechnologySection />
      <DashboardSection />
      <SportsSection />
      <ResultsSection />
      <FinalCTA />
    </main>
  )
}
