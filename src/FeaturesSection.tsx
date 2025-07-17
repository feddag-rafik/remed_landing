import { BarChart3, Calculator, CheckCircle, FileText } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24  bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tout ce dont votre cabinet a besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des dossiers patients aux insights financiers, Remed fournit une
            suite complète d'outils conçus pour les professionnels de santé
            modernes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Records */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-blue-100">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Dossiers patients
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Gérez en toute sécurité les informations complètes des patients
              avec des dossiers numériques intuitifs. Accès rapide aux
              antécédents médicaux, rendez-vous et plans de traitement.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                Dossiers et historiques patients numériques
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                Système de planification des rendez-vous
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                Suivi des plans de traitement
              </div>
            </div>
          </div>

          {/* Bookkeeping */}
          <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-emerald-100">
            <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comptabilité intelligente
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Automatisez vos opérations financières avec une facturation
              intelligente et un suivi des dépenses. Concentrez-vous sur les
              soins aux patients pendant que nous gérons les chiffres.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                Facturation et facturation automatisées
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                Suivi et rapport des dépenses
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                Tableau de bord d'analyse financière
              </div>
            </div>
          </div>

          {/* Data Insights */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-purple-100">
            <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Insights médicaux
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Transformez les données médicales en insights exploitables.
              Suivez les résultats, identifiez les tendances et prenez des
              décisions basées sur les données pour de meilleurs soins.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                Tableau de bord d'analyse avancée
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                Suivi des résultats patients
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                Métriques de performance et tendances
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 