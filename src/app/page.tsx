import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import BenefitsSection from '@/components/BenefitsSection'
import TechnologySection from '@/components/TechnologySection'
import WhoItsForSection from '@/components/WhoItsForSection'
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

      {/* 02 — PROBLEM / PAIN OF THE CURRENT WAY */}
      <ProblemSection />

      {/* 03 — SOLUTION / WHAT T-APEX IS */}
      <SolutionSection />

      {/* 04 — KEY BENEFITS / VALUE STACK */}
      <BenefitsSection />

      {/* 05 — HOW IT WORKS */}
      <TechnologySection />

      {/* 06 — WHO IT'S FOR */}
      <WhoItsForSection />

      {/* 07 — BUILT FOR EVERY CODE */}
      <SportsSection />

      {/* 08 — T-APEX VS 1080 SPRINT / WHY IT'S DIFFERENT */}
      <TApexVs1080Section />

      {/* 09 — WHY T-APEX AUSTRALIA / LOCAL TRUST */}
      <LocalTrustSection />

      {/* 10 — FAQ / OBJECTION HANDLING */}
      <FAQSection />

      {/* 11 — FINAL CTA / CLOSE */}
      <FinalCTA />
    </main>
  )
}
