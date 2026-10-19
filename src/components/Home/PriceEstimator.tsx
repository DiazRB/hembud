import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceType, PackageSize } from '../../types';
import { calculateDeliveryPrice } from '../../services/pricingService';
import { ArrowRight, Plus, Minus, Package, ShoppingBag, Store, ShieldCheck } from 'lucide-react';

export const PriceEstimator: React.FC = () => {
  const { pricingConfig, setCurrentView } = useApp();

  const [serviceType, setServiceType] = useState<ServiceType>('package');
  const [distanceKm, setDistanceKm] = useState<number>(5.5);
  const [packageSize, setPackageSize] = useState<PackageSize>('medium');
  const [needsCarryingHelp, setNeedsCarryingHelp] = useState<boolean>(false);

  const priceBreakdown = calculateDeliveryPrice(
    serviceType,
    distanceKm,
    packageSize,
    needsCarryingHelp,
    pricingConfig
  );

  const handleStartBooking = () => {
    setCurrentView('booking', serviceType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const adjustDistance = (delta: number) => {
    setDistanceKm((prev) => Math.min(35, Math.max(1, Math.round((prev + delta) * 2) / 2)));
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form & Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Räkna ut pris
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-1">
                Se vad budet får och vad du betalar. Inga dolda avgifter eller överraskningar.
              </p>
            </div>

            {/* Inputs Container */}
            <div className="bg-[#f8f9fa] border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-5">
              
              {/* 1. Service Type Selection (Clean segmented buttons) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  1. Typ av uppdrag
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('package')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[48px] border ${
                      serviceType === 'package'
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <Package className="w-4 h-4 shrink-0" />
                    <span>Paket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('marketplace')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[48px] border ${
                      serviceType === 'marketplace'
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Köphjälp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('agent_pickup')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[48px] border ${
                      serviceType === 'agent_pickup'
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <Store className="w-4 h-4 shrink-0" />
                    <span>Ombud</span>
                  </button>
                </div>
              </div>

              {/* 2. Distance Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    2. Körsträcka
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustDistance(-1)}
                      className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Minska sträcka"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-zinc-900 font-bold text-sm sm:text-base min-w-[54px] text-center">
                      {distanceKm} km
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustDistance(1)}
                      className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors"
                      aria-label="Öka sträcka"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="1"
                  max="35"
                  step="0.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 my-2"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[2, 5, 10, 15, 25].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setDistanceKm(km)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        distanceKm === km
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Package Size Selection */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                  3. Storlek
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'small' as PackageSize, label: 'Litet', sub: 'Upp till 3 kg · Väska/brev' },
                    { id: 'medium' as PackageSize, label: 'Mellan', sub: 'Upp till 10 kg · Kartong' },
                    { id: 'large' as PackageSize, label: 'Stort', sub: 'Upp till 25 kg · TV/stol' },
                    { id: 'bulky' as PackageSize, label: 'Otympligt', sub: 'Möbler/soffor' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setPackageSize(size.id)}
                      className={`p-3 rounded-xl text-left cursor-pointer transition-all border ${
                        packageSize === size.id
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-semibold">
                        {size.label}
                      </p>
                      <p className={`text-[11px] leading-tight mt-0.5 ${packageSize === size.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {size.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Carrying Help Toggle */}
              <div className="pt-1">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-zinc-200 cursor-pointer hover:border-zinc-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={needsCarryingHelp}
                    onChange={(e) => setNeedsCarryingHelp(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 accent-zinc-900 cursor-pointer shrink-0"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-zinc-900">Behöver du bärhjälp för trappor?</p>
                    <p className="text-zinc-500 text-[11px]">Budet hjälper till att bära (+{pricingConfig.carryingHelpFee} kr till budet)</p>
                  </div>
                </label>
              </div>

            </div>
          </div>

          {/* Right Column: Clean App Price Breakdown */}
          <div className="lg:col-span-5 w-full">
            <div className="app-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4">
              
              <div className="pb-3 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900">
                  Prisspecifikation
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Garanterat fast pris i realtid.
                </p>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                
                <div className="flex justify-between items-center text-zinc-600">
                  <span>Grundpris ({serviceType === 'package' ? 'Paket' : serviceType === 'marketplace' ? 'Köp' : 'Ombud'}):</span>
                  <span className="font-mono text-zinc-900 font-semibold">{priceBreakdown.basePrice} kr</span>
                </div>

                <div className="flex justify-between items-center text-zinc-600">
                  <span>Körsträcka ({priceBreakdown.distanceKm} km):</span>
                  <span className="font-mono text-zinc-900 font-semibold">{priceBreakdown.distancePrice} kr</span>
                </div>

                {priceBreakdown.sizePrice > 0 && (
                  <div className="flex justify-between items-center text-zinc-600">
                    <span>Storlekstillägg:</span>
                    <span className="font-mono text-zinc-900 font-semibold">+{priceBreakdown.sizePrice} kr</span>
                  </div>
                )}

                {priceBreakdown.extraHelpPrice > 0 && (
                  <div className="flex justify-between items-center text-zinc-600">
                    <span>Tillägg bärhjälp:</span>
                    <span className="font-mono text-zinc-900 font-semibold">+{priceBreakdown.extraHelpPrice} kr</span>
                  </div>
                )}

                {/* Courier share */}
                <div className="pt-3 border-t border-zinc-100 flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-zinc-800 block text-xs">
                      Budets ersättning:
                    </span>
                    <span className="text-[11px] text-zinc-400">100% till föraren</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 text-base">
                    {priceBreakdown.courierEarnings} kr
                  </span>
                </div>

                {/* Service fee */}
                <div className="flex justify-between items-baseline text-zinc-500 text-xs">
                  <span>HemBud serviceavgift ({pricingConfig.serviceFeePercentage}%):</span>
                  <span className="font-mono text-zinc-700">{priceBreakdown.serviceFee} kr</span>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-zinc-900 block">Totalt pris</span>
                    <span className="text-[11px] text-zinc-500">Inkl. moms och kvittering</span>
                  </div>
                  <span className="font-mono text-2xl font-bold text-zinc-900">
                    {priceBreakdown.totalCustomerPrice} kr
                  </span>
                </div>
              </div>

              {/* Action Button: Solid confident graphite button */}
              <button
                type="button"
                onClick={handleStartBooking}
                className="w-full min-h-[50px] py-3 px-4 rounded-xl font-semibold text-sm text-white bg-zinc-900 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-xs"
              >
                <span>Boka med detta pris</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>BankID-verifierat och försäkrat</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
