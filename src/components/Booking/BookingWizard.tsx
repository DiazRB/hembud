import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceType, PackageSize, Address, PriceBreakdown } from '../../types';
import { calculateDeliveryPrice, estimateDistanceKm } from '../../services/pricingService';
import { 
  Package, 
  ShoppingBag, 
  Store, 
  MapPin, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Info,
  Building,
  User,
  Phone,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BookingWizard: React.FC = () => {
  const { preselectedService, pricingConfig, createBooking, setCurrentView, currentUser } = useApp();

  // Step state (1 to 4) and transition direction
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [createdBookingCode, setCreatedBookingCode] = useState<string>('');
  const [createdBookingId, setCreatedBookingId] = useState<string>('');

  // Form states
  const [serviceType, setServiceType] = useState<ServiceType>(preselectedService || 'package');
  
  // Title & description
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [packageSize, setPackageSize] = useState<PackageSize>('medium');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [needsCarryingHelp, setNeedsCarryingHelp] = useState<boolean>(false);
  
  // Specific fields
  const [pickupCode, setPickupCode] = useState('');
  const [agentName, setAgentName] = useState('');
  const [sellerName, setSellerName] = useState('');

  // Addresses
  const [pickupAddress, setPickupAddress] = useState<Address>({
    street: '',
    postalCode: '',
    city: 'Stockholm',
    doorCode: '',
    floor: '',
    contactName: currentUser.name || '',
    contactPhone: currentUser.phone || '',
    instructions: '',
  });

  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    street: '',
    postalCode: '',
    city: 'Stockholm',
    doorCode: '',
    floor: '',
    contactName: '',
    contactPhone: '',
    instructions: '',
  });

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync with preselectedService if passed from home cards
  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
      if (preselectedService === 'agent_pickup') {
        setTitle('Hämta paket hos ombud');
        setPackageSize('small');
      } else if (preselectedService === 'marketplace') {
        setTitle('Hämta köp från marknadsplats');
        setPackageSize('medium');
      } else {
        setTitle('Skicka paket');
      }
    }
  }, [preselectedService]);

  // Calculate dynamic distance
  const distanceKm = estimateDistanceKm(
    pickupAddress.city,
    deliveryAddress.city,
    pickupAddress.postalCode,
    deliveryAddress.postalCode
  );

  // Central price calculation
  const priceBreakdown: PriceBreakdown = calculateDeliveryPrice(
    serviceType,
    distanceKm,
    packageSize,
    needsCarryingHelp,
    pricingConfig
  );

  // Quick fill samples for frictionless testing
  const handleQuickFill = (preset: 'ikea' | 'blocket' | 'ombud') => {
    if (preset === 'blocket') {
      setServiceType('marketplace');
      setTitle('Hämta matbordsstolar på Blocket');
      setDescription('4 st stolar i teak. Säljaren har packat dem med skyddsplast. Betalt via Swish.');
      setSellerName('Mikael S (Blocket)');
      setPackageSize('large');
      setWeightKg(16);
      setNeedsCarryingHelp(true);
      setPickupAddress({
        street: 'Götgatan 48',
        postalCode: '118 26',
        city: 'Stockholm (Södermalm)',
        doorCode: '1240',
        floor: '2 tr',
        contactName: 'Mikael Sundström (Säljare)',
        contactPhone: '070-112 23 34',
        instructions: 'Hämta i lägenheten, hiss finns.',
      });
      setDeliveryAddress({
        street: 'Karlbergsvägen 22',
        postalCode: '113 27',
        city: 'Stockholm (Vasastan)',
        doorCode: '9081',
        floor: '4 tr',
        contactName: currentUser.name,
        contactPhone: currentUser.phone,
        instructions: 'Bärhjälp önskas upp till lägenheten.',
      });
    } else if (preset === 'ombud') {
      setServiceType('agent_pickup');
      setTitle('Hämta försändelse hos PostNord');
      setDescription('Paket från Apotea och Boozt. Hämtas ut med fullmakt/QR.');
      setAgentName('ICA Kvantum Värtan (PostNord)');
      setPickupCode('PN-882419');
      setPackageSize('small');
      setWeightKg(3);
      setNeedsCarryingHelp(false);
      setPickupAddress({
        street: 'Malmvägen 1',
        postalCode: '115 41',
        city: 'Stockholm (Gärdet)',
        doorCode: '',
        floor: '',
        contactName: 'ICA Kvantum Värtan',
        contactPhone: '08-123 45 67',
        instructions: 'Paketutlämningen i förbutiken. Visa hämtkod PN-882419.',
      });
      setDeliveryAddress({
        street: 'Valhallavägen 104',
        postalCode: '114 41',
        city: 'Stockholm (Östermalm)',
        doorCode: '3341',
        floor: '1 tr',
        contactName: currentUser.name,
        contactPhone: currentUser.phone,
        instructions: 'Ring på porttelefonen.',
      });
    } else {
      setServiceType('package');
      setTitle('Skicka reservdel till cykel');
      setDescription('Kartong med cykelhjul och tillbehör till min bror.');
      setPackageSize('medium');
      setWeightKg(6);
      setNeedsCarryingHelp(false);
      setPickupAddress({
        street: 'Linnégatan 15',
        postalCode: '114 47',
        city: 'Stockholm (Östermalm)',
        doorCode: '5540',
        floor: '3 tr',
        contactName: currentUser.name,
        contactPhone: currentUser.phone,
        instructions: 'Hämtas hos mig.',
      });
      setDeliveryAddress({
        street: 'Hornsbruksgatan 9',
        postalCode: '117 34',
        city: 'Stockholm (Hornstull)',
        doorCode: '7721',
        floor: 'Bv',
        contactName: 'Filip Svensson',
        contactPhone: '073-999 11 22',
        instructions: 'Lämna direkt till Filip.',
      });
    }
    setErrors({});
  };

  // Validation before step changes
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!serviceType) {
        newErrors.serviceType = 'Vänligen välj en tjänst';
      }
    } else if (step === 2) {
      if (!pickupAddress.street.trim()) {
        newErrors.pickupStreet = 'Ange upphämtningsgata och nummer';
      }
      if (!pickupAddress.city.trim()) {
        newErrors.pickupCity = 'Ange stad för upphämtning';
      }
      if (!pickupAddress.contactName.trim()) {
        newErrors.pickupContact = 'Ange kontaktperson vid upphämtning';
      }
      if (!pickupAddress.contactPhone.trim()) {
        newErrors.pickupPhone = 'Ange telefonnummer vid upphämtning';
      }

      if (!deliveryAddress.street.trim()) {
        newErrors.deliveryStreet = 'Ange leveransadress och nummer';
      }
      if (!deliveryAddress.city.trim()) {
        newErrors.deliveryCity = 'Ange stad för leverans';
      }
      if (!deliveryAddress.contactName.trim()) {
        newErrors.deliveryContact = 'Ange mottagarens namn';
      }
      if (!deliveryAddress.contactPhone.trim()) {
        newErrors.deliveryPhone = 'Ange mottagarens telefonnummer';
      }
    } else if (step === 3) {
      if (!title.trim()) {
        newErrors.title = 'Ange en kort titel på vad som ska fraktas';
      }
      if (!description.trim()) {
        newErrors.description = 'Beskriv föremålet så budet vet vad som väntas';
      }
      if (serviceType === 'agent_pickup' && !pickupCode.trim()) {
        newErrors.pickupCode = 'Ange avi-nummer eller hämtkod för ombudet';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep === currentStep) return;
    // Allow jumping back freely, or jumping forward if current step is valid
    if (targetStep < currentStep || validateStep(currentStep)) {
      setDirection(targetStep > currentStep ? 1 : -1);
      setCurrentStep(targetStep);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleConfirmBooking = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const created = createBooking({
      serviceType,
      title: title || (serviceType === 'package' ? 'Paketleverans' : serviceType === 'marketplace' ? 'Hämta köp' : 'Ombudshämtning'),
      description: description || 'Transportbokning',
      packageSize,
      weightKg,
      needsCarryingHelp,
      pickupAddress,
      deliveryAddress,
      pickupCode: serviceType === 'agent_pickup' ? pickupCode : undefined,
      agentName: serviceType === 'agent_pickup' ? agentName : undefined,
      sellerName: serviceType === 'marketplace' ? sellerName : undefined,
      priceBreakdown,
    });

    setCreatedBookingCode(created.trackingCode);
    setCreatedBookingId(created.id);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded">
              Bokning bekräftad
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Ditt uppdrag är nu publicerat!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Uppdraget är synligt för verifierade bud i ditt område. Du får information så fort ett bud har accepterat körningen.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 text-left max-w-md mx-auto space-y-3">
            <div className="flex justify-between items-baseline text-xs text-slate-500 pb-2 border-b border-slate-200">
              <span>Spårningskod:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{createdBookingCode}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Uppdrag:</span>
              <span className="font-medium text-slate-900">{title}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Rutt:</span>
              <span className="font-medium text-slate-900">{pickupAddress.city} → {deliveryAddress.city}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Budets ersättning:</span>
              <span className="font-mono font-medium text-slate-900">{priceBreakdown.courierEarnings} kr</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>HemBud serviceavgift:</span>
              <span className="font-mono font-medium text-slate-900">{priceBreakdown.serviceFee} kr</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Ditt totalpris:</span>
              <span className="font-mono text-cyan-700 text-base">{priceBreakdown.totalCustomerPrice} kr</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentView('customer', undefined, createdBookingId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <span>Se mina bokningar</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentStep(1);
                setTitle('');
                setDescription('');
              }}
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Skapa ytterligare en bokning
            </button>
          </div>

          <div className="pt-4 text-xs text-slate-500">
            <span>Vill du testa hur det ser ut för föraren? </span>
            <button
              onClick={() => setCurrentView('courier')}
              className="text-cyan-700 font-semibold underline hover:text-cyan-800 cursor-pointer"
            >
              Växla till Budens sida här
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      
      {/* Header and Step Indicator */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Boka transport med HemBud
        </h1>
        <p className="text-sm text-slate-600">
          Fyll i uppdragets detaljer i fyra enkla steg. Få ett fast och bindande pris omedelbart.
        </p>

        {/* Quick Demo Pre-fill toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-600 font-medium">Snabbfyll exempel:</span>
          <button
            type="button"
            onClick={() => handleQuickFill('blocket')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
          >
            Blocket-möbel
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('ombud')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
          >
            PostNord ombud
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('ikea')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer transition-colors"
          >
            Vanligt paket
          </button>
        </div>
      </div>

      {/* Visual Step Progress Bar with Smooth Transitions */}
      <div className="mb-12 max-w-3xl mx-auto px-2 sm:px-6">
        <div className="relative">
          {/* Track Line connecting step circles */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
          
          {/* Animated Progress Fill */}
          <motion.div
            className="absolute top-5 left-8 h-1 bg-gradient-to-r from-slate-900 via-cyan-500 to-cyan-400 -translate-y-1/2 z-0 rounded-full"
            initial={false}
            animate={{
              width: `calc(${((currentStep - 1) / 3) * 100}% - ${currentStep === 1 ? '0px' : '0px'})`,
              maxWidth: 'calc(100% - 64px)',
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          />

          {/* 4 Step Nodes */}
          <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
            {[
              { step: 1, label: 'Tjänst', sub: 'Typ av uppdrag' },
              { step: 2, label: 'Adresser', sub: 'Rutt & avstånd' },
              { step: 3, label: 'Föremål', sub: 'Mått & instruktion' },
              { step: 4, label: 'Pris & Boka', sub: 'Fast tariff' },
            ].map((item) => {
              const isPassed = currentStep > item.step;
              const isCurrent = currentStep === item.step;
              const isUpcoming = currentStep < item.step;

              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => handleStepClick(item.step)}
                  className={`group flex flex-col items-center focus:outline-none transition-all cursor-pointer ${
                    isUpcoming ? 'opacity-80 hover:opacity-100' : ''
                  }`}
                  title={`Gå till steg ${item.step}: ${item.label}`}
                >
                  {/* Step Node Circle */}
                  <div className="relative mb-2">
                    {/* Active Halo Glow */}
                    {isCurrent && (
                      <motion.div
                        layoutId="activeStepHalo"
                        className="absolute -inset-2 rounded-2xl bg-cyan-400/25 blur-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}

                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-slate-900 text-cyan-400 ring-2 ring-cyan-400 shadow-md scale-105'
                          : isPassed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-500 border-2 border-slate-200 group-hover:border-slate-300'
                      }`}
                    >
                      {isPassed ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                        >
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </motion.div>
                      ) : (
                        <span className="font-mono text-sm">{item.step}</span>
                      )}
                    </motion.div>
                  </div>

                  {/* Step Labels */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-xs font-bold tracking-tight transition-colors ${
                        isCurrent
                          ? 'text-slate-900'
                          : isPassed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] text-slate-500 mt-0.5">
                      {item.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Step Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 overflow-hidden">
        
        <AnimatePresence mode="wait" custom={direction}>
          {/* ==================== STEP 1: SERVICE SELECTION ==================== */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 24 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Steg 1: Välj typ av transporttjänst
              </h2>
              <p className="text-sm text-slate-500">
                Vad vill du ha hjälp att transportera idag?
              </p>
            </div>

            {errors.serviceType && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.serviceType}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[
                {
                  id: 'package' as ServiceType,
                  title: 'Skicka paket',
                  subtitle: 'Direkt mellan två adresser',
                  desc: 'Hämtas hos dig eller på kontoret och körs direkt till mottagarens dörr.',
                  icon: Package,
                  base: `${pricingConfig.serviceBaseRates.package} kr baspris`,
                  badgeClass: 'icon-badge-3d-cyan',
                },
                {
                  id: 'marketplace' as ServiceType,
                  title: 'Hämta mitt köp',
                  subtitle: 'Blocket, Tradera, Marketplace',
                  desc: 'Budet hämtar föremålet hos säljaren och levererar säkert hem till dig.',
                  icon: ShoppingBag,
                  base: `${pricingConfig.serviceBaseRates.marketplace} kr baspris`,
                  badgeClass: 'icon-badge-3d-amber',
                },
                {
                  id: 'agent_pickup' as ServiceType,
                  title: 'Hämta hos ombud',
                  subtitle: 'PostNord, DHL, Instabox',
                  desc: 'Budet hämtar ditt anlända paket i förbutik eller box med din hämtkod.',
                  icon: Store,
                  base: `${pricingConfig.serviceBaseRates.agent_pickup} kr baspris`,
                  badgeClass: 'icon-badge-3d-emerald',
                },
              ].map((s) => {
                const Icon = s.icon;
                const isSelected = serviceType === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setServiceType(s.id);
                      if (s.id === 'agent_pickup' && !title) setTitle('Hämta paket hos ombud');
                      if (s.id === 'marketplace' && !title) setTitle('Hämta marknadsköp');
                      if (s.id === 'package' && !title) setTitle('Skicka paket');
                    }}
                    className={`relative rounded-3xl p-6 transition-all cursor-pointer flex flex-col justify-between active:translate-y-[2px] active:scale-[0.98] ${
                      isSelected
                        ? 'card-3d-light border-cyan-400 ring-2 ring-cyan-200/80 shadow-[0_10px_24px_-4px_rgba(6,182,212,0.22)]'
                        : 'card-3d-light hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${s.badgeClass} flex items-center justify-center shrink-0`}>
                          <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                        </div>
                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mb-1">{s.title}</h3>
                      <p className="text-xs font-semibold text-cyan-700 mb-2">{s.subtitle}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 text-xs font-mono font-semibold text-slate-500">
                      {s.base}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ==================== STEP 2: ADDRESSES & ROUTE ==================== */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Steg 2: Upphämtnings- och leveransadress
              </h2>
              <p className="text-sm text-slate-500">
                Ange var budet ska hämta och vart försändelsen ska köras.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Pickup Address Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {serviceType === 'agent_pickup' ? 'Ombudets adress' : 'Upphämtningsadress (Från)'}
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gatuadress & gatunummer *
                  </label>
                  <input
                    type="text"
                    placeholder="T.ex. Ringvägen 104 eller PostNord Ombud ICA"
                    value={pickupAddress.street}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, street: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      errors.pickupStreet ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.pickupStreet && <p className="text-red-600 text-xs mt-1">{errors.pickupStreet}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postnummer
                    </label>
                    <input
                      type="text"
                      placeholder="116 61"
                      value={pickupAddress.postalCode}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stad/Ort *
                    </label>
                    <input
                      type="text"
                      placeholder="Stockholm"
                      value={pickupAddress.city}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, city: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        errors.pickupCity ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portkod / Våning
                    </label>
                    <input
                      type="text"
                      placeholder="Kod: 4821, 2 tr"
                      value={pickupAddress.doorCode}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, doorCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hiss finns?
                    </label>
                    <select
                      value={pickupAddress.floor}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, floor: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="">Välj...</option>
                      <option value="Hiss finns">Ja, hiss finns</option>
                      <option value="Ingen hiss">Nej, trappor</option>
                      <option value="Bottenplan">Bottenplan/Gatuplan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kontaktperson *
                    </label>
                    <input
                      type="text"
                      placeholder="Namn vid upphämtning"
                      value={pickupAddress.contactName}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, contactName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                        errors.pickupContact ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      placeholder="070-123 45 67"
                      value={pickupAddress.contactPhone}
                      onChange={(e) => setPickupAddress({ ...pickupAddress, contactPhone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                        errors.pickupPhone ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Leveransadress (Till)
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gatuadress & gatunummer *
                  </label>
                  <input
                    type="text"
                    placeholder="T.ex. Odengatan 45"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      errors.deliveryStreet ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                    }`}
                  />
                  {errors.deliveryStreet && <p className="text-red-600 text-xs mt-1">{errors.deliveryStreet}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postnummer
                    </label>
                    <input
                      type="text"
                      placeholder="113 51"
                      value={deliveryAddress.postalCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Stad/Ort *
                    </label>
                    <input
                      type="text"
                      placeholder="Stockholm"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                        errors.deliveryCity ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portkod / Våning
                    </label>
                    <input
                      type="text"
                      placeholder="Kod: 1904, 3 tr"
                      value={deliveryAddress.doorCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, doorCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hiss finns?
                    </label>
                    <select
                      value={deliveryAddress.floor}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, floor: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="">Välj...</option>
                      <option value="Hiss finns">Ja, hiss finns</option>
                      <option value="Ingen hiss">Nej, trappor</option>
                      <option value="Bottenplan">Bottenplan/Gatuplan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mottagarens namn *
                    </label>
                    <input
                      type="text"
                      placeholder="För- och efternamn"
                      value={deliveryAddress.contactName}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, contactName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                        errors.deliveryContact ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mottagarens telefon *
                    </label>
                    <input
                      type="tel"
                      placeholder="070-987 65 43"
                      value={deliveryAddress.contactPhone}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, contactPhone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                        errors.deliveryPhone ? 'border-red-400' : 'border-slate-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Estimated Route Distance Banner */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Beräknad körsträcka mellan adresserna: <strong className="text-white font-mono">{distanceKm} km</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Körsträckersättning: <span className="font-mono text-cyan-400">{priceBreakdown.distancePrice} kr</span> ({pricingConfig.ratePerKm} kr/km)
              </span>
            </div>
          </motion.div>
        )}

        {/* ==================== STEP 3: ITEM & DETAILS ==================== */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Steg 3: Beskriv föremålet & instruktioner
              </h2>
              <p className="text-sm text-slate-500">
                Ge budet tillräcklig information för att kunna planera och transportera varsamt.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kort rubrik för uppdraget *
                </label>
                <input
                  type="text"
                  placeholder="T.ex. Hämta 2 st stolar, eller Skicka ritningar till arkitekt"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Beskrivning av föremålet *
                </label>
                <textarea
                  rows={3}
                  placeholder="Beskriv mått, innehåll, hur det är emballerat eller om något är ömtåligt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.description ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Specific fields depending on service */}
              {serviceType === 'agent_pickup' && (
                <div className="bg-cyan-50/60 border border-cyan-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-cyan-700" />
                    <span>Ombudsdetaljer & Avi</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hämtkod / Avi-nummer / PIN *
                      </label>
                      <input
                        type="text"
                        placeholder="T.ex. PN-994201 eller 4-siffrig PIN"
                        value={pickupCode}
                        onChange={(e) => setPickupCode(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-white ${
                          errors.pickupCode ? 'border-red-400' : 'border-slate-300'
                        }`}
                      />
                      {errors.pickupCode && <p className="text-red-600 text-xs mt-1">{errors.pickupCode}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ombudets namn (Valfritt)
                      </label>
                      <input
                        type="text"
                        placeholder="T.ex. ICA Nära Kungsholmstorg"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-cyan-800">
                    Vid uthämtning hos ombud använder budet BankID-fullmakt eller din delade QR-kod.
                  </p>
                </div>
              )}

              {serviceType === 'marketplace' && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-amber-700" />
                    <span>Säljarens kontaktuppgifter</span>
                  </h4>
                  <input
                    type="text"
                    placeholder="Säljarens namn eller användarnamn (t.ex. Mikael på Blocket)"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                  <p className="text-[11px] text-amber-800">
                    Kontrollera att varan är betald och att säljaren vet att ett bud från HemBud kommer och hämtar.
                  </p>
                </div>
              )}

              {/* Package Size Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Välj paketstorlek
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'small' as PackageSize, label: 'Litet paket', sub: 'Upp till 3 kg (Bok, kläder, påse)', fee: '+0 kr' },
                    { id: 'medium' as PackageSize, label: 'Mellanstort', sub: 'Upp till 10 kg (Flyttkartong)', fee: `+${pricingConfig.sizeSurcharges.medium} kr` },
                    { id: 'large' as PackageSize, label: 'Stort paket', sub: 'Upp till 25 kg (Stol, TV, skärm)', fee: `+${pricingConfig.sizeSurcharges.large} kr` },
                    { id: 'bulky' as PackageSize, label: 'Otympligt', sub: 'Möbler, kräver skåpbil', fee: `+${pricingConfig.sizeSurcharges.bulky} kr` },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPackageSize(s.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        packageSize === s.id
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-900">{s.label}</span>
                        <span className="text-[11px] font-mono text-cyan-700 font-semibold">{s.fee}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{s.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Carrying Help and Instructions */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsCarryingHelp}
                    onChange={(e) => setNeedsCarryingHelp(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Tillägg: Bärhjälp i trappor (+{pricingConfig.carryingHelpFee} kr)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Budet bär upp eller ner föremålet till lägenhetsdörren om det är tungt eller saknar hiss. Ersättningen går 100% till budet.
                    </span>
                  </div>
                </label>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==================== STEP 4: PRICE REVIEW & CONFIRMATION ==================== */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Steg 4: Prisöversikt och bekräftelse
              </h2>
              <p className="text-sm text-slate-500">
                Granska ditt uppdrag och godkänn det fasta priset.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Summary of order details */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Sammanfattning av uppdraget
                  </h3>

                  <div>
                    <span className="text-xs text-slate-400 block">Tjänst & Rubrik</span>
                    <p className="text-base font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block">Paketstorlek</span>
                      <span className="font-semibold text-slate-800 capitalize">{packageSize}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Bärhjälp</span>
                      <span className="font-semibold text-slate-800">{needsCarryingHelp ? 'Ja (Ingår)' : 'Nej'}</span>
                    </div>
                  </div>

                  {pickupCode && (
                    <div className="pt-2 text-xs">
                      <span className="text-slate-400 block">Hämtkod / Avi</span>
                      <span className="font-mono font-bold text-slate-900">{pickupCode}</span>
                    </div>
                  )}

                  {/* Route */}
                  <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-slate-400">Upphämtning:</span>
                        <p className="font-medium text-slate-900">{pickupAddress.street}, {pickupAddress.city}</p>
                        <p className="text-slate-500">Kontakt: {pickupAddress.contactName} ({pickupAddress.contactPhone})</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      <div>
                        <span className="text-slate-400">Leverans:</span>
                        <p className="font-medium text-slate-900">{deliveryAddress.street}, {deliveryAddress.city}</p>
                        <p className="text-slate-500">Mottagare: {deliveryAddress.contactName} ({deliveryAddress.contactPhone})</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900">
                  <Info className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>
                    När du bekräftar publiceras uppdraget på HemBuds öppna transportmarknad. Oberoende lokala bud kan då välja att acceptera uppdraget.
                  </span>
                </div>

              </div>

              {/* Right Column: Transparent Pricing Breakdown as strictly required */}
              <div className="lg:col-span-5">
                <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Öppen prisöversikt
                    </h3>
                    <p className="text-xs text-slate-400">
                      Garanterat fast pris enligt HemBuds centrala tariff.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Grundpris ({serviceType === 'package' ? 'Paket' : serviceType === 'marketplace' ? 'Köp' : 'Ombud'}):</span>
                      <span className="font-mono text-white">{priceBreakdown.basePrice} kr</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Avstånd ({priceBreakdown.distanceKm} km à {pricingConfig.ratePerKm} kr):</span>
                      <span className="font-mono text-white">{priceBreakdown.distancePrice} kr</span>
                    </div>

                    {priceBreakdown.sizePrice > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>Storlekstillägg:</span>
                        <span className="font-mono text-white">+{priceBreakdown.sizePrice} kr</span>
                      </div>
                    )}

                    {priceBreakdown.extraHelpPrice > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>Bärhjälp:</span>
                        <span className="font-mono text-white">+{priceBreakdown.extraHelpPrice} kr</span>
                      </div>
                    )}

                    {/* Strict Required Component 1: Budets ersättning */}
                    <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                      <div>
                        <span className="text-cyan-400 font-bold block text-xs uppercase tracking-wider">
                          1. Budets ersättning
                        </span>
                        <span className="text-[11px] text-slate-400">100% går oavkortat till föraren</span>
                      </div>
                      <span className="font-mono font-bold text-cyan-400 text-lg">
                        {priceBreakdown.courierEarnings} kr
                      </span>
                    </div>

                    {/* Strict Required Component 2: HemBuds serviceavgift */}
                    <div className="flex justify-between items-baseline pt-2">
                      <div>
                        <span className="text-slate-200 font-bold block text-xs uppercase tracking-wider">
                          2. HemBuds serviceavgift ({pricingConfig.serviceFeePercentage}%)
                        </span>
                        <span className="text-[11px] text-slate-400">Plattform, säkerhet, support</span>
                      </div>
                      <span className="font-mono font-medium text-slate-200">
                        {priceBreakdown.serviceFee} kr
                      </span>
                    </div>

                    {/* Strict Required Component 3: Kundens totalpris */}
                    <div className="pt-5 border-t border-slate-800 flex justify-between items-baseline">
                      <div>
                        <span className="text-base font-bold text-white block">
                          3. Kundens totalpris
                        </span>
                        <span className="text-xs text-slate-400">Inklusive moms</span>
                      </div>
                      <span className="font-mono text-2xl font-extrabold text-white">
                        {priceBreakdown.totalCustomerPrice} kr
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="w-full py-4 px-4 rounded-xl font-bold text-sm text-slate-950 btn-3d-cyan flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Bekräfta & publicera uppdrag</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    Inga dolda kostnader. Betalning reserveras och dras först vid fullgjord leverans.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Navigation buttons at bottom of form */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-2xl btn-3d-white text-sm font-bold text-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tillbaka</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 min-h-[48px] rounded-2xl btn-3d-slate text-sm font-bold text-white cursor-pointer"
            >
              <span>Nästa steg</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          ) : null}
        </div>

      </div>

    </div>
  );
};
