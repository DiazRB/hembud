import React from 'react';
import { ShieldCheck, UserCheck, Lock, FileCheck2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const principles = [
    {
      title: 'BankID-verifierade användare',
      description: 'Alla beställare och anslutna bud identifierar sig med svenskt BankID före uppdrag. Det garanterar trygghet och full spårbarhet.',
      icon: ShieldCheck,
    },
    {
      title: 'Förmedlande marknadsplats',
      description: 'HemBud är en öppen plattform där oberoende bud själva väljer vilka uppdrag de vill utföra. Ingen automatisk tvångstilldelning.',
      icon: UserCheck,
    },
    {
      title: 'Öppen prissättning utan påslag',
      description: 'Budets transportintäkt och HemBuds serviceavgift är alltid separerade. Vi tar aldrig någon dold marginal på budens slit.',
      icon: Lock,
    },
    {
      title: 'Digital kvittering vid leverans',
      description: 'Vid överlämning bekräftas mottagandet digitalt. Mottagaren och beställaren får full historik och kvitto direkt i portalen.',
      icon: FileCheck2,
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-[#f8f9fa] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-10 sm:mb-14 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Trygghet & Transparens
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
            Våra grundläggande principer
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-xl">
            Vi bygger en hållbar transporttjänst på ömsesidigt förtroende mellan beställare och oberoende bud.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;

            return (
              <div
                key={idx}
                className="app-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-3.5 transition-all duration-150 ease-out hover:border-zinc-300"
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 shrink-0">
                  <Icon className="w-5 h-5 text-zinc-800" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
