import { useEffect, useState } from "react";

function MiniCompteRendu() {
  return (
    <div>
      <div
        className="c1 gap20"
        style={{
          background: "white",
          width: "450px",
          zoom: "0.5",
        }}
      >
        <div
          className="c3 gap10 "
          style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "10px" }}
        >
          <div className="double">
            <div className="bold">
              Cabinet Spécialisé en cardiologie pédiatrique
            </div>
            <div>Dr L. HAMRAOUI</div>
            <div className="gray">21 lotissement des Lilas, Cheraga</div>
          </div>
        </div>
        <div className="c2 " style={{ gap: "0px 15px" }}>
          <GridItem label="Nom" value="Patient" />
          <GridItem label="Prénom" value="Test 22" />
          <GridItem label="Naiss." value="01/01/2000" />
          <GridItem label="Sexe" value="Féminin" />
          <GridItem label="Tel." value="06 00 00 00 00" />
          <GridItem label="Adresse" value={<div>Cheraga, Alger</div>} />
        </div>

        <div className="bold center f20">Compte rendu</div>
        <AnimatedCompteRendu />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}

function GridItem({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70px 1fr",
        gap: "5px",
      }}
    >
      <div className="gray">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function AnimatedCompteRendu() {
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
  const str = `Patiente âgée de 12 ans, consulte pour la prise en charge d'un bloc auriculo-ventriculaire (BAV) complet à QRS fins, avec une fréquence ventriculaire moyenne (FVM) à 49 bpm, révélée par une asthénie persistante.</br> </br> <strong>Antécédents et facteurs de risque:</strong><br/>- Diabète de type 1<br/> - Hypothyroïdie (traitée par Levothyrox)<br/>
      <br/>- Hypertension artérielle (10 ans, sous Exforge 10/160)<br/>`;

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
      className="animated-text"
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

export default MiniCompteRendu;
