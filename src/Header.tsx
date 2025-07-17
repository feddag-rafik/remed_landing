import { Menu, Stethoscope, X } from "lucide-react";
import React from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">REMED</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Fonctionnalités
            </a>
            <a
              href="#ai"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Outils IA
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Témoignages
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Tarifs
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Se connecter
            </button> */}
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-medium shadow-lg shadow-blue-600/25">
              Télécharger
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Fonctionnalités
              </a>
              <a
                href="#ai"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Outils IA
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Témoignages
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Tarifs
              </a>
              <div className="pt-4 border-t space-y-3">
                <button className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Se connecter
                </button>
                <button className="block w-full bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  Essai gratuit
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 