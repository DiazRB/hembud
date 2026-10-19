import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Clock, CreditCard, ShoppingBag, Truck, Headphones } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FaqItem {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

export const FaqSection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default for discoverability

  const faqs: FaqItem[] = [
    {
      category: 'Tjänster',
      icon: ShoppingBag,
      question: 'Hur fungerar köphjälp från Blocket, Tradera eller Marketplace?',
      answer: 'Budet åker direkt till säljaren, kontrollerar varans skick enligt dina önskemål och fraktar den hem till din dörr. Du slipper själv hyra släp eller åka tvärs över stan. Vid överenskommelse kan budet även hjälpa till att kontrollera kvitton eller varans funktion innan lastning.'
    },
    {
      category: 'Tid & Leverans',
      icon: Clock,
      question: 'Hur snabbt kan ett bud hämta och leverera?',
      answer: 'Våra anslutna bud är aktiva i närområdet och uppdrag accepteras oftast inom 2–10 minuter. Beroende på avstånd hämtas godset oftast inom 30–60 minuter från bokning, eller på den specifika tidpunkt du själv schemalägger i bokningsguiden.'
    },
    {
      category: 'Pris & Betalning',
      icon: CreditCard,
      question: 'Hur sätts priset och tillkommer det några dolda avgifter?',
      answer: 'Nej, du ser alltid ett garanterat fast pris innan du bekräftar. Vår prismodell är 100% transparent: budets intäkt och HemBuds serviceavgift är tydligt separerade. Priset baseras på distans och paketstorlek – inga extra milersättningar eller dolda helgpåslag.'
    },
    {
      category: 'Trygghet & Skydd',
      icon: ShieldCheck,
      question: 'Är transporten och godset försäkrat?',
      answer: 'Ja, alla transporter via HemBud omfattas av vår trygghetsförsäkring. Dessutom är samtliga bud och beställare BankID-verifierade med kontrollerad identitet, och leveransen kvitteras digitalt med tidsstämpel och geo-loggning.'
    },
    {
      category: 'Bärhjälp & Storlek',
      icon: Truck,
      question: 'Kan jag få hjälp att bära upp tunga möbler eller paket?',
      answer: 'Ja! I bokningsflödet kryssar du enkelt i "Bärhjälp". Då matchas uppdraget med bud som har passande fordon (t.ex. skåpbil) och fysisk kapacitet att hjälpa till med inbärning hela vägen in i bostaden.'
    },
    {
      category: 'Bud & Inkomst',
      icon: HelpCircle,
      question: 'Hur blir jag bud och vad krävs för att börja köra?',
      answer: 'Du klickar på "Kör som bud" i menyn och registrerar dig med BankID på under 2 minuter. Du väljer själv ditt fordon (cykel, bil eller skåpbil) och har full frihet att acceptera endast de uppdrag som passar ditt schema och din rutt.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-20 bg-slate-100/70 border-b border-slate-200" id="faq-sektion">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-700" />
            <span>Frågor & Svar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Allt du behöver veta innan du bokar
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-pretty">
            Här har vi samlat svar på de vanligaste frågorna om hämtning, priser, BankID-verifiering och trygghet.
          </p>
        </div>

        {/* FAQ Accordion List (Gestalt common region + min 48px touch targets + 3D depth) */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'card-3d-light border-cyan-400/80 ring-2 ring-cyan-100 shadow-[0_8px_24px_-4px_rgba(6,182,212,0.18)]' 
                    : 'card-3d-light border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Clickable Accordion Header - Min 48px height, clear 3D feedback */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full min-h-[52px] px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-4 text-left cursor-pointer active:translate-y-[1px] transition-all select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isOpen 
                        ? 'icon-badge-3d-cyan text-white' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200/80 shadow-xs'
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-xs" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-700 bg-cyan-100/70 border border-cyan-200' : 'bg-slate-100 border border-slate-200/80'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer Block */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-pretty">{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-cyan-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_6px_#06b6d4]" />
                      <span>Kategori: {faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Prompt Card */}
        <div className="mt-8 sm:mt-12 card-3d-light rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl icon-badge-3d-indigo flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Har du en specifik fråga eller ovanligt uppdrag?</h4>
              <p className="text-xs sm:text-sm text-slate-500">Vår svenska kundservice svarar direkt i live-chatten här på sidan.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('booking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] rounded-xl btn-3d-slate text-white font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            Gå till bokning
          </button>
        </div>

      </div>
    </section>
  );
};
