import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />

      {/* Gradient divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)",
          maxWidth: 900,
          margin: "0 auto",
        }}
      />

      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
