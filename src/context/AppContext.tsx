import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Booking, 
  PricingConfig, 
  ServiceType, 
  DeliveryStatus, 
  PriceBreakdown, 
  Address,
  AppNotification,
  ChatMessage
} from '../types';
import { SEED_USERS, SEED_BOOKINGS, SEED_NOTIFICATIONS } from '../data/seedData';
import { DEFAULT_PRICING_CONFIG, calculateDeliveryPrice } from '../services/pricingService';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  bookings: Booking[];
  pricingConfig: PricingConfig;
  currentView: string;
  selectedBookingId: string | null;
  preselectedService: ServiceType | null;
  notifications: AppNotification[];
  chatMessages: ChatMessage[];
  activeToast: AppNotification | null;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  setCurrentView: (view: string, preselectedService?: ServiceType, bookingId?: string) => void;
  switchRole: (role: UserRole) => void;
  createBooking: (bookingData: {
    serviceType: ServiceType;
    title: string;
    description: string;
    packageSize: any;
    weightKg?: number;
    needsCarryingHelp: boolean;
    pickupAddress: Address;
    deliveryAddress: Address;
    pickupCode?: string;
    agentName?: string;
    sellerName?: string;
    priceBreakdown: PriceBreakdown;
  }) => Booking;
  acceptBooking: (bookingId: string) => boolean;
  updateBookingStatus: (bookingId: string, status: DeliveryStatus, note?: string) => void;
  cancelBooking: (bookingId: string) => void;
  updatePricingConfig: (config: PricingConfig) => void;
  setSelectedBookingId: (id: string | null) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendChatMessage: (text: string) => void;
  dismissToast: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'support',
    senderName: 'HemBud Support',
    text: 'Hej! Välkommen till HemBuds kundservice. Hur kan vi hjälpa dig med din bokning eller transport idag?',
    timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
    quickActions: [
      { label: 'Var är mitt paket?', action: 'track_order' },
      { label: 'Hur fungerar prissättningen?', action: 'pricing_info' },
      { label: 'Hur blir jag bud?', action: 'courier_info' },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('hembud_users_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_USERS;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentView, setCurrentViewInternal] = useState<string>('home');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [preselectedService, setPreselectedService] = useState<ServiceType | null>(null);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Load bookings from localStorage
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('hembud_bookings_v3');
      if (stored) return JSON.parse(stored);
      const v2 = localStorage.getItem('hembud_bookings_v2');
      if (v2) {
        const parsed: Booking[] = JSON.parse(v2);
        const existingIds = new Set(parsed.map(b => b.id));
        const merged = [...parsed, ...SEED_BOOKINGS.filter(b => !existingIds.has(b.id))];
        return merged;
      }
    } catch {}
    return SEED_BOOKINGS;
  });

  // Load notifications from localStorage
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('hembud_notifications_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_NOTIFICATIONS;
  });

  // Load chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('hembud_chat_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

  // Load pricing config
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    try {
      const stored = localStorage.getItem('hembud_pricing_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_PRICING_CONFIG;
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hembud_bookings_v3', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('hembud_notifications_v2', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('hembud_chat_v2', JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem('hembud_users_v2', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('hembud_pricing_v2', JSON.stringify(pricingConfig));
    } catch {}
  }, [pricingConfig]);

  const currentUser = users.find(u => u.role === currentRole) || users[0];

  const updateUserProfile = (data: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, ...data };
        }
        return u;
      })
    );
  };

  const triggerNotification = (notif: AppNotification) => {
    setNotifications(prev => [notif, ...prev]);
    setActiveToast(notif);
    setTimeout(() => {
      setActiveToast(prev => (prev?.id === notif.id ? null : prev));
    }, 5500);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const setCurrentView = (view: string, service?: ServiceType, bookingId?: string) => {
    if (service) setPreselectedService(service);
    if (bookingId) setSelectedBookingId(bookingId);
    setCurrentViewInternal(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'courier' && (currentView === 'booking' || currentView === 'customer' || currentView === 'admin')) {
      setCurrentViewInternal('courier');
    } else if (role === 'customer' && (currentView === 'courier' || currentView === 'admin')) {
      setCurrentViewInternal('customer');
    } else if (role === 'admin' && (currentView === 'courier' || currentView === 'customer')) {
      setCurrentViewInternal('admin');
    }
  };

  const createBooking = (bookingData: {
    serviceType: ServiceType;
    title: string;
    description: string;
    packageSize: any;
    weightKg?: number;
    needsCarryingHelp: boolean;
    pickupAddress: Address;
    deliveryAddress: Address;
    pickupCode?: string;
    agentName?: string;
    sellerName?: string;
    priceBreakdown: PriceBreakdown;
  }): Booking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `HB-${randomNum}`;
    const trackingCode = `${newId}-SE`;
    const now = new Date().toISOString();

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      trackingCode,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      status: 'pending',
      createdAt: now,
      deliveryProgress: 0.0,
      statusTimeline: [
        {
          status: 'pending',
          timestamp: now,
          note: 'Bokning skapad av kund. Uppdraget är nu synligt för verifierade bud på marknadsplatsen.',
        },
      ],
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send in-app notification & simulated email to couriers in the area
    triggerNotification({
      id: `notif_new_${newId}`,
      userId: 'user_cour_1',
      recipientRole: 'courier',
      title: 'Nytt tillgängligt uppdrag i ditt område!',
      message: `${newBooking.title} (${newBooking.pickupAddress.city} → ${newBooking.deliveryAddress.city}). Ersättning: ${newBooking.priceBreakdown.courierEarnings} kr.`,
      type: 'new_mission',
      bookingId: newId,
      trackingCode,
      timestamp: now,
      read: false,
      emailPreview: {
        subject: `Nytt uppdrag: ${newBooking.title} – ${newBooking.priceBreakdown.courierEarnings} kr`,
        recipientEmail: 'johan.bud@example.se',
        recipientName: 'Johan Bergström',
        sentAt: new Date().toLocaleString('sv-SE'),
        snippet: `Ett nytt uppdrag med ${newBooking.priceBreakdown.courierEarnings} kr ersättning finns tillgängligt för oberoende acceptans.`,
        orderNumber: trackingCode,
        items: [
          { label: 'Uppdrag', value: newBooking.title },
          { label: 'Upphämtning', value: `${newBooking.pickupAddress.street}, ${newBooking.pickupAddress.city}` },
          { label: 'Leverans', value: `${newBooking.deliveryAddress.street}, ${newBooking.deliveryAddress.city}` },
          { label: 'Din ersättning', value: `${newBooking.priceBreakdown.courierEarnings} kr (100% till dig)` },
        ],
      },
    });

    return newBooking;
  };

  const acceptBooking = (bookingId: string): boolean => {
    const courier = users.find(u => u.role === 'courier') || currentUser;
    const now = new Date().toISOString();
    let acceptedBookingTitle = 'Uppdrag';
    let customerId = 'user_cust_1';
    let trackingCode = '';
    let customerName = 'Kund';

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId && b.status === 'pending') {
          acceptedBookingTitle = b.title;
          customerId = b.customerId;
          trackingCode = b.trackingCode;
          customerName = b.customerName;

          return {
            ...b,
            status: 'accepted',
            courierId: courier.id,
            courierName: courier.name,
            courierPhone: courier.phone,
            courierVehicle: courier.vehicleType ? `${courier.vehicleType} (Verifierad)` : 'Elbil',
            acceptedAt: now,
            deliveryProgress: 0.15,
            statusTimeline: [
              ...b.statusTimeline,
              {
                status: 'accepted',
                timestamp: now,
                note: `${courier.name} har accepterat transporten och förbereder upphämtning.`,
              },
            ],
          };
        }
        return b;
      })
    );

    // Send notification & email to Customer that courier accepted
    triggerNotification({
      id: `notif_accept_${bookingId}`,
      userId: customerId,
      recipientRole: 'customer',
      title: '🚚 Ett bud har accepterat din transport!',
      message: `${courier.name} har accepterat "${acceptedBookingTitle}" (${trackingCode}) och kör mot upphämtningsadressen.`,
      type: 'accepted',
      bookingId,
      trackingCode,
      timestamp: now,
      read: false,
      emailPreview: {
        subject: `Bud tilldelat för ${trackingCode}: ${courier.name} kör ditt uppdrag`,
        recipientEmail: 'anna.svensson@example.se',
        recipientName: customerName,
        sentAt: new Date().toLocaleString('sv-SE'),
        snippet: `${courier.name} har accepterat din körning. Du kan nu följa budets position på kartan i realtid.`,
        orderNumber: trackingCode,
        items: [
          { label: 'Uppdrag', value: acceptedBookingTitle },
          { label: 'Budets namn', value: courier.name },
          { label: 'Fordon', value: courier.vehicleType || 'Elbil' },
          { label: 'Telefon bud', value: courier.phone },
        ],
      },
    });

    return true;
  };

  const updateBookingStatus = (bookingId: string, status: DeliveryStatus, note?: string) => {
    const now = new Date().toISOString();
    let currentBooking: Booking | undefined;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const updatedProgress = status === 'in_transit' ? 0.65 : status === 'delivered' ? 1.0 : b.deliveryProgress;
          const updated: Booking = {
            ...b,
            status,
            deliveryProgress: updatedProgress,
            statusTimeline: [
              ...b.statusTimeline,
              {
                status,
                timestamp: now,
                note: note || (status === 'in_transit' ? 'Paketet har hämtats och är på väg mot mottagaren.' : 'Leverans slutförd och kvitterad.'),
              },
            ],
          };

          if (status === 'in_transit') {
            updated.pickedUpAt = now;
          } else if (status === 'delivered') {
            updated.deliveredAt = now;
            if (note) updated.deliveryNote = note;
          }

          currentBooking = updated;
          return updated;
        }
        return b;
      })
    );

    // Send notifications according to user request:
    // "Skicka notiser till kunder när deras transport är accepterad, på väg, upphämtad och levererad."
    if (currentBooking) {
      const b = currentBooking as Booking;
      if (status === 'in_transit') {
        triggerNotification({
          id: `notif_transit_${bookingId}_${Date.now()}`,
          userId: b.customerId,
          recipientRole: 'customer',
          title: '📦 Paketet är upphämtat och på väg!',
          message: `${b.courierName || 'Budet'} har hämtat "${b.title}" och kör nu mot leveransadressen.`,
          type: 'in_transit',
          bookingId: b.id,
          trackingCode: b.trackingCode,
          timestamp: now,
          read: false,
          emailPreview: {
            subject: `Paketet är upphämtat: ${b.trackingCode} är på väg`,
            recipientEmail: 'anna.svensson@example.se',
            recipientName: b.customerName,
            sentAt: new Date().toLocaleString('sv-SE'),
            snippet: `Ditt paket har hämtats hos avsändaren och transporteras nu mot ${b.deliveryAddress.street}.`,
            orderNumber: b.trackingCode,
            items: [
              { label: 'Uppdrag', value: b.title },
              { label: 'Status', value: 'Upphämtat / På väg (In transit)' },
              { label: 'Levereras till', value: `${b.deliveryAddress.street}, ${b.deliveryAddress.city}` },
              { label: 'Beräknad ankomst', value: 'Om ca 10–15 minuter' },
            ],
          },
        });
      } else if (status === 'delivered') {
        triggerNotification({
          id: `notif_delivered_${bookingId}_${Date.now()}`,
          userId: b.customerId,
          recipientRole: 'customer',
          title: '✅ Leverans slutförd!',
          message: `Uppdraget "${b.title}" har levererats till ${b.deliveryAddress.contactName}. Kvittens finns sparad.`,
          type: 'delivered',
          bookingId: b.id,
          trackingCode: b.trackingCode,
          timestamp: now,
          read: false,
          emailPreview: {
            subject: `Leveransbekräftelse och kvitto: ${b.trackingCode}`,
            recipientEmail: 'anna.svensson@example.se',
            recipientName: b.customerName,
            sentAt: new Date().toLocaleString('sv-SE'),
            snippet: `Din transport är nu slutförd. Tack för att du använder HemBud!`,
            orderNumber: b.trackingCode,
            items: [
              { label: 'Uppdrag', value: b.title },
              { label: 'Leveranstid', value: new Date(now).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) },
              { label: 'Överlämnat till', value: b.deliveryAddress.contactName },
              { label: 'Totalt betalt', value: `${b.priceBreakdown.totalCustomerPrice} kr inkl. moms` },
              { label: 'Kvittensnotering', value: b.deliveryNote || 'Överlämnad personligen' },
            ],
          },
        });
      }
    }
  };

  const cancelBooking = (bookingId: string) => {
    const now = new Date().toISOString();
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId && b.status === 'pending') {
          return {
            ...b,
            status: 'cancelled',
            statusTimeline: [
              ...b.statusTimeline,
              {
                status: 'cancelled',
                timestamp: now,
                note: 'Bokningen avbröts av kunden.',
              },
            ],
          };
        }
        return b;
      })
    );
  };

  const updatePricingConfig = (newConfig: PricingConfig) => {
    setPricingConfig(newConfig);
  };

  // Support Chat response logic
  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Intelligent contextual answer
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      const activeOrder = bookings.find(b => b.customerId === currentUser.id && (b.status === 'in_transit' || b.status === 'accepted' || b.status === 'pending'));

      if (lower.includes('var är mitt paket') || lower.includes('spåra') || lower.includes('status') || lower.includes('när kommer')) {
        if (activeOrder) {
          const statusText = activeOrder.status === 'in_transit' 
            ? `Ditt paket (${activeOrder.trackingCode}: "${activeOrder.title}") är just nu på väg i bil med budet ${activeOrder.courierName || 'Johan'}! Du kan följa positionen direkt på live-kartan under fliken Kundpanel.`
            : activeOrder.status === 'accepted'
            ? `Ditt uppdrag (${activeOrder.trackingCode}) är accepterat av ${activeOrder.courierName}. Föraren är på väg till upphämtningsadressen.`
            : `Ditt uppdrag (${activeOrder.trackingCode}) söker just nu ett ledigt bud i ditt område. Du får en notis så fort ett bud accepterat körningen!`;
          reply = statusText;
        } else {
          reply = 'Du har inga pågående aktiva transporter just nu. Du kan enkelt boka en ny transport via knappen "Boka transport" i menyn!';
        }
      } else if (lower.includes('pris') || lower.includes('ersättning') || lower.includes('kostar') || lower.includes('avgift')) {
        reply = `HemBud tillämpar 100% öppen prissättning: Budets ersättning beräknas på baspris (${pricingConfig.serviceBaseRates.package} kr) + ${pricingConfig.ratePerKm} kr/km + ev. storlekstillägg. HemBud tar endast ${pricingConfig.serviceFeePercentage}% i transparent serviceavgift för drift, försäkring och support. Inga dolda påslag!`;
      } else if (lower.includes('bli bud') || lower.includes('köra') || lower.includes('förare')) {
        reply = 'Vad kul att du vill köra för HemBud! Du registrerar dig med svenskt BankID, väljer ditt fordon (cykel, bil eller skåpbil) och kan därefter fritt välja bland lediga uppdrag på marknadsplatsen. Inget automatiskt tvång.';
      } else if (lower.includes('ombud') || lower.includes('avi') || lower.includes('postnord') || lower.includes('paketbox')) {
        reply = 'Vid ombudshämtning anger du ditt sändningsnummer eller hämtkod/PIN i formuläret. Budet visar upp legitimation/fullmakt och hämtar ut paketet åt dig, direkt hem till dörren!';
      } else if (lower.includes('bärhjälp') || lower.includes('tung') || lower.includes('trapp')) {
        reply = `Om du har tunga föremål eller saknar hiss kan du välja bärhjälp som tillval (+${pricingConfig.carryingHelpFee} kr). Den summan går oavkortat till budet som bär upp försändelsen till din dörr.`;
      } else {
        reply = `Tack för ditt meddelande! Vi på HemBud finns här för att göra dina transporter så smidiga som möjligt. Har du specifika frågor om en bokning kan du ange ditt ordernummer (t.ex. HB-8480-SE) eller ringa vår telefonsupport på 08-120 40 00.`;
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'support',
        senderName: 'HemBud Support',
        text: reply,
        timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const resetToDefaultData = () => {
    setBookings(SEED_BOOKINGS);
    setNotifications(SEED_NOTIFICATIONS);
    setPricingConfig(DEFAULT_PRICING_CONFIG);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setUsers(SEED_USERS);
    localStorage.removeItem('hembud_users_v2');
    localStorage.removeItem('hembud_bookings_v2');
    localStorage.removeItem('hembud_notifications_v2');
    localStorage.removeItem('hembud_chat_v2');
    localStorage.removeItem('hembud_pricing_v2');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        bookings,
        pricingConfig,
        currentView,
        selectedBookingId,
        preselectedService,
        notifications,
        chatMessages,
        activeToast,
        isChatOpen,
        setIsChatOpen,
        setCurrentView,
        switchRole,
        createBooking,
        acceptBooking,
        updateBookingStatus,
        cancelBooking,
        updatePricingConfig,
        setSelectedBookingId,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendChatMessage,
        dismissToast,
        updateUserProfile,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
