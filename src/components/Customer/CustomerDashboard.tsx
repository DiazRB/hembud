import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, DeliveryStatus, ServiceType } from '../../types';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Plus, 
  ChevronRight, 
  X, 
  Phone, 
  AlertCircle,
  ShieldCheck,
  User,
  Search,
  Receipt,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Calendar,
  Building,
  Check
} from 'lucide-react';
import { TrackingModal } from '../Common/TrackingModal';
import { ReceiptModal } from './ReceiptModal';
import { LiveDeliveryMap } from '../Map/LiveDeliveryMap';

export const CustomerDashboard: React.FC = () => {
  const { bookings, currentUser, cancelBooking, setCurrentView, selectedBookingId, setSelectedBookingId } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'delivered'>('active');
  const [modalBooking, setModalBooking] = useState<Booking | null>(() => {
    if (selectedBookingId) {
      return bookings.find(b => b.id === selectedBookingId) || null;
    }
    return null;
  });
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  // Search & filter states for completed deliveries section
  const [historySearch, setHistorySearch] = useState('');
  const [historyServiceFilter, setHistoryServiceFilter] = useState<'all' | ServiceType>('all');

  // Filter bookings for this customer
  const customerBookings = bookings.filter(b => b.customerId === currentUser.id || b.customerName === currentUser.name);
  const activeBookings = customerBookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'in_transit');
  const deliveredBookings = customerBookings.filter(b => b.status === 'delivered');

  // Filtered list for the specific completed section
  const filteredDeliveredBookings = deliveredBookings.filter(b => {
    const matchesService = historyServiceFilter === 'all' || b.serviceType === historyServiceFilter;
    const matchesQuery = !historySearch.trim() || 
      b.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.trackingCode.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.pickupAddress.city.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.deliveryAddress.city.toLowerCase().includes(historySearch.toLowerCase()) ||
      (b.courierName && b.courierName.toLowerCase().includes(historySearch.toLowerCase()));
    return matchesService && matchesQuery;
  });

  const displayedBookings = filterTab === 'active' 
    ? activeBookings 
    : filterTab === 'delivered' 
    ? filteredDeliveredBookings 
    : customerBookings;

  const handleOpenTracking = (booking: Booking) => {
    setModalBooking(booking);
    setSelectedBookingId(booking.id);
  };

  const handleCloseTracking = () => {
    setModalBooking(null);
    setSelectedBookingId(null);
  };

  const handleOpenReceipt = (booking: Booking) => {
    setReceiptBooking(booking);
  };

  const handleCloseReceipt = () => {
    setReceiptBooking(null);
  };

  const handleRepeatBooking = (booking: Booking) => {
    setCurrentView('booking', booking.serviceType);
  };

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Är du säker på att du vill avbryta denna bokning?')) {
      cancelBooking(bookingId);
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Söker bud</span>
          </span>
        );
      case 'accepted':
        return (
          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span>Bud tilldelat</span>
          </span>
        );
      case 'in_transit':
        return (
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>På väg</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Levererad</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Avbruten
          </span>
        );
    }
  };

  // Helper to render the simple visual timeline for an individual order
  const renderOrderTimeline = (b: Booking) => {
    const isDelivered = b.status === 'delivered';
    const isInTransit = b.status === 'in_transit' || isDelivered;
    const isAccepted = b.status === 'accepted' || isInTransit;
    const isCreated = true;

    // Timeline steps definition
    const steps = [
      {
        id: 'created',
        title: 'Bokad',
        time: formatDateTime(b.createdAt),
        note: 'Beställning mottagen',
        isDone: isCreated,
        isCurrent: b.status === 'pending',
      },
      {
        id: 'accepted',
        title: 'Bud tilldelat',
        time: b.acceptedAt ? formatDateTime(b.acceptedAt) : isAccepted ? 'Bekräftad' : 'Väntar',
        note: b.courierName ? `${b.courierName}` : 'Söker förare',
        isDone: isAccepted,
        isCurrent: b.status === 'accepted',
      },
      {
        id: 'pickup',
        title: 'Upphämtad',
        time: b.pickedUpAt ? formatDateTime(b.pickedUpAt) : isInTransit ? 'Hämtad' : 'Väntar',
        note: b.pickupAddress.city.split('(')[0].trim(),
        isDone: isInTransit,
        isCurrent: b.status === 'in_transit',
      },
      {
        id: 'delivered',
        title: 'Levererad',
        time: b.deliveredAt ? formatDateTime(b.deliveredAt) : isDelivered ? 'Slutförd' : 'Ej levererad',
        note: isDelivered ? 'Kvitterad vid dörr' : 'Slutdestination',
        isDone: isDelivered,
        isCurrent: isDelivered,
      },
    ];

    return (
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-700" />
            <span>Tidslinje för ordern</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {isDelivered ? '100% slutförd' : b.status === 'in_transit' ? 'Transport pågår' : 'Under behandling'}
          </span>
        </div>

        {/* Visual Progress Nodes */}
        <div className="relative">
          {/* Progress bar line */}
          <div className="hidden sm:block absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
            className="hidden sm:block absolute top-3.5 left-6 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ 
              width: isDelivered ? 'calc(100% - 48px)' : b.status === 'in_transit' ? '66%' : b.status === 'accepted' ? '33%' : '0%' 
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-start sm:items-center text-left sm:text-center">
                <div className="flex items-center gap-2 sm:block mb-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all sm:mx-auto ${
                      step.isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : step.isCurrent
                        ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                        : 'bg-white text-slate-400 border border-slate-300'
                    }`}
                  >
                    {step.isDone ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span className="text-[11px]">{idx + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs font-bold sm:hidden ${step.isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                </div>

                <div className="sm:mt-1">
                  <span className={`hidden sm:block text-xs font-bold leading-tight ${step.isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {step.time}
                  </span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">
                    {step.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery note / receipt note if available */}
        {b.deliveryNote && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-start gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <span className="font-semibold text-slate-800">Budets överlämningsnotis:</span> {b.deliveryNote}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Header with Customer Profile Card */}
      <div className="card-3d-light rounded-3xl p-4 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl icon-badge-3d-indigo text-white flex items-center justify-center font-bold text-2xl shrink-0">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Kundpanel</h1>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Verifierat konto
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-800">{currentUser.name}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.phone}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-cyan-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BankID-skyddad</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('profile')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 min-h-[44px] rounded-xl btn-3d-white text-slate-700 font-semibold text-xs cursor-pointer"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Min profil</span>
          </button>

          <button
            onClick={() => setCurrentView('booking')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl btn-3d-cyan text-slate-950 font-bold text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Boka ny</span>
          </button>
        </div>
      </div>

      {/* Quick Platform Metrics Ribbon with 3D cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="card-3d-light rounded-2xl p-3.5 sm:p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Aktiva uppdrag</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">{activeBookings.length}</span>
            <span className="text-xs text-cyan-700 font-medium">pågående</span>
          </div>
        </div>

        <div className="card-3d-light rounded-2xl p-3.5 sm:p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Slutförda leveranser</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">{deliveredBookings.length}</span>
            <span className="text-xs text-emerald-700 font-medium">genomförda</span>
          </div>
        </div>

        <div className="card-3d-light rounded-2xl p-3.5 sm:p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Punktlighet</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900">100%</span>
            <span className="text-xs text-slate-500 font-medium">i tid</span>
          </div>
        </div>

        <div className="card-3d-light rounded-2xl p-3.5 sm:p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Trygghetsnivå</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-700">BankID</span>
            <span className="text-xs text-cyan-700 font-medium">skyddat</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation with overflow-x-auto */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto scrollbar-none pb-0.5">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setFilterTab('active')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'active'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Aktiva uppdrag</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeBookings.length > 0 ? 'bg-cyan-100 text-cyan-800 font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              {activeBookings.length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('delivered')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'delivered'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Tidigare genomförda leveranser</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              deliveredBookings.length > 0 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              {deliveredBookings.length}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              filterTab === 'all'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Alla bokningar ({customerBookings.length})</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs text-slate-400">
          Realtidsspårning & tidslinjer för alla körningar
        </span>
      </div>

      {/* Embedded Live Map for active deliveries when on active tab */}
      {filterTab === 'active' && activeBookings.length > 0 && activeBookings[0] && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Aktiv live-karta: {activeBookings[0].title}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Följ budet och paketet i realtid från upphämtning till leveransadressen.
              </p>
            </div>

            <button
              onClick={() => handleOpenTracking(activeBookings[0])}
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 self-start sm:self-auto cursor-pointer"
            >
              Öppna fullständig spårningsvy →
            </button>
          </div>

          <LiveDeliveryMap booking={activeBookings[0]} />
        </div>
      )}

      {/* Main Listing View (Active or All tabs) */}
      {filterTab !== 'delivered' && (
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Inga {filterTab === 'active' ? 'aktiva uppdrag' : 'bokningar'} just nu
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filterTab === 'active' 
                  ? 'Du har inga pågående transporter i systemet. Vill du skicka ett paket eller hämta något?'
                  : 'Du har inte skapat några bokningar ännu.'}
              </p>
              <button
                onClick={() => setCurrentView('booking')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Skapa en bokning
              </button>
            </div>
          ) : (
            displayedBookings.map((b) => (
              <div
                key={b.id}
                className="card-3d-light rounded-3xl p-6 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Main info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      {getStatusBadge(b.status)}
                      <span className="font-mono text-xs font-bold text-slate-700">{b.trackingCode}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        {new Date(b.createdAt).toLocaleDateString('sv-SE', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{b.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{b.description}</p>
                    </div>

                    {/* Route */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1 shrink-0" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Upphämtning:</span>
                          <p className="font-medium text-slate-800">{b.pickupAddress.street}, {b.pickupAddress.city}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                        <div>
                          <span className="text-slate-400 block text-[11px]">Levereras till:</span>
                          <p className="font-medium text-slate-800">{b.deliveryAddress.street}, {b.deliveryAddress.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Driver info snippet if accepted */}
                    {b.courierName && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                        <Truck className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Bud: <strong>{b.courierName}</strong> ({b.courierVehicle || 'Elbil'})</span>
                      </div>
                    )}
                  </div>

                  {/* Right side: Price & Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-4 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] text-slate-400 block">Ditt totalpris:</span>
                      <span className="font-mono text-xl font-bold text-slate-900">
                        {b.priceBreakdown.totalCustomerPrice} kr
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        (Bud: {b.priceBreakdown.courierEarnings} kr + avgift: {b.priceBreakdown.serviceFee} kr)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          Avbryt
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenTracking(b)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-900 btn-3d-white rounded-xl cursor-pointer"
                      >
                        <span>Följ & Detaljer</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Integrated Simple Timeline for Each Order */}
                {renderOrderTimeline(b)}

              </div>
            ))
          )}
        </div>
      )}

      {/* DEDICATED SECTION: "Tidigare genomförda leveranser" */}
      {/* Visible either when 'delivered' tab is selected, or as a rich historical section when active bookings are viewed */}
      {(filterTab === 'delivered' || filterTab === 'active') && (
        <div className="card-3d-light rounded-3xl p-6 sm:p-8 space-y-6 mt-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-900">Tidigare genomförda leveranser</h2>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {deliveredBookings.length} st slutförda
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Översikt över dina tidigare transporter, leveranskvitton och tidslinje för varje genomförd order.
              </p>
            </div>

            {/* In-section Search and Service Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Sök i leveranshistorik..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
                />
                {historySearch && (
                  <button
                    onClick={() => setHistorySearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={historyServiceFilter}
                onChange={(e) => setHistoryServiceFilter(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">Alla typer</option>
                <option value="package">Skicka paket</option>
                <option value="marketplace">Marknadsköp</option>
                <option value="agent_pickup">Ombud</option>
              </select>
            </div>
          </div>

          {/* Delivered Bookings List with Rich Timelines */}
          {filteredDeliveredBookings.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                {deliveredBookings.length === 0 
                  ? 'Inga genomförda leveranser ännu'
                  : 'Inga genomförda leveranser matchade din sökning'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Så fort ett bud har levererat ett uppdrag visas orderdetaljer, kvittering och fullständig tidslinje här.
              </p>
              {deliveredBookings.length === 0 && (
                <button
                  onClick={() => setCurrentView('booking')}
                  className="px-5 py-2.5 btn-3d-slate text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Boka transport nu
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDeliveredBookings.map((b) => (
                <div
                  key={b.id}
                  className="card-3d-light rounded-3xl p-6 space-y-5"
                >
                  {/* Top line: status, order ID, service badge, date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Levererad & Kvitterad</span>
                      </span>

                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {b.trackingCode}
                      </span>

                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {b.serviceType === 'package' ? 'Paket' : b.serviceType === 'marketplace' ? 'Marknadsköp' : 'Ombud'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Slutförd: {b.deliveredAt ? formatDateTime(b.deliveredAt) : formatDateTime(b.createdAt)}</span>
                    </div>
                  </div>

                  {/* Order Title and Route Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                      <h3 className="text-base font-extrabold text-slate-900">{b.title}</h3>
                      <p className="text-xs text-slate-600">{b.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Upphämtad från:</span>
                          <p className="font-medium text-slate-800">{b.pickupAddress.street}</p>
                          <p className="text-slate-500 text-[11px]">{b.pickupAddress.city}</p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Levererad till:</span>
                          <p className="font-medium text-slate-800">{b.deliveryAddress.street}</p>
                          <p className="text-slate-500 text-[11px]">{b.deliveryAddress.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price and Driver Snapshot */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Prisöversikt:</span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-slate-600">Totalpris:</span>
                          <span className="font-mono text-lg font-bold text-slate-900">
                            {b.priceBreakdown.totalCustomerPrice} kr
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200 mt-1">
                          <div className="flex justify-between">
                            <span>Budets ersättning:</span>
                            <span className="font-mono">{b.priceBreakdown.courierEarnings} kr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>HemBud serviceavgift:</span>
                            <span className="font-mono">{b.priceBreakdown.serviceFee} kr</span>
                          </div>
                        </div>
                      </div>

                      {b.courierName && (
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Truck className="w-3.5 h-3.5 text-cyan-700" />
                            <span className="font-medium">{b.courierName}</span>
                          </div>
                          <span className="text-emerald-700 font-bold">★ 4.95</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ENKEL TIDSLINJE FÖR VARJE ORDER */}
                  {renderOrderTimeline(b)}

                  {/* Actions for Completed Order */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Kvitto och signerad leveransbekräftelse tillgänglig</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleRepeatBooking(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 btn-3d-white rounded-lg cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Boka igen</span>
                      </button>

                      <button
                        onClick={() => handleOpenReceipt(b)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-800 btn-3d-white rounded-lg cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Visa kvitto</span>
                      </button>

                      <button
                        onClick={() => handleOpenTracking(b)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white btn-3d-slate rounded-lg cursor-pointer"
                      >
                        <span>Se spårning & karta</span>
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Live Tracking Modal */}
      <TrackingModal booking={modalBooking} onClose={handleCloseTracking} />

      {/* Official Receipt Modal */}
      <ReceiptModal booking={receiptBooking} onClose={handleCloseReceipt} />

    </div>
  );
};
