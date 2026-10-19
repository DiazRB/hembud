import React from 'react';
import { Booking } from '../../types';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  FileText,
  Calendar,
  Receipt
} from 'lucide-react';

interface ReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const deliveryDateFormatted = booking.deliveredAt 
    ? new Date(booking.deliveredAt).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date(booking.createdAt).toLocaleDateString('sv-SE');

  // Swedish VAT calculation on service fee (25%)
  const vatAmount = Math.round(booking.priceBreakdown.serviceFee * 0.2); // 25% VAT included in service fee is 20% of total fee
  const courierShare = booking.priceBreakdown.courierEarnings;
  const serviceFeeExVat = booking.priceBreakdown.serviceFee - vatAmount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900">
            <Receipt className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-bold">Leveranskvitto & Specifikation</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Skriv ut</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content Printable Body */}
        <div className="space-y-6 text-slate-800">
          
          {/* Company & Order Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">HemBud</span>
                <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-100/70 px-1.5 py-0.5 rounded">
                  Sverige
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Org.nr: 559281-9041 · F-skatt godkänd</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 block">Ordernummer</span>
              <span className="font-mono text-sm font-bold text-slate-900">{booking.trackingCode}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">{deliveryDateFormatted}</span>
            </div>
          </div>

          {/* Delivery Verified Status Badge */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transport slutförd & kvitterad</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">
              BankID-verifierad
            </span>
          </div>

          {/* Mission Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uppdragsinformation</h3>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{booking.title}</h4>
                  <p className="text-xs text-slate-500">{booking.description}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium capitalize">
                  {booking.serviceType === 'package' ? 'Paketleverans' : booking.serviceType === 'marketplace' ? 'Marknadsköp' : 'Ombudshämtning'}
                </span>
              </div>

              {booking.deliveryNote && (
                <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600 mt-2">
                  <span className="font-semibold text-slate-700">Överlämningsnotis från bud: </span>
                  {booking.deliveryNote}
                </div>
              )}
            </div>
          </div>

          {/* Route Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Upphämtning:</span>
              <p className="font-bold text-slate-800">{booking.pickupAddress.street}</p>
              <p className="text-slate-600">{booking.pickupAddress.postalCode} {booking.pickupAddress.city}</p>
              <p className="text-slate-500 text-[11px] mt-1">Kontakt: {booking.pickupAddress.contactName}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Levererad till:</span>
              <p className="font-bold text-slate-800">{booking.deliveryAddress.street}</p>
              <p className="text-slate-600">{booking.deliveryAddress.postalCode} {booking.deliveryAddress.city}</p>
              <p className="text-slate-500 text-[11px] mt-1">Mottagare: {booking.deliveryAddress.contactName}</p>
            </div>
          </div>

          {/* Courier Information */}
          {booking.courierName && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900">{booking.courierName}</span>
                  <p className="text-slate-500 text-[11px]">{booking.courierVehicle || 'Elfordon'} · Verifierat bud</p>
                </div>
              </div>
              <span className="text-amber-600 font-bold flex items-center gap-1">
                ★ 4.95
              </span>
            </div>
          )}

          {/* Transparent Price Specification */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prisspecifikation</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-600">Budets transporttakt (100% till budet)</span>
                <span className="font-mono font-medium text-slate-800">{courierShare} kr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="text-slate-600">HemBud service- & plattformsavgift (inkl. moms)</span>
                <span className="font-mono font-medium text-slate-800">{booking.priceBreakdown.serviceFee} kr</span>
              </div>
              <div className="flex justify-between py-1 text-slate-500 text-[11px]">
                <span>Varav moms 25% på förmedlingsavgift</span>
                <span className="font-mono">{vatAmount} kr</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold text-slate-900 border-t border-slate-300">
                <span>Totalt betalt</span>
                <span className="font-mono text-base text-cyan-800">
                  {booking.priceBreakdown.totalCustomerPrice} kr
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Sparat i ditt HemBud-konto
          </span>
          <button
            onClick={onClose}
            className="px-6 py-3 min-h-[44px] rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            Stäng
          </button>
        </div>

      </div>
    </div>
  );
};
