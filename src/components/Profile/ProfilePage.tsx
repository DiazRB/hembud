import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Upload, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  Lock, 
  Bell, 
  CreditCard, 
  Check, 
  Smartphone,
  KeyRound,
  Shield,
  Car,
  Footprints
} from 'lucide-react';

const PRESET_AVATARS = [
  { id: 'av1', label: 'Professionell 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { id: 'av2', label: 'Professionell 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { id: 'av3', label: 'Professionell 3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
  { id: 'av4', label: 'Professionell 4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
];

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'payout' | 'security'>('details');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states initialized with currentUser data
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [city, setCity] = useState(currentUser.city || 'Stockholm');
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser.avatarUrl || '');

  // Customer specific
  const [defaultAddress, setDefaultAddress] = useState(currentUser.defaultAddress || 'Odengatan 45');
  const [defaultDoorCode, setDefaultDoorCode] = useState(currentUser.defaultDoorCode || '1904');

  // Courier specific
  const [vehicleType, setVehicleType] = useState(currentUser.vehicleType || 'Elbil');
  const [vehicleRegNumber, setVehicleRegNumber] = useState(currentUser.vehicleRegNumber || 'HMB-892');
  const [swishNumber, setSwishNumber] = useState(currentUser.swishNumber || currentUser.phone || '073-888 44 22');
  const [bankAccount, setBankAccount] = useState(currentUser.bankAccount || 'SEB 5123-456 789');
  const [serviceZone, setServiceZone] = useState(currentUser.serviceZone || 'Stockholm Innerstad & Söderort');

  // Security preferences
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled ?? true);
  const [emailNotifs, setEmailNotifs] = useState(currentUser.notificationPreferences?.emailNotifications ?? true);
  const [smsNotifs, setSmsNotifs] = useState(currentUser.notificationPreferences?.smsNotifications ?? true);

  // Handle custom image upload via file reader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Bilden är för stor. Max 4 MB tillåtet.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      city,
      avatarUrl,
      defaultAddress,
      defaultDoorCode,
      vehicleType: vehicleType as any,
      vehicleRegNumber,
      swishNumber,
      bankAccount,
      serviceZone,
      twoFactorEnabled,
      notificationPreferences: {
        emailNotifications: emailNotifs,
        smsNotifications: smsNotifs,
        soundAlerts: true,
      },
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Profile Card and Avatar preview */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden text-xl sm:text-2xl font-bold text-cyan-400 shadow-md">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{name.charAt(0)}</span>
              )}
            </div>

            {/* Quick upload overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex flex-col items-center justify-center text-[10px] font-semibold text-cyan-300 cursor-pointer"
              title="Byt profilbild"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Ändra</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{name}</h1>
              <span className="text-[10px] sm:text-[11px] font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                {currentUser.role === 'customer' ? 'Kundkonto' : currentUser.role === 'courier' ? 'Verifierat Bud' : 'Admin'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-1">
              <span>{email}</span>
              <span aria-hidden="true">·</span>
              <span>{phone}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BankID</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick action: back to portal */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView(currentUser.role === 'courier' ? 'courier' : currentUser.role === 'admin' ? 'admin' : 'customer')}
            className="w-full sm:w-auto px-4 py-3 min-h-[44px] text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 cursor-pointer text-center"
          >
            Tillbaka till {currentUser.role === 'courier' ? 'Budportalen' : currentUser.role === 'admin' ? 'Admin' : 'Mina bokningar'}
          </button>
        </div>
      </div>

      {/* Tabs navigation with overflow-x-auto */}
      <div className="flex items-center border-b border-slate-200 overflow-x-auto scrollbar-none pb-0.5">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personuppgifter & Adress</span>
          </button>

          <button
            onClick={() => setActiveTab('payout')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'payout'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{currentUser.role === 'courier' ? 'Utbetalning & Fordon' : 'Betalsätt & Faktura'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Säkerhet & BankID</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profilen sparades framgångsrikt!</span>
          </div>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ===================== TAB 1: DETAILS & AVATAR UPLOAD ===================== */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            
            {/* Profilbildshantering Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Profilbild</h3>
                <p className="text-xs text-slate-500">
                  Ladda upp en bild på dig själv för att öka tryggheten och igenkänningen vid överlämning.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-3xl text-slate-700 shadow-inner">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profilbild"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{name.charAt(0)}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ladda upp bild</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Ta bort</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Stöder JPG, PNG och WEBP upp till 4 MB.
                  </p>

                  {/* Preset Quick Avatars */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      Eller välj ett färdigt porträtt:
                    </span>
                    <div className="flex items-center gap-2">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setAvatarUrl(av.url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                            avatarUrl === av.url ? 'border-cyan-500 ring-2 ring-cyan-200' : 'border-slate-200'
                          }`}
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Form */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Kontaktuppgifter</h3>
                <p className="text-xs text-slate-500">
                  Dessa uppgifter används för bokningsbekräftelser och kontakt under pågående uppdrag.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fullständigt namn *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-postadress *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hemstad / Huvudområde
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Customer specific defaults */}
              {currentUser.role === 'customer' && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Standard leveransadress för snabbokning
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gatuadress
                      </label>
                      <input
                        type="text"
                        value={defaultAddress}
                        onChange={(e) => setDefaultAddress(e.target.value)}
                        placeholder="T.ex. Odengatan 45"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Portkod
                      </label>
                      <input
                        type="text"
                        value={defaultDoorCode}
                        onChange={(e) => setDefaultDoorCode(e.target.value)}
                        placeholder="T.ex. 1904"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ===================== TAB 2: PAYOUT & VEHICLE (COURIER) / BILLING ===================== */}
        {activeTab === 'payout' && (
          <div className="space-y-8">
            {currentUser.role === 'courier' ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Fordon & Utbetalningsuppgifter (Bud)</h3>
                  <p className="text-xs text-slate-500">
                    HemBud betalar ut 100% av din intjänade körersättning direkt via Swish eller Bankgiro.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Fordonstyp för uppdrag
                      </label>
                      {vehicleType === 'Inget fordon (Gående / Kollektivtrafik)' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Footprints className="w-3 h-3 text-emerald-600" />
                          <span>Till fots / Kollektivt</span>
                        </span>
                      )}
                    </div>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Inget fordon (Gående / Kollektivtrafik)">Inget fordon (Gående / Kollektivtrafik)</option>
                      <option value="Cykel/Lådcykel">Cykel / Lådcykel (City express)</option>
                      <option value="Elbil">Elbil (Miljövänlig bil)</option>
                      <option value="Personbil">Personbil (Kombi/Halvkombi)</option>
                      <option value="Skåpbil">Skåpbil (Klarar otympliga möbler)</option>
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {vehicleType === 'Inget fordon (Gående / Kollektivtrafik)'
                        ? 'Utmärkt för ombudshämtningar, dokument och mindre paket i närområdet.'
                        : 'Matchas mot lämpliga paketstorlekar och rutter.'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registreringsnummer {vehicleType === 'Inget fordon (Gående / Kollektivtrafik)' ? '(Krävs ej)' : ''}
                    </label>
                    <input
                      type="text"
                      value={vehicleType === 'Inget fordon (Gående / Kollektivtrafik)' ? '' : vehicleRegNumber}
                      disabled={vehicleType === 'Inget fordon (Gående / Kollektivtrafik)'}
                      onChange={(e) => setVehicleRegNumber(e.target.value.toUpperCase())}
                      placeholder={vehicleType === 'Inget fordon (Gående / Kollektivtrafik)' ? 'Krävs ej för gående bud' : 'ABC 123'}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl font-mono uppercase font-semibold ${
                        vehicleType === 'Inget fordon (Gående / Kollektivtrafik)'
                          ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900'
                      }`}
                    />
                    {vehicleType === 'Inget fordon (Gående / Kollektivtrafik)' ? (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Inget registreringsnummer krävs – du levererar till fots eller med kollektivtrafik.
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Visas för kunden vid transporten.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Swish-nummer för direktutbetalning
                    </label>
                    <input
                      type="tel"
                      value={swishNumber}
                      onChange={(e) => setSwishNumber(e.target.value)}
                      placeholder="07X-XXX XX XX"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bankkonto / Bankgiro
                    </label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="Clearing & kontonr"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bevakat uppdragsområde
                    </label>
                    <input
                      type="text"
                      value={serviceZone}
                      onChange={(e) => setServiceZone(e.target.value)}
                      placeholder="T.ex. Stockholm Innerstad, Solna, Sundbyberg"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Du får prioriterade notiser när nya uppdrag skapas inom dina valda zoner.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Betalsätt & Kvitton</h3>
                  <p className="text-xs text-slate-500">
                    Hantera hur du betalar dina bokningar och var digitala kvitton ska skickas.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold">
                        Swish
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Swish Betalning</p>
                        <p className="text-slate-500">Kopplat till ditt mobilnummer {phone}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Standard
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Betalkort (Visa / Mastercard)</p>
                        <p className="text-slate-500">Slutar på •••• 4242</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Uppdatera
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: SECURITY & BANKID ===================== */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Säkerhet & BankID-skydd</h3>
                <p className="text-xs text-slate-500">
                  Ditt konto är skyddat med högsta svenska säkerhetsstandard via BankID.
                </p>
              </div>

              {/* BankID status banner */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Verifierad med svenskt BankID
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Ditt konto är juridiskt identifierat. Detta garanterar full trygghet för båda parter vid transporter.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
                  Status: Aktiv & Godkänd
                </span>
              </div>

              {/* Security toggles */}
              <div className="space-y-4 pt-2">
                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      Tvåstegsverifiering (2FA) vid inloggning
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Kräver BankID-bekräftelse vid inloggning från en ny webbläsare eller enhet.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      E-postnotiser vid orderuppdateringar
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Få omedelbar e-post när budet accepterat, hämtat eller levererat ditt uppdrag.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">
                      SMS-aviseringar
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Skicka SMS till mottagaren när budet är inom 10 minuter från adressen.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifs}
                    onChange={(e) => setSmsNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600 cursor-pointer"
                  />
                </label>
              </div>

              {/* Active Sessions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Inloggade enheter
                </h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-800">Denna webbläsare (Chrome / Safari)</p>
                      <p className="text-[11px] text-slate-400">Stockholm, Sverige · Aktiv nu</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Aktiv session
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Save button bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {saveSuccess && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ändringarna sparades direkt på ditt konto.</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer hover:shadow-md"
          >
            <Save className="w-4 h-4 text-cyan-400" />
            <span>Spara ändringar</span>
          </button>
        </div>

      </form>

    </div>
  );
};
