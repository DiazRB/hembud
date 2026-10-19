import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { ServiceType } from '../../types';

export const ServiceCards: React.FC = () => {
  const { setCurrentView } = useApp();

  const handleSelectService = (service: ServiceType) => {
    setCurrentView('booking', service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    {
      id: 'package' as ServiceType,
      title: 'Skicka paket',
      subtitle: 'Direkt mellan två adresser',
      description: 'Budet hämtar vid dörren och kör direkt till mottagaren. Inga omvägar eller sorteringsterminaler.',
      icon: Package,
      priceFrom: 'Från 119 kr',
    },
    {
      id: 'marketplace' as ServiceType,
      title: 'Hämta köp',
      subtitle: 'Blocket & Tradera',
      description: 'Handlat begagnat? Budet möter säljaren, stämmer av varan och levererar tryggt hem till dig.',
      icon: ShoppingBag,
      priceFrom: 'Från 159 kr',
    },
    {
      id: 'agent_pickup' as ServiceType,
      title: 'Hämta hos ombud',
      subtitle: 'PostNord, DHL & Instabox',
      description: 'Slipp köer och tunga paket. Budet hämtar ut försändelsen med fullmakt och kör den till din dörr.',
      icon: Store,
      priceFrom: 'Från 89 kr',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#f8f9fa] border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Våra transporttjänster
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-1.5">
            Välj tjänst för att beräkna pris och boka ett lokalt bud direkt.
          </p>
        </div>

        {/* 3 Clean App Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {services.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                onClick={() => handleSelectService(s.id)}
                className="group relative app-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div>
                  {/* Discreet Icon */}
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 mb-2.5">
                    {s.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* Card bottom: Clean price and button */}
                <div className="pt-4 mt-5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-900 font-mono">
                    {s.priceFrom}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    <span>Välj</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
