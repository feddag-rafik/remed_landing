import { Clock, Shield, Users } from "lucide-react";
import { PiGear } from "react-icons/pi";

export function BenefitsSection() {
  return (
    <section
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PiGear className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Performance</h3>
            <p className="text-blue-100">
              Développez votre cabinet avec des flux de travail automatisés
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gain de temps</h3>
            <p className="text-blue-100">
              Réduisez le temps de documentation avec l'automatisation alimentée
              par l'IA
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Securité</h3>
            <p className="text-blue-100">
              Conforme HIPAA avec sécurité de niveau entreprise
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Facilité d'utilisation
            </h3>
            <p className="text-blue-100">
              Améliorez les soins aux patients avec des insights basés sur les
              données
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
