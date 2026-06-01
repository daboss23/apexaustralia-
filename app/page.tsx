import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Telemetry from "@/components/Telemetry";
import HowItWorks from "@/components/HowItWorks";
import ProductShowcase from "@/components/ProductShowcase";
import Dashboard from "@/components/Dashboard";
import SportSelector from "@/components/SportSelector";
import AustralianPerformance from "@/components/AustralianPerformance";
import SocialProof from "@/components/SocialProof";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main className="relative">
        <Hero />
        <Telemetry />
        <HowItWorks />
        <ProductShowcase />
        <Dashboard />
        <SportSelector />
        <AustralianPerformance />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
