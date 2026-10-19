export type UserRole = 'customer' | 'courier' | 'admin';

export type ServiceType = 'package' | 'marketplace' | 'agent_pickup';

export type PackageSize = 'small' | 'medium' | 'large' | 'bulky';

export type DeliveryStatus = 
  | 'pending'       // Väntar på bud / Söker bud
  | 'accepted'      // Accepterad av bud
  | 'in_transit'    // Upphämtad / På väg
  | 'delivered'     // Levererad
  | 'cancelled';    // Avbruten

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  verifiedBankId: boolean;
  avatarUrl?: string;
  // Customer specific
  defaultAddress?: string;
  defaultDoorCode?: string;
  // Courier specific
  rating?: number;
  totalDeliveries?: number;
  vehicleType?: 'Cykel/Lådcykel' | 'Personbil' | 'Skåpbil' | 'Elbil';
  vehicleRegNumber?: string;
  swishNumber?: string;
  bankAccount?: string;
  serviceZone?: string;
  // Security
  twoFactorEnabled?: boolean;
  notificationPreferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    soundAlerts: boolean;
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  doorCode?: string;
  floor?: string;
  contactName: string;
  contactPhone: string;
  instructions?: string;
  coordinates?: Coordinates;
}

export interface PriceBreakdown {
  courierEarnings: number;     // Budets ersättning (100% of transport subtotal)
  serviceFee: number;          // HemBuds serviceavgift (e.g., 18%)
  totalCustomerPrice: number;  // Totalpris för kunden (courierEarnings + serviceFee)
  basePrice: number;
  distancePrice: number;
  sizePrice: number;
  extraHelpPrice: number;
  distanceKm: number;
}

export interface PricingConfig {
  serviceBaseRates: {
    package: number;         // Skicka paket
    marketplace: number;     // Hämta köp (Blocket/Tradera)
    agent_pickup: number;    // Hämta hos ombud
  };
  ratePerKm: number;         // kr/km
  sizeSurcharges: {
    small: number;
    medium: number;
    large: number;
    bulky: number;
  };
  carryingHelpFee: number;   // Bärhjälp
  serviceFeePercentage: number; // e.g. 18%
}

export interface StatusUpdate {
  status: DeliveryStatus;
  timestamp: string;
  note?: string;
}

export interface Booking {
  id: string;
  trackingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  packageSize: PackageSize;
  weightKg?: number;
  needsCarryingHelp: boolean;
  
  // Specific for agent pickup or marketplace
  pickupCode?: string;      // Avi-kod / PIN-kod för ombud
  agentName?: string;       // T.ex. PostNord Företagscenter, ICA Nära, Instabox
  sellerName?: string;      // T.ex. Säljare på Blocket

  pickupAddress: Address;
  deliveryAddress: Address;
  
  priceBreakdown: PriceBreakdown;
  status: DeliveryStatus;
  
  courierId?: string;
  courierName?: string;
  courierPhone?: string;
  courierVehicle?: string;

  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  deliveryNote?: string;
  
  statusTimeline: StatusUpdate[];
  // Simulated courier progress along route (0 to 1)
  deliveryProgress?: number;
}

export interface EmailPreview {
  subject: string;
  recipientEmail: string;
  recipientName: string;
  sentAt: string;
  snippet: string;
  orderNumber?: string;
  items?: { label: string; value: string }[];
}

export interface AppNotification {
  id: string;
  userId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  type: 'accepted' | 'in_transit' | 'delivered' | 'new_mission' | 'info';
  bookingId?: string;
  trackingCode?: string;
  timestamp: string;
  read: boolean;
  emailPreview?: EmailPreview;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}
