import { Stethoscope } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mc1 grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Remed</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Facilitez la gestion de votre cabinet médical.<br/>
              Gérez vos dossiers patients, créez vos documents médicaux,
              automatisez votre comptabilité- le tout alimenté par
              l'intelligence artificielle.
            </p>
          </div>

          <div className="white">
            <h4 className="text-lg font-semibold mb-6">Produit</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="white">
                <a href="#" className="hover:text-white transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Outils IA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sécurité
                </a>
              </li>
              <li></li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>

          <div></div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Entreprise</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Carrières
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 Remed. Tous droits réservés. Conçu pour les
            professionnels de santé qui se soucient.
          </p>
        </div>
      </div>
    </footer>
  );
}
