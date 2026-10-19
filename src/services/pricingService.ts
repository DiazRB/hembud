import { PricingConfig, PriceBreakdown, ServiceType, PackageSize } from '../types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  serviceBaseRates: {
    package: 119,       // Skicka paket
    marketplace: 159,   // Hämta mitt köp (extra kontroll & kvittoavstämning)
    agent_pickup: 89,   // Hämta hos ombud (snabb lokal upphämtning)
  },
  ratePerKm: 12,        // 12 kr per körd km
  sizeSurcharges: {
    small: 0,           // Ingår
    medium: 40,         // +40 kr
    large: 100,         // +100 kr
    bulky: 220,         // +220 kr (kräver skåpbil/släp)
  },
  carryingHelpFee: 95,  // Fast tillägg för bärhjälp
  serviceFeePercentage: 18, // 18% plattforms- och försäkringsavgift
};

/**
 * Beräknar transparent transportpris enligt centrala regler.
 * HemBuds intäkt är endast den öppna serviceavgiften.
 * Budets ersättning är 100% av transportsumman (baspris + avstånd + storlek + bärhjälp).
 */
export function calculateDeliveryPrice(
  serviceType: ServiceType,
  distanceKm: number,
  size: PackageSize,
  needsCarryingHelp: boolean,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): PriceBreakdown {
  const safeDistance = Math.max(1, Math.round(distanceKm * 10) / 10);
  
  const basePrice = config.serviceBaseRates[serviceType] || config.serviceBaseRates.package;
  const distancePrice = Math.round(safeDistance * config.ratePerKm);
  const sizePrice = config.sizeSurcharges[size] ?? 0;
  const extraHelpPrice = needsCarryingHelp ? config.carryingHelpFee : 0;

  // Budets intjänade transportdel:
  const courierEarnings = basePrice + distancePrice + sizePrice + extraHelpPrice;

  // HemBuds öppna serviceavgift (rundas till närmsta krona):
  const serviceFee = Math.round(courierEarnings * (config.serviceFeePercentage / 100));

  // Kundens totala pris:
  const totalCustomerPrice = courierEarnings + serviceFee;

  return {
    courierEarnings,
    serviceFee,
    totalCustomerPrice,
    basePrice,
    distancePrice,
    sizePrice,
    extraHelpPrice,
    distanceKm: safeDistance,
  };
}

/**
 * Uppskattar avstånd mellan två orter eller adresser i km
 */
export function estimateDistanceKm(fromCity: string, toCity: string, fromPostal?: string, toPostal?: string): number {
  if (!fromCity && !toCity) return 4.5;
  
  const normFrom = (fromCity || '').trim().toLowerCase();
  const normTo = (toCity || '').trim().toLowerCase();

  // Om det är inom samma stadsdel / ombud
  if (normFrom === normTo && normFrom.length > 0) {
    if (fromPostal && toPostal && fromPostal.length >= 3 && toPostal.length >= 3) {
      const p1 = parseInt(fromPostal.replace(/\s+/g, '').substring(0, 3), 10) || 111;
      const p2 = parseInt(toPostal.replace(/\s+/g, '').substring(0, 3), 10) || 111;
      const diff = Math.abs(p1 - p2);
      return Math.min(25, Math.max(2.2, Number((diff * 0.4 + 2.5).toFixed(1))));
    }
    return 4.2;
  }

  // Fördefinierade vanliga avstånd mellan svenska orter
  const cityDistances: Record<string, Record<string, number>> = {
    stockholm: { solna: 6.5, sundbyberg: 8.0, nacka: 9.5, sollentuna: 14.0, uppsala: 71.0, göteborg: 470.0, malmö: 610.0 },
    solna: { stockholm: 6.5, sundbyberg: 3.5, sollentuna: 9.0, nacka: 15.0 },
    sundbyberg: { stockholm: 8.0, solna: 3.5, sollentuna: 10.5 },
    göteborg: { mölndal: 7.0, partille: 9.5, kungälv: 21.0, borås: 64.0 },
    malmö: { lund: 19.0, helsingborg: 65.0, trelleborg: 32.0 },
  };

  if (cityDistances[normFrom] && cityDistances[normFrom][normTo]) {
    return cityDistances[normFrom][normTo];
  }
  if (cityDistances[normTo] && cityDistances[normTo][normFrom]) {
    return cityDistances[normTo][normFrom];
  }

  // Default realistiskt avstånd för lokal stadsbudskörning
  return 5.8;
}
