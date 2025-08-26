import MiniCompteRendu from "./MiniCompteRendu";
import { InViewStaggeredAnimation } from "./staggeredAnimation";

function AiSummaryFeature() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg  transition-all duration-300 border-gray-100">
      <InViewStaggeredAnimation index={0}>
        <div
          className="bg-gradient-to-br from-emerald-500 to-emerald-600  rounded-2xl"
          style={{
            width: "100%",
            display: "grid",
            height: "280px",
            placeItems: "end",
            padding: "25px 25px 0px 25px",
            overflow: "hidden",
          }}
        >
          <div
            className="br c1 gap10 white-bg p20"
            style={{
              borderRadius: "20px 20px 0px 0px",
              width: "100%",
            }}
          >
            <MiniCompteRendu />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 mtop20 tcenter">
          Générez vos compte rendus
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          L'IA synthétise toutes les données de vos patients et génère un compte
          rendu complet et structuré instantanément.
        </p>
      </InViewStaggeredAnimation>
    </div>
  );
}

export default AiSummaryFeature;
