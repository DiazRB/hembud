import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, switchRole } = useApp();

  const handleNav = (view: string, service?: any) => {
    setCurrentView(view, service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.2z" />
                  <path d="m21 12-4.5 2.6" />
                  <path d="m21 12-4.5-2.6" />
                  <path d="M3 12h3" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Hem<span className="text-cyan-400">Bud</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Svensk förmedlande marknadsplats för trygga budtransporter. Vi kopplar samman privatpersoner och företag med lokala, oberoende bud.
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Verifierade användare med BankID</span>
            </div>
          </div>

          {/* Tjänster */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
              Våra tjänster
            </h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleNav('booking', 'package')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full"
                >
                  Skicka paket från dörr till dörr
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('booking', 'marketplace')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full"
                >
                  Hämta mitt köp (Blocket/Tradera)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('booking', 'agent_pickup')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full"
                >
                  Hämta hos ombud (PostNord, DHL)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('booking')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center gap-1.5 w-full text-cyan-400 font-semibold"
                >
                  <span>Boka transport direkt</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </li>
            </ul>
          </div>

          {/* För bud & Partners */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
              För bud & transportörer
            </h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => {
                    switchRole('courier');
                    handleNav('courier');
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full"
                >
                  Se lediga uppdrag på marknaden
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('courier');
                    handleNav('courier');
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full"
                >
                  Körningsvillkor & ersättning
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full"
                >
                  100% transparent budersättning
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    switchRole('admin');
                    handleNav('admin');
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left py-2 min-h-[40px] flex items-center w-full text-xs text-slate-500"
                >
                  Plattformsinställningar (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Kontakt & Verifiering med klickbara telefon och e-post */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-100">
              Kontakt & Support
            </h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2.5 py-1">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Stockholm, Göteborg & Malmö</span>
              </div>
              <a
                href="mailto:kontakt@hembud.se"
                className="flex items-center gap-2.5 py-2 min-h-[44px] hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>kontakt@hembud.se</span>
              </a>
              <a
                href="tel:081204000"
                className="flex items-center gap-2.5 py-2 min-h-[44px] hover:text-cyan-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>08-120 40 00 (Vardagar 08–20)</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  handleNav('home');
                  setTimeout(() => {
                    document.getElementById('faq-sektion')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="flex items-center gap-2.5 py-2 min-h-[44px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-left font-medium"
              >
                <span>Vanliga frågor & svar (FAQ)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>
            © 2026 HemBud Sverige AB. Alla rättigheter förbehållna.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span>Allmänna transportvillkor</span>
            <span aria-hidden="true">·</span>
            <span>Integritetspolicy</span>
            <span aria-hidden="true">·</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
