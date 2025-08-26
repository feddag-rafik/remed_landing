import { AIFeaturesSection } from "./AIFeaturesSection";
import { BenefitsSection } from "./BenefitsSection";
import ContactForm from "./ContactForm";
import { CTASection } from "./CTASection";
import FaqSection from "./FaqSection";
import { FeaturesSection } from "./FeaturesSection";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import SpecialitiesSection from "./SpecialitiesSection";
import { TestimonialsSection } from "./TestimonialsSection";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <AIFeaturesSection />
      <FeaturesSection />
      <SpecialitiesSection />
      <TestimonialsSection />
      <FaqSection />
      <CTASection />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
