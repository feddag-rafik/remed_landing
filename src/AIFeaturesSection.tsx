import { Brain, FileCheck, Mic } from "lucide-react";

export function AIFeaturesSection() {
  return (
    <section id="ai" className="py-24  bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Brain className="h-5 w-5 mr-2" />
            Alimenté par l'intelligence artificielle
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            L'IA qui travaille pour vous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exploitez la technologie IA de pointe pour améliorer l'efficacité,
            réduire le temps de documentation et améliorer la qualité des soins
            aux patients.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Smart Transcriptions */}

          <div className="bg-white p-8 rounded-2xl shadow-lg  transition-all duration-300 border-gray-100">
            <div
              className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
              style={{ width: "100%" }}
            >
              
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 ">
              Transcrivez vos consultations
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Convertissez les notes vocales et les conversations avec les
              patients en dossiers médicaux précis et structurés. Économisez des
              heures de documentation avec la transcription alimentée par l'IA.
            </p>
            <div className="bg-blue-50 border-blue-200 p-6 rounded-xl">
              <div className="text-sm text-blue-800 font-medium mb-2">
                Entrée vocale :
              </div>
              <div className="text-sm text-gray-600 mb-3 italic">
                "Le patient signale des maux de tête depuis 3 jours, pas de
                fièvre, légères nausées..."
              </div>
              <div className="text-sm text-blue-800 font-medium mb-2">
                Sortie IA :
              </div>
              <div className="text-sm text-gray-800 bg-white p-3 rounded border">
                <strong>Motif principal :</strong> Maux de tête (3 jours)
                <br />
                <strong>Symptômes :</strong> Légères nausées
                <br />
                <strong>Signes vitaux :</strong> Pas de fièvre signalée
              </div>
            </div>
          </div>

          {/* AI Summaries */}
          <div className="bg-white p-8 rounded-2xl shadow-lg  transition-all duration-300 border-gray-100">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <FileCheck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Dictez vos compte rendus
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Générez automatiquement des résumés complets des visites patients,
              traitements et notes de progression. Obtenez les informations clés
              en un coup d'œil.
            </p>
            <div className="bg-emerald-50 p-6 rounded-xl">
              <div className="text-sm text-emerald-800 font-medium mb-3">
                Résumé auto-généré :
              </div>
              <div className="text-sm text-gray-800 bg-white p-4 rounded  space-y-2">
                <div>
                  <strong>Type de visite :</strong> Consultation de suivi
                </div>
                <div>
                  <strong>Statut :</strong> Symptômes en amélioration
                </div>
                <div>
                  <strong>Plan :</strong> Continuer le traitement actuel
                </div>
                <div>
                  <strong>Suivant :</strong> Suivi dans 2 semaines
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Assistance */}
          <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300  border-gray-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Posez vos questions à l'IA
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Obtenez des suggestions de diagnostic alimentées par l'IA et des
              insights cliniques pour soutenir votre processus de prise de
              décision. Accédez instantanément aux connaissances médicales.
            </p>
            <div className="bg-purple-50 border-purple-200 p-6 rounded-xl">
              <div className="text-sm text-purple-800 font-medium mb-3">
                Insight clinique IA :
              </div>
              <div className="text-sm text-gray-800 bg-white p-4 rounded space-y-2">
                <div>
                  <strong>Suggestion :</strong> Considérer le diagnostic
                  différentiel de migraine
                </div>
                <div>
                  <strong>Preuve :</strong> Le pattern de symptômes correspond
                </div>
                <div>
                  <strong>Recommandation :</strong> Évaluation neurologique
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
