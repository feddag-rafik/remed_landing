import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-36 sm:py-32 overflow-hidden cta-section relative">
      <div
        className="absolute "
        style={{
          background: "linear-gradient(to right, rgba(0, 60, 255, 0.8), rgba(0, 169, 230, 0.8))",
          width: "100%",
          height: "100%",
          zIndex: 1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
      {/* Background image with parallax effect */}

      {/* Gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-purple-500/85 to-blue-600/90" /> */}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à transformer votre cabinet ?
        </h2>
        <p className="text-xl text-gray-100 mb-12">
          Rejoignez des milliers de professionnels de santé qui utilisent déjà
          Remed pour offrir des soins exceptionnels aux patients avec la
          puissance de l'IA.
        </p>

        <div className="mc1 grid grid-cols-2 gap-6 justify-center items-center mb-8">
          <button className="center c1-auto bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl shadow-black/20 flex items-center">
            Téléchargez maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all">
            Voir la démonstration
          </button>
        </div>

      
      </div>
    </section>
  );
}
