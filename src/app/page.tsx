import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import BenefitsSection from '@/components/BenefitsSection'
import HowItWorksSection from '@/components/TechnologySection'
import ProductShowcase from '@/components/ProductShowcase'
import SportsSection from '@/components/SportsSection'
import TApexVs1080Section from '@/components/TApexVs1080Section'
import LocalTrustSection from '@/components/LocalTrustSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="bg-apex-black text-apex-white">
      <Navbar />

      {/* 01 — HERO / BIG PROMISE */}
      <Hero />

      {/* 02 — PROBLEM / PAIN */}
      <ProblemSection />

      {/* 03 — SOLUTION / PRODUCT INTRO */}
      <SolutionSection />

      {/* 04 — KEY BENEFITS */}
      <BenefitsSection />

      {/* 05 — HOW IT WORKS */}
      <HowItWorksSection />

      {/* 06 — PRODUCT / ENGINEERING */}
      <ProductShowcase />

      {/* 07 — BUILT FOR EVERY CODE */}
      <SportsSection />

      {/* 08 — MORE THAN A SPRINT RESISTANCE TOOL (T-Apex vs 1080) */}
      <TApexVs1080Section />

      {/* 09 — WHY T-APEX AUSTRALIA */}
      <LocalTrustSection />

      {/* 10 — FAQ */}
      <FAQSection />

      {/* 11 — FINAL CTA */}
      <FinalCTA />
    </main>
  )
}
