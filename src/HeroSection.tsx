import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { BiMicrophone } from "react-icons/bi";
import heroImage from "./assets/c4e5c6b2-86c3-4d0d-bf6a-df96f4ea97f72.png";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Brain className="h-4 w-4 mr-2" />
              Solution de gestion de cabinets médicaux alimentée par l'IA
            </div> */}

            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Rejoignez la révolution IA avec
              <span className="text-blue-600 "> REMED </span>
            </h1>
            <h1 className="text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-gray-900 mb-8 leading-tight">
              Gérez vos dossiers patients, créez vos documents médicaux,
              automatisez votre comptabilité- le tout alimenté par
              l'intelligence artificielle.
            </h1>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-blue-600/25 flex items-center">
                Télécharger maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-semibold">
                <div className="bg-white shadow-lg rounded-full p-3 mr-3 hover:shadow-xl transition-shadow">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                Voir la démo
              </button>
            </div>

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
          </div>

          {/* Hero Image */}
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
            <style>
              {`
                .animatedLine {
                  align-items: center;
                  display: inline-block;
                  height: 10px;
                  border-radius: 5px;
                  margin:2px;
                  width:3px;
                  background-color: white;
                }

                .pulse1 {
                  animation: pulse1 1s infinite;
                }

                @keyframes pulse1 {
                  0% {
                    height:20px;
                    opacity: 0.7;
                  }
                  50% {
                      height:13px;
                      opacity: 1;
                    }
                  100% {
                    height:20px;
                    opacity: 0.7;
                  }
                }

                .pulse2 {
                  animation: pulse2 1.2s infinite;
                } 

                @keyframes pulse2 {
                  0% {
                    height:25px;
                    opacity: 0.7;
                  }
                  50% { 
                    height:12px;
                    opacity: 1;
                  }
                  100% {
                    height:25px;
                    opacity: 0.7;
                  }
                }

                .pulse3 {
                  animation: pulse3 1.4s infinite;
                }

                @keyframes pulse3 {
                  0% {
                    height:23px;
                    opacity: 0.7;
                  }
                  50% { 
                    height:18px;
                    opacity: 1;
                  }
                  100% {
                    height:23px;
                    opacity: 0.7;
                  }
                }

                .mockupLine {
                  height: 10px;
                  width: 100%;
                  background-color: RGBA(0, 0, 0, 0.2);
                  border-radius: 5px;
                  margin:8px 2px;
                  animation: lineAnimation 3s infinite;
                }

                .mockupLine1{
                  animation: lineAnimation1 4s infinite;
                }
                .mockupLine2{
                  animation: lineAnimation2 4s infinite;
                }
                .mockupLine3{
                  animation: lineAnimation3 4s infinite;
                }
                .mockupLine4{
                  animation: lineAnimation4 4s infinite;
                }


                .pulseopacity1{
                  animation: pulseopacity1 1s infinite;
                }
                .pulseOpacity2{
                  animation: pulseOpacity2 1s infinite;
                }

                @keyframes pulseopacity1 {
                  0% {opacity: 0.7;}
                  50% { opacity: 1;}
                  100% {opacity: 0.7;}
                }
          


              


                @keyframes lineAnimation1 {
                  0% {width:0%;}
                  20% { width:100%;}
                  100% { width:100%;}
                }
                @keyframes lineAnimation2 {
                  0% {width:0%;}
                  20% { width:0%;}
                  40% { width:100%;}
                  100% { width:100%;}
                }
                @keyframes lineAnimation3 {
                  0% {width:0%;}
                  40% { width:0%;}
                  60% { width:100%;}
                  100% { width:100%;}
                }
                @keyframes lineAnimation4 {
                  0% {width:0%;}
                  60% { width:0%;}
                  80% { width:70%;}
                  100% { width:70%;}
                }
                
              `}
            </style>
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
          </div>
        </div>
      </div>
    </section>
  );
}
