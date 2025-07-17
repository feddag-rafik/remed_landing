import { AIFeaturesSection } from "./AIFeaturesSection";
import { BenefitsSection } from "./BenefitsSection";
import { CTASection } from "./CTASection";
import { FeaturesSection } from "./FeaturesSection";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { TestimonialsSection } from "./TestimonialsSection";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection />
      <BenefitsSection />
      <AIFeaturesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
