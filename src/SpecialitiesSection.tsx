"use client";

import { InViewStaggeredAnimation } from "./staggeredAnimation";
import { FaBaby, FaBrain, FaLungs, FaStethoscope } from "react-icons/fa";
import { FaHeartPulse, FaUserDoctor } from "react-icons/fa6";
import { GiStomach } from "react-icons/gi";

export default function SpecialitiesSection() {
  return (
    <section className="py-24  bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="center text-2xl md:text-3xl font-bold text-gray-900 mb-12"></h2>
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pour toutes les spécialités
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La plateforme REMED est adaptée à toutes les spécialités médicales
            et chirurgicales.
          </p>
        </div>
        <div className="specialitiesList gap15">
          <SpecialityCard
            index={0}
            title="Médecine-générale"
            icon={<FaStethoscope />}
          ></SpecialityCard>
          <SpecialityCard
            index={1}
            title="Cardiologie"
            icon={<FaHeartPulse />}
          ></SpecialityCard>
          <SpecialityCard
            index={4}
            title="Neurochirurgie"
            icon={<FaBrain />}
          ></SpecialityCard>

          <SpecialityCard
            index={5}
            title="Pédiatrie"
            icon={<FaBaby />}
          ></SpecialityCard>
          <SpecialityCard
            index={2}
            title="Pneumologie"
            icon={<FaLungs />}
          ></SpecialityCard>

          <SpecialityCard
            index={6}
            title="Gastro-entérologie"
            icon={<GiStomach />}
          ></SpecialityCard>
          <SpecialityCard
            index={7}
            title="+15 autres spécialités"
            icon={<FaUserDoctor />}
          ></SpecialityCard>
        </div>
      </div>
    </section>
  );
}

function SpecialityCard({
  index,
  title,
  icon,
}: {
  index: number;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <InViewStaggeredAnimation index={index}>
      <div
        className="card center c1 gap10 p20 tcenter"
        style={{ height: "100%" }}
      >
        <div className="p10 blueish br inline" style={{ fontSize: 25 }}>
          {icon}
        </div>
        <div className="f15 bold">{title}</div>
      </div>
    </InViewStaggeredAnimation>
  );
}
