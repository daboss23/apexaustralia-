import Navbar from '@/components/Navbar'
import TelemetryLine from '@/components/TelemetryLine'
import Hero from '@/components/Hero'
import PerformanceSection from '@/components/PerformanceSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import BenefitsSection from '@/components/BenefitsSection'
import ComparisonSection from '@/components/ComparisonSection'
import HowItWorksSection from '@/components/TechnologySection'
import ProductShowcase from '@/components/ProductShowcase'
import DeviceStructureSection from '@/components/DeviceStructureSection'
import DashboardSection from '@/components/DashboardSection'
import DataInsightsSection from '@/components/DataInsightsSection'
import SportsSection from '@/components/SportsSection'
import TApexVs1080Section from '@/components/TApexVs1080Section'
import ResultsSection from '@/components/ResultsSection'
import LocalTrustSection from '@/components/LocalTrustSection'
import FAQSection from '@/components/FAQSection'
import WhatsIncludedSection from '@/components/WhatsIncludedSection'
import CheckoutSection from '@/components/CheckoutSection'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="bg-apex-black text-apex-white">
      <Navbar />

      {/* Scroll telemetry rail — fixed session-progress line with sector gates (xl+) */}
      <TelemetryLine />

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

      {/* 07b — DEVICE STRUCTURE / ANATOMY */}
      <DeviceStructureSection />

      {/* 08 — LIVE PERFORMANCE DASHBOARD / TELEMETRY */}
      <DashboardSection />

      {/* 08b — DATA-DRIVEN INSIGHTS */}
      <DataInsightsSection />

      {/* 09 — BUILT FOR EVERY CODE (multi-sport transition) */}
      <SportsSection />

      {/* 10 — THE COMPARISON
            a) Intelligence (blue) section = strategic framing (category, philosophy, ARI)
            b) Red table = visual proof / quick-scan comparison directly beneath */}
      <TApexVs1080Section />
      <ComparisonSection />

      {/* 11 — ENGINEERED RESULTS / PROOF */}
      <ResultsSection />

      {/* 12 — WHY T-APEX AUSTRALIA */}
      <LocalTrustSection />

      {/* 13 — FAQ */}
      <FAQSection />

      {/* 13b — WHAT'S INCLUDED / PACKAGE */}
      <WhatsIncludedSection />

      {/* 13c — ORDER / CHECKOUT (inline product + buy experience) */}
      <CheckoutSection />

      {/* 14 — FINAL CTA */}
      <FinalCTA />
    </main>
  )
}
