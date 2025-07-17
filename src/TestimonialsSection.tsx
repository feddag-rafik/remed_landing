import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Approuvé par les professionnels de santé
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment Remed transforme les cabinets et améliore les
            soins aux patients à travers le pays.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              "Remed a complètement transformé notre cabinet. La transcription
              IA nous fait économiser plus de 3 heures par jour, et les
              insights nous aident à fournir de meilleurs soins aux patients."
            </p>
            <div className="flex items-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                FK
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Dr. FEDDAG Khider
                </div>
                <div className="text-gray-600 text-sm">
                  Pneumologue
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border border-emerald-100">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              "La fonctionnalité de comptabilité automatisée change la donne.
              Notre facturation est maintenant fluide, et nous pouvons nous
              concentrer entièrement sur les soins aux patients au lieu de la
              paperasse."
            </p>
            <div className="flex items-center">
              <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                BL
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Dr. BENBADA Lamia
                </div>
                <div className="text-gray-600 text-sm">Cardiologue</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              "L'assistance au diagnostic et les insights de données ont
              considérablement amélioré nos résultats cliniques. C'est comme
              avoir un assistant de recherche médicale intégré."
            </p>
            <div className="flex items-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4">
                HL
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Dr. HAMRAOUI Lynda
                </div>
                <div className="text-gray-600 text-sm">
                  Pédiatre
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 