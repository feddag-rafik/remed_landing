import { Clock, Shield } from "lucide-react";
import { FaRegHandPointer } from "react-icons/fa6";
import { PiGear } from "react-icons/pi";
import { InViewStaggeredAnimation } from "./staggeredAnimation";

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-24 bg-gradient-to-br"
      style={{
        background:
          "linear-gradient(to right, rgb(30, 49, 217), rgb(0, 153, 255))",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pourquoi choisir Remed ?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Rejoignez des milliers de professionnels de santé qui font confiance
            à Remed pour rationaliser leur cabinet et offrir des soins
            exceptionnels aux patients.
          </p>
        </div>

        <div className="mc1 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
          <BenefitCard
            index={0}
            title="Performance"
            description="Développez votre cabinet avec des flux de travail automatisés"
            icon={<PiGear className="h-10 w-10 text-white" />}
          />

          <BenefitCard
            index={1}
            title="Gain de temps"
            description="Réduisez le temps de documentation avec l'automatisation alimentée par l'IA"
            icon={<Clock className="h-10 w-10 text-white" />}
          />

          <BenefitCard
            index={2}
            title="Securité"
            description="Vos données sont chiffrées de bout en bout et sauvegardées automatiquement."
            icon={<Shield className="h-10 w-10 text-white" />}
          />

          <BenefitCard
            index={3}
            title="Facilité d'utilisation"
            description="Design intuitif et facile à utiliser sur tous PC, tablette et smartphone."
            icon={<FaRegHandPointer  className="h-10 w-10 text-white" />}
          />
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  index,
  title,
  description,
  icon,
}: {
  index: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <InViewStaggeredAnimation index={index}>
      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-blue-100">{description}</p>
      </div>
    </InViewStaggeredAnimation>
  );
}
