import { Calculator } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegFolderOpen, FaUsersViewfinder } from "react-icons/fa6";
import { MdOutlineDocumentScanner } from "react-icons/md";
import dossierMedical from "./assets/dossier-screenshot2.png";
import ordonnance from "./assets/ordonnance-screenshot2.png";
import calendar from "./assets/calendar-screenshot1.png";
import accounting from "./assets/accounting-screenshot3.png";
import waitingRoom from "./assets/waiting-screenshot1.png";
import imaging from "./assets/imaging-screenshot1.png";
import FeatureCard from "./FeatureCard";


export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24  bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fonctionnalités de <span className="text-blue-600">REMED</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En plus des fonctionnalités d'intelligence artificielle, la plateforme REMED offre toutes les fonctionnalités nécessaires à la gestion de votre cabinet médical.
          </p>
        </div>

        <div className="c1" style={{ gap: "50px" }}>
          {/* Patient Records */}
          <FeatureCard
            imagePosition="left"
            color="blue"
            title="Dossier Patient"
            description="Accédez à l’historique médical complet de vos patients et centralisez toutes vos données en un seul endroit."
            icon={<FaRegFolderOpen  className="h-8 w-8 text-white" />}
            imageUrl={dossierMedical}
          />

          {/* Bookkeeping */}
          <FeatureCard
            imagePosition="right"
            color="green"
            title="Ordonnances personnalisées"
            description="Personnalisez facilement le design de vos ordonnances ainsi que tous vos documents médicaux"
            icon={<MdOutlineDocumentScanner  className="h-8 w-8 text-white" />}
            imageUrl={ordonnance}
          />

          {/* Bookkeeping */}
          <FeatureCard
            imagePosition="left"
            color="purple"
            title="Agenda"
            description="Organisez vos rendez-vous grâce à un agenda intuitif, ainsi qu'aux rappels automatiques par SMS à vos patients."
            icon={<FaRegCalendarAlt className="h-7 w-7 text-white" />}
            imageUrl={calendar}
          />

          {/* Bookkeeping */}
          <FeatureCard
            imagePosition="right"
            color="orange"
            title="Comptabilité intelligente"
            description="Simplifiez la gestion de votre activité avec un système de caisse complet, clair et facile à utiliser."
            icon={<Calculator className="h-8 w-8 text-white" />}
            imageUrl={accounting}
          />

          {/* Data Insights */}
          <FeatureCard
            imagePosition="left"
            color="pink"
            title="Gestion de la salle d'attente"
            description="Gérez efficacement votre salle d'attente avec un système de tickets et un affichage numérique en temps réel."
            icon={<FaUsersViewfinder  className="h-8 w-8 text-white" />}
              imageUrl={waitingRoom}
          />
          <FeatureCard
            imagePosition="right"
            color="red"
            title="Connexion avec appareils médicaux"
            description="Connectez votre ordinateur à vos appareils médicaux pour visualisez tous vos fichiers. (Ex: Echographie, Scanner, IRM etc.)."
            icon={<FaUsersViewfinder  className="h-8 w-8 text-white" />}
            imageUrl={imaging}
          />
        </div>
      </div>
    </section>
  );
}
