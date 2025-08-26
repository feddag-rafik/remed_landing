import { useEffect, useState } from "react";
import { InViewStaggeredAnimation } from "./staggeredAnimation";

export function AiChat() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300  border-gray-100">
      <InViewStaggeredAnimation index={3}>
        <div
          className="bg-gradient-to-br from-purple-500 to-purple-600  rounded-2xl"
          style={{
            width: "100%",
            display: "grid",
            placeItems: "end",
            height: "290px",
            padding: "25px 25px 0px 25px",
            overflow: "hidden",
          }}
        >
          <div
            className="br c1 gap10 white-bg p20"
            style={{
              borderRadius: "20px 20px 0px 0px",
              width: "100%",
              height: "100%",
              gridTemplateColumns: "auto",
            }}
          >
            <div>
              <div className="bold center mbottom10"> Chat</div>
              <div
                className="br blue-bg white p10 mbottom10"
                style={{ fontSize: "10px", marginLeft: "50px" }}
              >
                Quelles sont les intéractions médicamenteuses possibles pour ce
                patient ?
              </div>
              <div>
                <AiChatBubble />
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 mtop20 tcenter">
          Posez vos questions à l'IA
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Discutez avec l'IA et obtenez des informations sur votre patient, des
          recommandations cliniques, des suggestions diagnostiques, des
          intéractions médicamenteuses, etc.
        </p>
        {/* <div className="bg-purple-50 border-purple-200 p-6 rounded-xl">
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
        </div> */}
      </InViewStaggeredAnimation>
    </div>
  );
}

function AiChatBubble() {
  const [html, setHtml] = useState("");
  const [index, setIndex] = useState(0);
  {
    /* <br /> -Cholécystectomie en 2013
        <br /> -Pleurésie non documentée en cours d'exploration (fibroscopie
        bronchique sans anomalie)
        <br />
        <br />
        <div className="bold">Histoire de la maladie:</div>
        Après avoir consulté pour des palpitations
        et avoir été mise sous bêta-bloquants et flécaïne, la patiente a développé
        une asthénie persistante. Les traitements ont été arrêtés, mais le BAV
        complet a été confirmé par Holter ECG, conduisant à son admission. */
  }
  const str = ` <strong>Antécédents et facteurs de risque:</strong><br/> - Diabète de type 1<br/> - Hypothyroïdie (traitée par Levothyrox)<br/>`;

  const array = str.split(" ");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (index > array.length) {
        setIndex(0);
        return;
      }

      const lastWord = `<span >${array[index]}</span>`;
      setHtml(`${array.slice(0, index).join(" ")} ${lastWord}`);
      setIndex((index) => index + 1);
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [index]);

  return (
    <div
      className="  text-white p-3 rounded-xl "
      style={{
        bottom: "20%",
        background: "RGBA(0, 0, 0, 0.1)",
        marginRight: "40px",
        fontSize: "11px",
        color: "black",
        // boxShadow: "10px 10px 10px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="animated-text"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
}
