import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PerformanceSection from '@/components/PerformanceSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import BenefitsSection from '@/components/BenefitsSection'
import HowItWorksSection from '@/components/TechnologySection'
import ProductShowcase from '@/components/ProductShowcase'
import DashboardSection from '@/components/DashboardSection'
import SportsSection from '@/components/SportsSection'
import TApexVs1080Section from '@/components/TApexVs1080Section'
import ResultsSection from '@/components/ResultsSection'
import LocalTrustSection from '@/components/LocalTrustSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="bg-apex-black text-apex-white">
      <Navbar />

      {/* 01 — HERO / BIG PROMISE */}
      <Hero />

      {/* 02 — PERFORMANCE IN MOTION */}
      <PerformanceSection />

      {/* 03 — PROBLEM / PAIN */}
      <ProblemSection />

      {/* 04 — SOLUTION / PRODUCT INTRO */}
      <SolutionSection />

      {/* 05 — KEY BENEFITS */}
      <BenefitsSection />

      {/* 06 — HOW IT WORKS */}
      <HowItWorksSection />

      {/* 07 — PRODUCT / ENGINEERING */}
      <ProductShowcase />

      {/* 08 — LIVE PERFORMANCE DASHBOARD / TELEMETRY */}
      <DashboardSection />

      {/* 09 — BUILT FOR EVERY CODE (multi-sport transition) */}
      <SportsSection />

      {/* 10 — MORE THAN A SPRINT RESISTANCE TOOL (T-Apex vs 1080) */}
      <TApexVs1080Section />

      {/* 11 — ENGINEERED RESULTS / PROOF */}
      <ResultsSection />

      {/* 12 — WHY T-APEX AUSTRALIA */}
      <LocalTrustSection />

      {/* 13 — FAQ */}
      <FAQSection />

      {/* 14 — FINAL CTA */}
      <FinalCTA />
    </main>
  )
}
