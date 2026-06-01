import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import BenefitsSection from '@/components/BenefitsSection'
import TechnologySection from '@/components/TechnologySection'
import DashboardSection from '@/components/DashboardSection'
import ProductShowcase from '@/components/ProductShowcase'
import WhoItsForSection from '@/components/WhoItsForSection'
import SportsSection from '@/components/SportsSection'
import LocalTrustSection from '@/components/LocalTrustSection'
import ComparisonSection from '@/components/ComparisonSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="bg-apex-black text-apex-white">
      <Navbar />

      {/* 01 — HERO / BIG PROMISE */}
      <Hero />

      {/* 02 — PROBLEM / PAIN OF THE CURRENT WAY */}
      <ProblemSection />

      {/* 03 — SOLUTION / PRODUCT INTRODUCTION */}
      <SolutionSection />

      {/* 04 — KEY BENEFITS / VALUE STACK */}
      <BenefitsSection />

      {/* 05 — HOW IT WORKS */}
      <TechnologySection />

      {/* 05b — LIVE TELEMETRY DASHBOARD (product proof) */}
      <DashboardSection />

      {/* 06 — PRODUCT / ENGINEERING / WHY IT'S DIFFERENT */}
      <ProductShowcase />

      {/* 07 — WHO IT'S FOR */}
      <WhoItsForSection />

      {/* 08 — SPORTS APPLICATIONS / BUILT FOR EVERY CODE */}
      <SportsSection />

      {/* 09 — WHY T-APEX AUSTRALIA / LOCAL TRUST */}
      <LocalTrustSection />

      {/* 10 — COMPARISON / WHY THIS IS DIFFERENT */}
      <ComparisonSection />

      {/* 11 — FAQ / OBJECTION HANDLING */}
      <FAQSection />

      {/* 12 — FINAL CTA / CLOSE */}
      <FinalCTA />
    </main>
  )
}
