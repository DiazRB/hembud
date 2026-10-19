import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PricingConfig, Booking } from '../../types';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Truck, 
  Settings, 
  Save, 
  RotateCcw, 
  Package, 
  Eye, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { TrackingModal } from '../Common/TrackingModal';

export const AdminDashboard: React.FC = () => {
  const { bookings, pricingConfig, updatePricingConfig, resetToDefaultData, currentUser } = useApp();

  // Local state for pricing form
  const [formData, setFormData] = useState<PricingConfig>(pricingConfig);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [modalBooking, setModalBooking] = useState<Booking | null>(null);

  // Platform KPIs
  const totalOrders = bookings.length;
  const totalVolume = bookings.reduce((sum, b) => sum + b.priceBreakdown.totalCustomerPrice, 0);
  const totalPlatformEarnings = bookings.reduce((sum, b) => sum + b.priceBreakdown.serviceFee, 0);
  const totalCourierPayouts = bookings.reduce((sum, b) => sum + b.priceBreakdown.courierEarnings, 0);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricingConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Vill du återställa bokningar och prisregler till standarddata?')) {
      resetToDefaultData();
      setFormData(pricingConfig);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Administrationspanel</h1>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                Superadmin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Inloggad som {currentUser.name} ({currentUser.email}) · Plattformshantering och tariffstyrning
            </p>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all duration-120 ease-out border border-slate-700 cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Återställ demodata</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Totalt antal uppdrag
          </span>
          <span className="font-mono text-3xl font-extrabold text-slate-900 block">
            {totalOrders} st
          </span>
          <span className="text-[11px] text-slate-400">
            {bookings.filter(b => b.status === 'delivered').length} slutförda · {bookings.filter(b => b.status === 'pending').length} väntande
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total ordervolym
          </span>
          <span className="font-mono text-3xl font-extrabold text-slate-900 block">
            {totalVolume} kr
          </span>
          <span className="text-[11px] text-slate-400">
            Brutto omsättning genom marknadsplatsen
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider block">
            HemBuds serviceintäkter
          </span>
          <span className="font-mono text-3xl font-extrabold text-cyan-700 block">
            {totalPlatformEarnings} kr
          </span>
          <span className="text-[11px] text-slate-400">
            {pricingConfig.serviceFeePercentage}% fast serviceavgift
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Utbetalat till bud
          </span>
          <span className="font-mono text-3xl font-extrabold text-emerald-600 block">
            {totalCourierPayouts} kr
          </span>
          <span className="text-[11px] text-slate-400">
            100% av transportdelen går oavkortat till buden
          </span>
        </div>
      </div>

      {/* Configurable Central Pricing Rules Editor */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Centrala och konfigurerbara prisregler
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Prisberäkningen sker centralt så att alla sidor (kund, bud och kalkylator) alltid visar samma pris.
            </p>
          </div>

          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Prisregler uppdaterade!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Baspriser */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Baspriser per tjänst (kr)
              </h4>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Skicka paket</label>
                <input
                  type="number"
                  value={formData.serviceBaseRates.package}
                  onChange={(e) => setFormData({
                    ...formData,
                    serviceBaseRates: { ...formData.serviceBaseRates, package: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Hämta köp (Blocket/Tradera)</label>
                <input
                  type="number"
                  value={formData.serviceBaseRates.marketplace}
                  onChange={(e) => setFormData({
                    ...formData,
                    serviceBaseRates: { ...formData.serviceBaseRates, marketplace: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Hämta hos ombud</label>
                <input
                  type="number"
                  value={formData.serviceBaseRates.agent_pickup}
                  onChange={(e) => setFormData({
                    ...formData,
                    serviceBaseRates: { ...formData.serviceBaseRates, agent_pickup: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
            </div>

            {/* Kilometertaxa & Tillval */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Avstånd & Tillägg
              </h4>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Kilometersats (kr/km)</label>
                <input
                  type="number"
                  value={formData.ratePerKm}
                  onChange={(e) => setFormData({ ...formData, ratePerKm: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Tillägg för bärhjälp (kr)</label>
                <input
                  type="number"
                  value={formData.carryingHelpFee}
                  onChange={(e) => setFormData({ ...formData, carryingHelpFee: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">HemBuds serviceavgift (%)</label>
                <input
                  type="number"
                  value={formData.serviceFeePercentage}
                  onChange={(e) => setFormData({ ...formData, serviceFeePercentage: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Plattformens enda intäktskälla.</p>
              </div>
            </div>

            {/* Storlekstillägg */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Paketstorlekstillägg (kr)
              </h4>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Mellanpaket (upp till 10 kg)</label>
                <input
                  type="number"
                  value={formData.sizeSurcharges.medium}
                  onChange={(e) => setFormData({
                    ...formData,
                    sizeSurcharges: { ...formData.sizeSurcharges, medium: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Stort paket (stol/TV, 25 kg)</label>
                <input
                  type="number"
                  value={formData.sizeSurcharges.large}
                  onChange={(e) => setFormData({
                    ...formData,
                    sizeSurcharges: { ...formData.sizeSurcharges, large: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Otympligt (möbler/skåpbil)</label>
                <input
                  type="number"
                  value={formData.sizeSurcharges.bulky}
                  onChange={(e) => setFormData({
                    ...formData,
                    sizeSurcharges: { ...formData.sizeSurcharges, bulky: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all duration-120 ease-out cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>Spara ändrade prisregler</span>
            </button>
          </div>
        </form>
      </div>

      {/* Global Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Alla uppdrag i plattformen ({bookings.length})
          </h3>
          <span className="text-xs text-slate-400">Realtidsöversikt över marknadsplatsen</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Kod</th>
                <th className="py-3 px-4">Uppdrag & Tjänst</th>
                <th className="py-3 px-4">Beställare</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Bud</th>
                <th className="py-3 px-4 text-right">Budersättning</th>
                <th className="py-3 px-4 text-right">Serviceavgift</th>
                <th className="py-3 px-4 text-right">Kundpris</th>
                <th className="py-3 px-4 text-center">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{b.trackingCode}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900 truncate max-w-[200px]">{b.title}</p>
                    <p className="text-[11px] text-slate-400">{b.pickupAddress.city} → {b.deliveryAddress.city}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{b.customerName}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      b.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : b.status === 'accepted'
                        ? 'bg-cyan-100 text-cyan-800'
                        : b.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {b.courierName || <span className="text-slate-400 italic">Ej tilldelad</span>}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800 font-semibold">
                    {b.priceBreakdown.courierEarnings} kr
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-cyan-700 font-semibold">
                    {b.priceBreakdown.serviceFee} kr
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-900 font-bold">
                    {b.priceBreakdown.totalCustomerPrice} kr
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setModalBooking(b)}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Visa detaljer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Tracking Modal */}
      <TrackingModal booking={modalBooking} onClose={() => setModalBooking(null)} />

    </div>
  );
};
