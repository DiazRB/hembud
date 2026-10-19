import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Truck, Package, ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import { ServiceType } from '../../types';

export const Hero: React.FC = () => {
  const { setCurrentView, switchRole } = useApp();

  const handleQuickService = (service: ServiceType) => {
    setCurrentView('booking', service);
  };

  return (
    <section className="bg-[#121214] text-white pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Column: Value Proposition & Direct Booking Flow */}
          <div className="lg:col-span-7 space-y-6 max-w-2xl mx-auto lg:max-w-none w-full">
            
            {/* Discrete Trust Note (Zero-pill discipline: quiet inline text) */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Svensk budförmedling · BankID-skyddat · Fast pris</span>
            </div>

            {/* Direct Natural Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance">
              Vart ska vi köra?
            </h1>

            {/* Natural, honest Swedish consumer app copy */}
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl text-pretty">
              Boka lokala bud för paket, Blocket-köp eller hämtning hos ombud. Du ser alltid fast pris innan du beställer.
            </p>

            {/* Quick Service Selection Tiles */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Vad vill du transportera?
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickService('package')}
                  className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white min-h-[72px] transition-all cursor-pointer active:scale-[0.98] text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center mb-1.5 group-hover:bg-zinc-700 transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold truncate">Paket</span>
                  <span className="text-[10px] text-zinc-400 hidden sm:block">Dörr till dörr</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickService('marketplace')}
                  className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white min-h-[72px] transition-all cursor-pointer active:scale-[0.98] text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center mb-1.5 group-hover:bg-zinc-700 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold truncate">Köphjälp</span>
                  <span className="text-[10px] text-zinc-400 hidden sm:block">Blocket/Tradera</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickService('agent_pickup')}
                  className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white min-h-[72px] transition-all cursor-pointer active:scale-[0.98] text-center"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center mb-1.5 group-hover:bg-zinc-700 transition-colors">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold truncate">Ombud</span>
                  <span className="text-[10px] text-zinc-400 hidden sm:block">Hämta paket</span>
                </button>
              </div>
            </div>

            {/* Ultrakompakt mikro-guide (clean, typographic, quiet) */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Så enkelt fungerar det:
                </span>
                <span className="hidden sm:inline text-zinc-500">Klart på 2 minuter</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-800 text-center text-xs">
                <div>
                  <span className="font-semibold text-white block">1. Välj typ</span>
                  <span className="text-[11px] text-zinc-400">Paket, köp el. ombud</span>
                </div>
                <div>
                  <span className="font-semibold text-white block">2. Se fast pris</span>
                  <span className="text-[11px] text-zinc-400">Inga överraskningar</span>
                </div>
                <div>
                  <span className="font-semibold text-white block">3. Bud kör</span>
                  <span className="text-[11px] text-zinc-400">Följ live på kartan</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => setCurrentView('booking')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] text-base font-semibold text-zinc-950 bg-white hover:bg-zinc-100 rounded-2xl transition-all cursor-pointer active:scale-[0.98] shadow-sm"
              >
                <span>Boka transport</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>

              <button
                onClick={() => {
                  switchRole('courier');
                  setCurrentView('courier');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 min-h-[52px] text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl transition-colors cursor-pointer active:scale-[0.98]"
              >
                <Truck className="w-4 h-4 text-zinc-400" />
                <span>Kör som bud</span>
              </button>
            </div>

          </div>

          {/* Right Column: Authentic Swedish App Order Card */}
          <div className="lg:col-span-5 w-full max-w-xl mx-auto lg:max-w-none">
            <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Aktivt uppdrag</span>
                  <span className="text-zinc-600">·</span>
                  <span className="font-mono text-zinc-400">HB-8492</span>
                </div>
                <span className="text-[11px] font-semibold text-zinc-300 bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-700">
                  Söker bud
                </span>
              </div>

              {/* Mission Snapshot */}
              <div className="space-y-3">
                <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Tjänst</p>
                      <p className="text-sm font-bold text-white">Hämta Blocket-köp</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Fast pris</p>
                      <p className="text-lg font-bold font-mono text-white">262 kr</p>
                    </div>
                  </div>

                  {/* Route Steps */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-zinc-400 font-medium">Hämtning</p>
                        <p className="font-medium text-zinc-200 truncate">Ringvägen 104, Södermalm</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-zinc-400 font-medium">Leverans</p>
                        <p className="font-medium text-zinc-200 truncate">Odengatan 45, Vasastan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Snapshot */}
                <div className="bg-zinc-900/50 rounded-2xl p-3.5 border border-zinc-800/60 space-y-1.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span>Budets ersättning:</span>
                    <span className="font-mono text-white">222 kr</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Serviceavgift (18%):</span>
                    <span className="font-mono">40 kr</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1.5 border-t border-zinc-800">
                    <span>Totalt:</span>
                    <span className="font-mono text-emerald-400">262 kr inkl. moms</span>
                  </div>
                </div>
              </div>

              {/* Action Button inside Showcase */}
              <button
                onClick={() => setCurrentView('booking', 'marketplace')}
                className="w-full min-h-[46px] py-2.5 text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-100 rounded-xl transition-all text-center cursor-pointer active:scale-[0.98]"
              >
                Boka liknande uppdrag
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
