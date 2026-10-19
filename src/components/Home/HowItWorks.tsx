import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { setCurrentView } = useApp();

  const steps = [
    {
      number: '1',
      title: 'Skapa uppdrag',
      description: 'Ange adresser och vad som ska köras. Du ser fast pris direkt utan dolda avgifter.',
      icon: FileText,
    },
    {
      number: '2',
      title: 'Bud accepterar',
      description: 'Ett verifierat lokalt bud i närområdet tar uppdraget och bekräftar hämtningen.',
      icon: UserCheck,
    },
    {
      number: '3',
      title: 'Leverans vid dörren',
      description: 'Följ budet på kartan i realtid. Leveransen kvitteras tryggt och digitalt vid överlämning.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="hur-det-fungerar" className="py-12 sm:py-16 bg-[#f8f9fa] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Så fungerar HemBud
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-1.5">
            Snabb och trygg budkörning utan krångel eller abonnemang.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="app-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-sm flex items-center justify-center">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={() => {
              setCurrentView('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
          >
            <span>Kom igång – boka transport</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
