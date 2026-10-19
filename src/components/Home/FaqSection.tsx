import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Clock, CreditCard, ShoppingBag, Truck, Headphones, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FaqItem {
  question: string;
  answer: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

export const FaqSection: React.FC = () => {
  const { setCurrentView, setIsChatOpen } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section className="py-12 sm:py-20 bg-white border-b border-zinc-200" id="faq-sektion">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-14 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Frågor & Svar
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
            Allt du behöver veta innan du bokar
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Svar på de vanligaste frågorna om hämtning, priser, BankID-verifiering och trygghet.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;

            return (
              <div
                key={idx}
                className={`app-card rounded-2xl overflow-hidden transition-all duration-120 ease-out ${
                  isOpen ? 'border-zinc-400/90 shadow-sm' : 'hover:border-zinc-300'
                }`}
              >
                {/* Clickable Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full min-h-[52px] px-4 sm:px-6 py-4 flex items-center justify-between gap-3 sm:gap-4 text-left cursor-pointer active:scale-[0.99] transition-all duration-100 ease-out select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-800 shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-zinc-500 bg-zinc-100 border border-zinc-200/70 transition-transform duration-150 ease-out ${
                    isOpen ? 'rotate-180 text-zinc-900' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer Block */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 animate-in fade-in duration-100">
                    <p className="text-pretty">{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-zinc-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Område: {faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Prompt Card */}
        <div className="mt-8 sm:mt-12 app-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
              <Headphones className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-zinc-900">Har du en specifik fråga eller ovanligt uppdrag?</h4>
              <p className="text-xs sm:text-sm text-zinc-500">Vår svenska kundservice svarar direkt i live-chatten.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold text-xs transition-all duration-120 ease-out cursor-pointer active:scale-[0.98] border border-zinc-200"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chatta med support</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all duration-120 ease-out cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span>Boka direkt</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
