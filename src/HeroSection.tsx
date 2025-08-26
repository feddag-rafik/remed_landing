import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { BiMicrophone } from "react-icons/bi";
import heroImage from "./assets/c4e5c6b2-86c3-4d0d-bf6a-df96f4ea97f72.png";
import { InViewStaggeredAnimation } from "./staggeredAnimation";
// hello
export function HeroSection() {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">
        <div className=" mc1 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Brain className="h-4 w-4 mr-2" />
              Solution de gestion de cabinets médicaux alimentée par l'IA
            </div> */}

            <InViewStaggeredAnimation index={0}>
              <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Rejoignez la révolution IA avec
                <span className="text-blue-600 "> REMED </span>
              </h1>
            </InViewStaggeredAnimation>
            <InViewStaggeredAnimation index={1}>
              <h1 className="text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-gray-900 mb-8 leading-tight">
                Gérez vos dossiers patients, créez vos documents médicaux,
                automatisez votre comptabilité- le tout alimenté par
                l'intelligence artificielle.
              </h1>
            </InViewStaggeredAnimation>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
              <InViewStaggeredAnimation index={2}>
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-600/25 flex items-center">
                  Télécharger maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </InViewStaggeredAnimation>
              <InViewStaggeredAnimation index={3}>
                <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-semibold">
                  <div className="bg-white shadow-lg rounded-full p-3 mr-3 hover:shadow-xl transition-shadow">
                    <Play className="h-5 w-5 text-blue-600" />
                  </div>
                  Voir la démo
                </button>
              </InViewStaggeredAnimation>
            </div>

            <InViewStaggeredAnimation index={5}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  Essai gratuit de 14 jours
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  Licence d'utilisation à vie
                </div>
              </div>
            </InViewStaggeredAnimation>
          </div>

          {/* Hero Image */}
          <InViewStaggeredAnimation index={1} className="staggered2">
            <div className="relative">
              <div className="  ">
                <img
                  src={heroImage}
                  alt="Interface de transcription IA Remed montrant la conversion de notes vocales en dossiers médicaux structurés"
                  className="w-full h-auto "
                  style={{ borderRadius: "50px" }}
                />
              </div>
              {/* Floating elements for visual appeal */}
                <MicrophoneAnimation />
                <MockupAnimation />
            </div>
          </InViewStaggeredAnimation>
        </div>
      </div>
    </section>
  );
}

function MicrophoneAnimation() {
  return (
    <div
      className="absolute bg-blue-600 text-white p-3 rounded-xl shadow-lg"
      style={{
        top: "-20px",
        left: "47%",
        display: "grid",
        height: "70px",
        placeItems: "center",
        gridTemplateColumns: "auto repeat(7, 1fr)",
      }}
    >
      <BiMicrophone className="h-7 w-7" />
      <div className="animatedLine pulse1"></div>
      <div className="animatedLine pulse2"></div>
      <div className="animatedLine pulse3"></div>
      <div className="animatedLine pulse2"></div>
      <div className="animatedLine pulse3"></div>
      <div className="animatedLine pulse4"></div>
      <div className="animatedLine pulse2"></div>
    </div>
  );
}

function MockupAnimation() {
  return (
    <div
      className="absolute bg-white text-white p-3 rounded-xl "
      style={{
        bottom: "20%",
        right: "-70px",
        width: "150px",
        boxShadow: "10px 10px 10px 0px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="pulseopacity1">
        <div className="mockupLine mockupLine1"></div>
      </div>
      <div className="pulseopacity1">
        <div className="mockupLine mockupLine2"></div>
      </div>
      <div className="pulseopacity1">
        <div className="mockupLine mockupLine3"></div>
      </div>
      <div className="pulseopacity1">
        <div className="mockupLine mockupLine4"></div>
      </div>
    </div>
  );
}
