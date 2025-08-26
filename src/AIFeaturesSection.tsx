import { Brain } from "lucide-react";
import { AiChat } from "./AiChat";
import AiSummaryFeature from "./AiSummaryFeature";
import AiTranscriptionFeature from "./AiTranscriptionFeature";

export function AIFeaturesSection() {
  return (
    <section id="ai" className="py-24  bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Brain className="h-5 w-5 mr-2" />
            Alimenté par l'intelligence artificielle
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            L'IA travaille pour vous
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Votre assistant médical virtuel est à votre écoute et vous aide dans toutes vos tâches quotidiennes:
          </p>
        </div>

        <div className="c3 gap20 mc1">
            <AiTranscriptionFeature />
          
            <AiSummaryFeature />
          
            <AiChat />
   
        </div>
      </div>
    </section>
  );
}
