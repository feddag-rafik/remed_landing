"use client";
import { ReactNode, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { InViewStaggeredAnimation } from "./staggeredAnimation";

export default function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="center text-2xl md:text-3xl font-bold text-gray-900 mb-12">
          Questions fréquentes
        </h2>
        <div className="c1 gap20">
          <ExpansionTile
            index={0}
            icon={<FaRegQuestionCircle className="h-5 w-5" />}
            title="Ai-je besoin d'une connexion internet ?"
            isInitalyExpanded={false}
          >
            Non, la plateforme REMED fonctionne entièrement hors ligne. Vous
            avez cependant besoin d&apos;une connexion internet si vous décidez
            d&apos;envoyer des notifications automatiques par SMS ou de garder
            une sauvegarde sécurisée au niveau du cloud.
          </ExpansionTile>
          <ExpansionTile
            index={1}
            icon={<FaRegQuestionCircle className="h-5 w-5" />}
            title="Puis-je créer un compte pour mon/ma secrétaire ?"
            isInitalyExpanded={false}
          >
            Oui, vous pouvez créer un compte pour votre secrétaire et travailler
            en collaboration en temps réel en réseau local
          </ExpansionTile>
          <ExpansionTile
            index={2}
            icon={<FaRegQuestionCircle className="h-5 w-5" />}
            title="Je travaille dans un cabinet de groupe, y a t'il une limite pour le nombre de comptes ?"
            isInitalyExpanded={false}
          >
            Non, il n&apos;y a pas de limite pour le nombre de comptes. Vous
            pouvez ajouter autant de comptes que vous le souhaitez.
          </ExpansionTile>
          <ExpansionTile
            index={2}
            icon={<FaRegQuestionCircle className="h-5 w-5" />}
            title="Combien de dossiers de patients puis-je créer ?"
            isInitalyExpanded={false}
          >
            Il n'y a pas de limite pour le nombre de dossiers de patients que
            vous pouvez créer.
          </ExpansionTile>
          <ExpansionTile
            index={2}
            icon={<FaRegQuestionCircle className="h-5 w-5" />}
            title="Mes données sont-elles sécurisées ?"
            isInitalyExpanded={false}
          >
            La plateforme REMED utilise un système de chiffrement de bout en
            bout pour sécuriser vos données, ainsi qu'un système de sauvegarde
            en local pour vous permettre de récupérer vos données en cas de
            problème.
          </ExpansionTile>
        </div>
      </div>
    </section>
  );
}

export function ExpansionTile({
  title,
  index,
  children,
  icon,
  isInitalyExpanded,
}: {
  title: ReactNode;
  index: number;
  children: ReactNode;
  icon: ReactNode;
  isInitalyExpanded: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(isInitalyExpanded || false);

  return (
    <InViewStaggeredAnimation index={index}>
      <div
        onClick={async () => {
          setIsExpanded(!isExpanded);
        }}
        className={` expansionTile ${isExpanded ? "expanded" : ""} p10`}
      >
        <div
          className="expansionTileHeader"
          style={{ gridTemplateColumns: " 1fr auto" }}
        >
          <div className="bold">
            {" "}
            <div className="cauto-1 gap10 acenter">
              {icon}
              <div className="bold">{title}</div>
            </div>
          </div>
          {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
        </div>
        <div className="expansionTileContent">
          <div className="grid c1 gap10 p10 ">{children}</div>
        </div>
      </div>
    </InViewStaggeredAnimation>
  );
}
