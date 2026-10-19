import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, DeliveryStatus, PackageSize } from '../../types';
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Store, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ChevronRight, 
  Filter, 
  X,
  ShieldCheck,
  Star,
  Check,
  Navigation,
  ExternalLink,
  User,
  Footprints
} from 'lucide-react';
import { LiveDeliveryMap } from '../Map/LiveDeliveryMap';

export const CourierMarketplace: React.FC = () => {
  const { bookings, currentUser, acceptBooking, updateBookingStatus, setSelectedBookingId, setCurrentView } = useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed'>('available');
  
  // Filters
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterSize, setFilterSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'earnings' | 'distance' | 'newest'>('newest');

  // Detail Modal
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);
  
  // Status update modal for completing delivery
  const [completingBooking, setCompletingBooking] = useState<Booking | null>(null);
  const [deliveryNote, setDeliveryNote] = useState<string>('Levererad och överlämnad personligen till mottagaren.');

  // Filter available bookings
  const availableBookings = bookings.filter(b => b.status === 'pending');
  
  // Filter active bookings for this courier
  const myActiveBookings = bookings.filter(
    b => b.courierId === currentUser.id && (b.status === 'accepted' || b.status === 'in_transit')
  );

  // Filter completed bookings for this courier
  const myCompletedBookings = bookings.filter(
    b => b.courierId === currentUser.id && b.status === 'delivered'
  );

  // Apply filters on available
  let filteredAvailable = availableBookings.filter(b => {
    if (filterCity !== 'all' && !b.pickupAddress.city.toLowerCase().includes(filterCity.toLowerCase())) {
      return false;
    }
    if (filterSize !== 'all' && b.packageSize !== filterSize) {
      return false;
    }
    return true;
  });

  // Sort
  filteredAvailable.sort((a, b) => {
    if (sortBy === 'earnings') {
      return b.priceBreakdown.courierEarnings - a.priceBreakdown.courierEarnings;
    }
    if (sortBy === 'distance') {
      return a.priceBreakdown.distanceKm - b.priceBreakdown.distanceKm;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Total earnings stats for courier
  const totalEarned = myCompletedBookings.reduce((sum, b) => sum + b.priceBreakdown.courierEarnings, 0);

  const handleAccept = (bookingId: string) => {
    acceptBooking(bookingId);
    setSelectedBookingForModal(null);
    setActiveTab('active');
  };

  const handleSetInTransit = (bookingId: string) => {
    updateBookingStatus(bookingId, 'in_transit', 'Paketet har hämtats hos avsändaren och är på väg till leveransadressen.');
  };

  const handleOpenCompleteModal = (booking: Booking) => {
    setCompletingBooking(booking);
    setDeliveryNote('Levererat och överlämnat till mottagaren.');
  };

  const handleFinalizeDelivery = () => {
    if (completingBooking) {
      updateBookingStatus(completingBooking.id, 'delivered', deliveryNote);
      setCompletingBooking(null);
      setActiveTab('completed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Top Banner / Courier Profile Header */}
      <div className="card-3d-dark text-white rounded-3xl p-4 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl icon-badge-3d-cyan text-white flex items-center justify-center font-bold text-2xl shrink-0">
            <Truck className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Budportalen</h1>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                Oberoende
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-1">
              <span className="font-medium text-white">{currentUser.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BankID</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Fordon: {currentUser.vehicleType || 'Elbil'}</span>
            </div>
          </div>
        </div>

        {/* Quick Earnings KPI strip */}
        <div className="surface-3d-inset-dark flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 px-4 sm:px-5 py-3 rounded-2xl">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Intjänat totalt</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-cyan-400 drop-shadow-sm">{totalEarned} kr</span>
          </div>
          <div className="h-8 w-px bg-slate-700/80" />
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Aktiva körningar</span>
            <span className="font-mono text-lg sm:text-xl font-bold text-white">{myActiveBookings.length} st</span>
          </div>
          <div className="h-8 w-px bg-slate-700/80 hidden sm:block" />
          <button
            type="button"
            onClick={() => setCurrentView('profile')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 btn-3d-slate text-xs font-semibold text-slate-200 hover:text-white rounded-lg cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Budprofil</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation with overflow-x-auto */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto scrollbar-none pb-0.5">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'available'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Tillgängliga uppdrag</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'available' ? 'bg-cyan-100 text-cyan-800 font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              {availableBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Mina aktiva körningar</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              myActiveBookings.length > 0 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-600'
            }`}>
              {myActiveBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Slutförda ({myCompletedBookings.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Marknadsplats: Du väljer själv vilka uppdrag du vill ta</span>
        </div>
      </div>

      {/* ===================== TAB 1: AVAILABLE MISSIONS ===================== */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrera:</span>
              </div>

              {/* City filter */}
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">Alla områden</option>
                <option value="stockholm">Stockholm</option>
                <option value="södermalm">Södermalm</option>
                <option value="vasastan">Vasastan</option>
                <option value="solna">Solna</option>
                <option value="kungsholmen">Kungsholmen</option>
              </select>

              {/* Package size filter */}
              <select
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">Alla storlekar</option>
                <option value="small">Litet paket (upp till 3 kg)</option>
                <option value="medium">Mellanpaket (upp till 10 kg)</option>
                <option value="large">Stort paket (stol/TV)</option>
                <option value="bulky">Otympligt (skåpbil)</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Sortera på:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="newest">Senast inkomna</option>
                <option value="earnings">Högst ersättning (kr)</option>
                <option value="distance">Kortast körsträcka (km)</option>
              </select>
            </div>
          </div>

          {/* List of Available Missions */}
          {filteredAvailable.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Inga tillgängliga uppdrag matchar dina filter
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Just nu finns inga nya bokningar med de valda kriterierna. Prova att återställa filtren eller skapa en testbokning som kund.
              </p>
              <button
                onClick={() => {
                  setFilterCity('all');
                  setFilterSize('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Nollställ filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAvailable.map((b) => (
                <div
                  key={b.id}
                  className="card-3d-light rounded-3xl p-6 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Service, tracking code & Courier Earnings */}
                    <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                            {b.serviceType === 'package' ? 'Skicka paket' : b.serviceType === 'marketplace' ? 'Hämta köp' : 'Hämta ombud'}
                          </span>
                          <span className="font-mono text-xs text-slate-400">{b.trackingCode}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">{b.title}</h3>
                      </div>

                      {/* Courier Earnings Highlight */}
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Din ersättning</span>
                        <span className="font-mono text-2xl font-extrabold text-slate-900">
                          {b.priceBreakdown.courierEarnings} kr
                        </span>
                        <span className="text-[10px] text-emerald-600 block font-semibold">100% till dig</span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 mt-1 shrink-0" />
                        <div>
                          <span className="text-slate-400 block">Hämtas:</span>
                          <p className="font-semibold text-slate-900">{b.pickupAddress.street}, {b.pickupAddress.city}</p>
                          {b.pickupAddress.doorCode && <p className="text-slate-500">Portkod: {b.pickupAddress.doorCode}</p>}
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                        <div>
                          <span className="text-slate-400 block">Levereras:</span>
                          <p className="font-semibold text-slate-900">{b.deliveryAddress.street}, {b.deliveryAddress.city}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Flags */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-medium">
                        Körsträcka: <strong>{b.priceBreakdown.distanceKm} km</strong>
                      </span>
                      <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-medium capitalize">
                        Storlek: <strong>{b.packageSize}</strong>
                      </span>
                      {b.packageSize === 'small' && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1">
                          <Footprints className="w-3 h-3 text-emerald-600" />
                          <span>Gående / kollektivtrafik OK</span>
                        </span>
                      )}
                      {b.needsCarryingHelp && (
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded text-[11px] font-semibold">
                          Bärhjälp ingår (+95 kr)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForModal(b)}
                      className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 btn-3d-white text-center cursor-pointer"
                    >
                      Visa detaljer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(b.id)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 btn-3d-cyan text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                      <span>Acceptera uppdrag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: ACTIVE DELIVERIES ===================== */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {myActiveBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Du har inga aktiva uppdrag just nu
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Gå till fliken "Tillgängliga uppdrag" för att hitta och acceptera en körning som passar dig.
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Se tillgängliga uppdrag
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {myActiveBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border-2 border-slate-900 p-6 sm:p-8 shadow-md space-y-6"
                >
                  {/* Top Bar with Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                          {b.status === 'accepted' ? 'Tilldelad – redo för upphämtning' : 'Upphämtad – på väg till mottagaren'}
                        </span>
                        <span className="font-mono text-xs text-slate-400">{b.trackingCode}</span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">{b.title}</h2>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Ersättning vid leverans:</span>
                      <span className="font-mono text-2xl font-extrabold text-cyan-700">{b.priceBreakdown.courierEarnings} kr</span>
                    </div>
                  </div>

                  {/* Route & Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
                    
                    {/* Pickup Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <span>Upphämtning</span>
                      </div>
                      <p className="font-semibold text-slate-800">{b.pickupAddress.street}, {b.pickupAddress.city}</p>
                      {b.pickupAddress.doorCode && <p className="text-slate-600">Portkod/Våning: {b.pickupAddress.doorCode} ({b.pickupAddress.floor || 'Hiss'})</p>}
                      <p className="text-slate-600">Kontakt: {b.pickupAddress.contactName} ({b.pickupAddress.contactPhone})</p>
                      {b.pickupAddress.instructions && (
                        <p className="text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                          Instruktion: "{b.pickupAddress.instructions}"
                        </p>
                      )}
                      {b.pickupCode && (
                        <div className="bg-cyan-100/70 border border-cyan-300 p-2 rounded text-cyan-950 font-medium">
                          Avi/Hämtkod: <span className="font-mono font-bold">{b.pickupCode}</span>
                        </div>
                      )}
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Leverans</span>
                      </div>
                      <p className="font-semibold text-slate-800">{b.deliveryAddress.street}, {b.deliveryAddress.city}</p>
                      {b.deliveryAddress.doorCode && <p className="text-slate-600">Portkod/Våning: {b.deliveryAddress.doorCode} ({b.deliveryAddress.floor || 'Hiss'})</p>}
                      <p className="text-slate-600">Mottagare: {b.deliveryAddress.contactName} ({b.deliveryAddress.contactPhone})</p>
                      {b.deliveryAddress.instructions && (
                        <p className="text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                          Instruktion: "{b.deliveryAddress.instructions}"
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Real-time GPS Route Map for Courier Navigation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Karta & GPS-rutt för körningen</span>
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Följ anvisningar eller öppna extern navigator
                      </span>
                    </div>
                    <LiveDeliveryMap booking={b} isCourierView={true} />
                  </div>

                  {/* Operational Action Stepper for Courier */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Körsträcka: <strong className="text-slate-800">{b.priceBreakdown.distanceKm} km</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Beställare: <strong className="text-slate-800">{b.customerName}</strong></span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {b.status === 'accepted' ? (
                        <button
                          type="button"
                          onClick={() => handleSetInTransit(b.id)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Package className="w-4 h-4" />
                          <span>Markera som upphämtad</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenCompleteModal(b)}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Slutför leverans & kvittera</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: COMPLETED DELIVERIES & EARNINGS ===================== */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          
          {/* Earnings Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Utbetalad ersättning</span>
              <span className="font-mono text-3xl font-extrabold text-slate-900 block mt-2">{totalEarned} kr</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Utbetalas automatiskt via Swish/Bankgiro</span>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Genomförda körningar</span>
              <span className="font-mono text-3xl font-extrabold text-slate-900 block mt-2">{myCompletedBookings.length} st</span>
              <span className="text-[11px] text-slate-400 mt-1 block">100% fullföljda utan avvikelser</span>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Snitt per uppdrag</span>
              <span className="font-mono text-3xl font-extrabold text-cyan-700 block mt-2">
                {myCompletedBookings.length > 0 ? Math.round(totalEarned / myCompletedBookings.length) : 0} kr
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Exklusive dricks och extra bärhjälp</span>
            </div>
          </div>

          {/* Completed History List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Leveranshistorik & kvitton</h3>
              <span className="text-xs text-slate-400">{myCompletedBookings.length} slutförda körningar</span>
            </div>

            {myCompletedBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Inga avslutade körningar ännu.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myCompletedBookings.map((b) => (
                  <div key={b.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-800">{b.trackingCode}</span>
                        <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Levererad</span>
                        <span className="text-xs text-slate-400">· {new Date(b.deliveredAt || b.createdAt).toLocaleDateString('sv-SE')}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                      <p className="text-xs text-slate-500">
                        Från {b.pickupAddress.city} till {b.deliveryAddress.city} ({b.priceBreakdown.distanceKm} km)
                      </p>
                      {b.deliveryNote && (
                        <p className="text-[11px] text-slate-400 italic">
                          Notering: "{b.deliveryNote}"
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Intjänat:</span>
                      <span className="font-mono font-bold text-emerald-600 text-lg">
                        +{b.priceBreakdown.courierEarnings} kr
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== DETAIL MODAL FOR MISSION ===================== */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded">
                  {selectedBookingForModal.trackingCode}
                </span>
                <span className="text-xs text-slate-500 capitalize">{selectedBookingForModal.serviceType}</span>
              </div>
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedBookingForModal.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedBookingForModal.description}
              </p>
            </div>

            {/* Address Details */}
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Upphämtning</span>
                <p className="font-bold text-slate-900">{selectedBookingForModal.pickupAddress.street}, {selectedBookingForModal.pickupAddress.city}</p>
                <p className="text-slate-600">Kontakt: {selectedBookingForModal.pickupAddress.contactName} ({selectedBookingForModal.pickupAddress.contactPhone})</p>
                {selectedBookingForModal.pickupAddress.doorCode && <p className="text-slate-500">Portkod: {selectedBookingForModal.pickupAddress.doorCode}</p>}
                {selectedBookingForModal.pickupAddress.instructions && (
                  <p className="text-slate-500 italic">Instruktion: {selectedBookingForModal.pickupAddress.instructions}</p>
                )}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Leveransadress</span>
                <p className="font-bold text-slate-900">{selectedBookingForModal.deliveryAddress.street}, {selectedBookingForModal.deliveryAddress.city}</p>
                <p className="text-slate-600">Mottagare: {selectedBookingForModal.deliveryAddress.contactName} ({selectedBookingForModal.deliveryAddress.contactPhone})</p>
                {selectedBookingForModal.deliveryAddress.doorCode && <p className="text-slate-500">Portkod: {selectedBookingForModal.deliveryAddress.doorCode}</p>}
              </div>
            </div>

            {/* Route Map Preview */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Förhandsgranskning av rutt & körsträcka
              </span>
              <LiveDeliveryMap booking={selectedBookingForModal} isCourierView={true} />
            </div>

            {/* Price Guarantee */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 block">Budets ersättning (100%):</span>
                <span className="text-[11px] text-slate-400">Inga dolda avgifter dras</span>
              </div>
              <span className="font-mono text-2xl font-extrabold text-cyan-400">
                {selectedBookingForModal.priceBreakdown.courierEarnings} kr
              </span>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingForModal(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Stäng
              </button>
              <button
                type="button"
                onClick={() => handleAccept(selectedBookingForModal.id)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Acceptera uppdrag</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== COMPLETE DELIVERY MODAL ===================== */}
      {completingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Bekräfta leverans</h3>
              <button
                onClick={() => setCompletingBooking(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Du är i färd att markera uppdraget <strong className="text-slate-800">{completingBooking.trackingCode}</strong> som slutfört. Mottagaren och beställaren meddelas omedelbart.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Leveransnotering / Kvittens
              </label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="T.ex. Överlämnad i handen till mottagaren"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex justify-between items-center">
              <span>Din intjänade ersättning:</span>
              <span className="font-mono font-bold text-sm text-emerald-900">
                +{completingBooking.priceBreakdown.courierEarnings} kr
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCompletingBooking(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleFinalizeDelivery}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Bekräfta levererad</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
