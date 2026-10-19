import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Compass, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface LiveDeliveryMapProps {
  booking: Booking;
  isCourierView?: boolean;
}

export const LiveDeliveryMap: React.FC<LiveDeliveryMapProps> = ({ booking, isCourierView = false }) => {
  // Real-time animated progress (0.0 to 1.0)
  const initialProgress = booking.status === 'delivered' 
    ? 1.0 
    : booking.status === 'in_transit' 
    ? 0.55 
    : booking.status === 'accepted' 
    ? 0.15 
    : 0.0;

  const [progress, setProgress] = useState<number>(initialProgress);
  const [isPlaying, setIsPlaying] = useState<boolean>(booking.status === 'in_transit');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Auto animate slightly if in transit to show "live GPS"
  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 0.98) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 0.98) {
            setIsPlaying(false);
            return 0.98;
          }
          return Math.min(0.98, prev + 0.006);
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  // Coordinates mapping on stylized map canvas (0 to 100% width and height)
  // Let's create realistic route points through Stockholm
  const isSouthToNorth = booking.pickupAddress.city.toLowerCase().includes('södermalm');
  
  // Start and End canvas coordinates
  const startPoint = isSouthToNorth 
    ? { x: 38, y: 78, name: booking.pickupAddress.street } 
    : { x: 32, y: 28, name: booking.pickupAddress.street };

  const endPoint = isSouthToNorth 
    ? { x: 62, y: 24, name: booking.deliveryAddress.street } 
    : { x: 74, y: 72, name: booking.deliveryAddress.street };

  // Intermediate curve points simulating real roads & bridges
  const midPoint1 = isSouthToNorth ? { x: 44, y: 58 } : { x: 48, y: 40 };
  const midPoint2 = isSouthToNorth ? { x: 50, y: 42 } : { x: 62, y: 55 };

  // Interpolate courier position along the bezier/polyline
  const getCourierPos = (t: number) => {
    // Cubic bezier interpolation
    const cx = (1 - t) ** 3 * startPoint.x + 3 * (1 - t) ** 2 * t * midPoint1.x + 3 * (1 - t) * t ** 2 * midPoint2.x + t ** 3 * endPoint.x;
    const cy = (1 - t) ** 3 * startPoint.y + 3 * (1 - t) ** 2 * t * midPoint1.y + 3 * (1 - t) * t ** 2 * midPoint2.y + t ** 3 * endPoint.y;
    return { x: cx, y: cy };
  };

  const courierPos = getCourierPos(progress);

  // Remaining distance and ETA
  const remainingKm = Math.max(0.2, Math.round((booking.priceBreakdown.distanceKm * (1 - progress)) * 10) / 10);
  const remainingMinutes = Math.max(2, Math.round(remainingKm * 2.2));

  // External GPS navigation URL
  const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    booking.pickupAddress.street + ', ' + booking.pickupAddress.city
  )}&destination=${encodeURIComponent(
    booking.deliveryAddress.street + ', ' + booking.deliveryAddress.city
  )}`;

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-white shadow-xl flex flex-col">
      
      {/* Map Header / Live Telemetry Strip */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-bold tracking-wide uppercase text-slate-200">
            Realtidsposition
          </span>
          <span className="text-slate-500">·</span>
          <span className="font-mono text-cyan-400 font-semibold">{booking.trackingCode}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {booking.status === 'delivered' ? (
                <strong className="text-emerald-400">Leverans slutförd</strong>
              ) : booking.status === 'in_transit' ? (
                <span>
                  ETA: <strong className="text-white">{remainingMinutes} min</strong> ({remainingKm} km kvar)
                </span>
              ) : (
                <span>Bud förbereder upphämtning</span>
              )}
            </span>
          </div>

          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition-colors border border-slate-700 font-semibold text-[11px]"
            title="Öppna vägbeskrivning i Google Maps"
          >
            <span>{isCourierView ? 'Starta GPS' : 'Öppna kartapp'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Stylized Interactive Map Canvas */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-950 overflow-hidden select-none">
        
        {/* Map Vector Artwork: Stockholm Roads, Bridges and Waterways */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Water gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing route line filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Land Surface */}
          <rect width="100" height="100" fill="#0f172a" />

          {/* Waterways / Riddarfjärden & Saltsjön */}
          <path 
            d="M0,52 C25,48 40,55 55,48 C70,42 85,50 100,45 L100,56 C80,60 65,54 50,58 C35,62 15,57 0,62 Z" 
            fill="url(#waterGrad)" 
          />
          <path 
            d="M58,0 C55,20 62,35 60,48 L68,48 C70,32 66,15 70,0 Z" 
            fill="url(#waterGrad)" 
          />

          {/* Secondary City Street Grids */}
          <g stroke="#1e293b" strokeWidth="0.6" strokeDasharray="1,1" opacity="0.6">
            <line x1="10" y1="10" x2="90" y2="10" />
            <line x1="10" y1="25" x2="90" y2="25" />
            <line x1="10" y1="40" x2="90" y2="40" />
            <line x1="10" y1="65" x2="90" y2="65" />
            <line x1="10" y1="80" x2="90" y2="80" />
            <line x1="20" y1="5" x2="20" y2="95" />
            <line x1="40" y1="5" x2="40" y2="95" />
            <line x1="60" y1="5" x2="60" y2="95" />
            <line x1="80" y1="5" x2="80" y2="95" />
          </g>

          {/* Major Swedish Arterials (E4 / Centralbron / Klarastrandsleden) */}
          <g stroke="#334155" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M15,95 Q35,50 50,20 Q65,10 90,5" />
            <path d="M5,40 Q45,45 95,30" />
            <path d="M30,95 Q48,60 52,40 Q55,25 58,5" />
          </g>

          {/* Bridges across water */}
          <rect x="48" y="47" width="5" height="12" fill="#475569" rx="0.5" />
          <rect x="62" y="43" width="4" height="11" fill="#475569" rx="0.5" />

          {/* Active Delivery Planned Route (Bezier Curve between Start and End) */}
          <path
            d={`M ${startPoint.x},${startPoint.y} C ${midPoint1.x},${midPoint1.y} ${midPoint2.x},${midPoint2.y} ${endPoint.x},${endPoint.y}`}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.8"
            strokeLinecap="round"
            filter="url(#routeGlow)"
          />

          {/* Traversed Route Section (Completed part) */}
          <path
            d={`M ${startPoint.x},${startPoint.y} C ${midPoint1.x},${midPoint1.y} ${midPoint2.x},${midPoint2.y} ${endPoint.x},${endPoint.y}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.4"
            strokeDasharray="2,1"
            strokeLinecap="round"
            style={{
              strokeDashoffset: 0,
              opacity: 0.9,
            }}
          />

          {/* Start Point Marker (A - Upphämtning) */}
          <g transform={`translate(${startPoint.x}, ${startPoint.y})`}>
            <circle r="3.2" fill="#10b981" />
            <circle r="1.5" fill="#ffffff" />
            <text x="0" y="7" textAnchor="middle" fill="#10b981" fontSize="3" fontWeight="bold">
              A (Upphämtning)
            </text>
          </g>

          {/* Destination Marker (B - Leverans) */}
          <g transform={`translate(${endPoint.x}, ${endPoint.y})`}>
            <circle r="3.2" fill="#f43f5e" />
            <circle r="1.5" fill="#ffffff" />
            <text x="0" y="7" textAnchor="middle" fill="#f43f5e" fontSize="3" fontWeight="bold">
              B (Leverans)
            </text>
          </g>

          {/* Live Courier Marker (Moving Van / Cargo) */}
          <g transform={`translate(${courierPos.x}, ${courierPos.y})`}>
            {/* Pulsing beacon radar */}
            <circle r="6" fill="#06b6d4" opacity="0.25">
              <animate attributeName="r" values="3;7;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Courier vehicle circle */}
            <circle r="3.8" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />
            
            {/* Heading arrow / indicator */}
            <path d="M-1.5,1.5 L0,-2 L1.5,1.5 Z" fill="#ffffff" />
          </g>
        </svg>

        {/* Courier Info Floating Pin Tag on the map */}
        <div 
          className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-all duration-300"
          style={{ 
            left: `${courierPos.x}%`, 
            top: `${courierPos.y}%` 
          }}
        >
          <div className="bg-slate-900/95 text-white px-2.5 py-1 rounded-lg border border-cyan-500/80 shadow-lg text-[10px] whitespace-nowrap flex items-center gap-1.5">
            <Truck className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold">{booking.courierName || 'HemBud Förare'}</span>
            <span className="text-cyan-400 font-mono">
              {progress >= 0.98 ? 'Framme' : '38 km/h'}
            </span>
          </div>
        </div>

        {/* Floating Zoom & Map Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.6, prev + 0.2))}
            className="w-7 h-7 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center text-xs shadow-md transition-colors"
            title="Zooma in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
            className="w-7 h-7 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg flex items-center justify-center text-xs shadow-md transition-colors"
            title="Zooma ut"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Landmark Badges */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-400/80 space-y-0.5 pointer-events-none">
          <div className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/80">
            Stockholm Innerstad
          </div>
        </div>
      </div>

      {/* Map Interactive Simulation & Navigation Footer */}
      <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Address Route Pill */}
        <div className="flex items-center gap-2 text-slate-300 w-full sm:w-auto truncate">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">{booking.pickupAddress.street}</span>
          <span className="text-slate-500">→</span>
          <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-[160px] font-medium">{booking.deliveryAddress.street}</span>
        </div>

        {/* Live Simulation Controls for Demo */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
              title={isPlaying ? 'Pausa simulering' : 'Spela GPS-simulering'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setProgress(0.1);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Återställ GPS-rutt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Rutt:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={progress}
              onChange={(e) => {
                setProgress(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="font-mono text-cyan-400 font-semibold w-8 text-right">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
