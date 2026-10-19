import React from 'react';
import { Booking } from '../../types';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  User, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { LiveDeliveryMap } from '../Map/LiveDeliveryMap';

interface TrackingModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'accepted': return 2;
      case 'in_transit': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const stepIndex = getStatusStepIndex(booking.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800">{booking.trackingCode}</span>
                <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded capitalize">
                  {booking.serviceType === 'package' ? 'Paket' : booking.serviceType === 'marketplace' ? 'Köp' : 'Ombud'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{booking.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Stäng spårning"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Progress Stepper */}
        {booking.status !== 'cancelled' ? (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">Transportstatus</span>
              <span className="font-mono text-cyan-700 font-bold">
                {booking.status === 'pending' && 'Söker bud i närområdet...'}
                {booking.status === 'accepted' && 'Bud har accepterat körningen'}
                {booking.status === 'in_transit' && 'Paket upphämtat – på väg'}
                {booking.status === 'delivered' && 'Leverans genomförd!'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              {[
                { step: 1, label: 'Bokad' },
                { step: 2, label: 'Accepterad' },
                { step: 3, label: 'Upphämtad' },
                { step: 4, label: 'Levererad' },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                      stepIndex >= s.step
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {stepIndex >= s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                  </div>
                  <span className={`text-[11px] ${stepIndex >= s.step ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.max(10, ((stepIndex - 1) / 3) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-xs flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>Denna bokning har avbrutits.</span>
          </div>
        )}

        {/* Real-time Interactive GPS Delivery Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Kartvy & Paketposition
            </h4>
            <span className="text-[11px] text-cyan-700 font-medium">Uppdateras kontinuerligt</span>
          </div>
          <LiveDeliveryMap booking={booking} />
        </div>

        {/* Assigned Courier Card (if accepted) */}
        {booking.courierName ? (
          <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-cyan-400 flex items-center justify-center text-cyan-400 font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 block font-semibold">Tilldelat bud</span>
                <p className="text-sm font-bold text-white">{booking.courierName}</p>
                <p className="text-xs text-slate-300">{booking.courierVehicle || 'Elbil'}</p>
              </div>
            </div>

            <div className="text-right">
              <a
                href={`tel:${booking.courierPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ring föraren</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-4 text-xs text-cyan-900 flex items-center gap-3">
            <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>
              Uppdraget söker ett tillgängligt bud i ditt område. När ett bud accepterar körningen visas förarens kontaktuppgifter här direkt.
            </span>
          </div>
        )}

        {/* Route Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Upphämtningsadress</span>
            <p className="font-bold text-slate-900">{booking.pickupAddress.street}, {booking.pickupAddress.city}</p>
            {booking.pickupAddress.doorCode && <p className="text-slate-500">Portkod: {booking.pickupAddress.doorCode}</p>}
            <p className="text-slate-500">Kontakt: {booking.pickupAddress.contactName} ({booking.pickupAddress.contactPhone})</p>
            {booking.pickupAddress.instructions && (
              <p className="text-slate-500 italic mt-1 pt-1 border-t border-slate-200">
                "{booking.pickupAddress.instructions}"
              </p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">Leveransadress</span>
            <p className="font-bold text-slate-900">{booking.deliveryAddress.street}, {booking.deliveryAddress.city}</p>
            {booking.deliveryAddress.doorCode && <p className="text-slate-500">Portkod: {booking.deliveryAddress.doorCode}</p>}
            <p className="text-slate-500">Mottagare: {booking.deliveryAddress.contactName} ({booking.deliveryAddress.contactPhone})</p>
            {booking.deliveryAddress.instructions && (
              <p className="text-slate-500 italic mt-1 pt-1 border-t border-slate-200">
                "{booking.deliveryAddress.instructions}"
              </p>
            )}
          </div>
        </div>

        {/* Status Timeline History */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Händelsehistorik</h4>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 divide-y divide-slate-200/70 text-xs">
            {booking.statusTimeline.map((item, idx) => (
              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.note || item.status}</p>
                </div>
                <span className="font-mono text-slate-400 shrink-0 text-[11px]">
                  {new Date(item.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transparent Price Breakdown */}
        <div className="bg-slate-100/70 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Budets ersättning (100%):</span>
            <span className="font-mono text-slate-800">{booking.priceBreakdown.courierEarnings} kr</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>HemBuds serviceavgift:</span>
            <span className="font-mono text-slate-800">{booking.priceBreakdown.serviceFee} kr</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
            <span>Totalt betalt:</span>
            <span className="font-mono text-cyan-700">{booking.priceBreakdown.totalCustomerPrice} kr</span>
          </div>
        </div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="w-full min-h-[48px] py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          Stäng fönster
        </button>

      </div>
    </div>
  );
};
