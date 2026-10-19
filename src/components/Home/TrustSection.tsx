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
    <section className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-wider text-cyan-600 uppercase">
            Trygghet & Transparens
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Våra grundläggande principer
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Vi bygger en hållbar transporttjänst på ömsesidigt förtroende mellan beställare och oberoende bud.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            const badgeClasses = [
              'icon-badge-3d-cyan',
              'icon-badge-3d-amber',
              'icon-badge-3d-emerald',
              'icon-badge-3d-indigo'
            ];
            const badgeClass = badgeClasses[idx % badgeClasses.length];

            return (
              <div
                key={idx}
                className="card-3d-light rounded-3xl p-5 sm:p-6 space-y-3.5"
              >
                <div className={`w-12 h-12 rounded-2xl ${badgeClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
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
