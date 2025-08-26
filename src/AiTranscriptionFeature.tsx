import MicrophoneAnimation from "./MicrophoneAnimation";
import { InViewStaggeredAnimation } from "./staggeredAnimation";

function AiTranscriptionFeature() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg  transition-all duration-300 border-gray-100">
      <InViewStaggeredAnimation index={1}>
        <div
          className="bg-gradient-to-br from-blue-500 to-blue-600  rounded-2xl"
          style={{
            width: "100%",
            display: "grid",
            placeItems: "center",
            padding: "20px 20px 0px 20px",
          }}
        >
          <div
            className="br c1 gap10 white-bg p20"
            style={{
              borderRadius: "20px 20px 0px 0px",
              width: "100%",
            }}
          >
            <MicrophoneAnimation />
            <div className="c1 gap5 " style={{ width: "100%" }}>
              <div
                className=" staggered"
                style={{ "--i": 0, fontSize: "11px" } as React.CSSProperties}
              >
                Motif de consultation
              </div>
              <div
                className="br p5 blueish staggered"
                style={{ "--i": 1 } as React.CSSProperties}
              >
                <div className="card-title">Douleur thoracique</div>
              </div>
              <div
                className="staggered "
                style={{ "--i": 2, fontSize: "11px" } as React.CSSProperties}
              >
                Antécédents
              </div>
              <div
                className="c1 gap10 staggered"
                style={{ "--i": 3 } as React.CSSProperties}
              >
                <div
                  className="br p5 blueish staggered"
                  style={{ "--i": 4 } as React.CSSProperties}
                >
                  <div className="card-title">HTA</div>
                </div>
                <div
                  className="br p5 blueish staggered"
                  style={{ "--i": 5 } as React.CSSProperties}
                >
                  <div className="card-title">
                    Diabète <span className="gray normal">Type 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4  mtop20 tcenter">
          Dictez vos données patient
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Par la voix, saisissez toutes les données de vos consultations: Motif,
          Antécédents, Examen clinique, ordonnances, rendez-vous, etc.
        </p>
      </InViewStaggeredAnimation>
    </div>
  );
}

export default AiTranscriptionFeature;
