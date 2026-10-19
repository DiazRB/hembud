import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Truck, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  User, 
  Home, 
  PlusCircle, 
  ClipboardList,
  HelpCircle,
  Headphones
} from 'lucide-react';

import { NotificationCenter } from './Notifications/NotificationCenter';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, currentRole, switchRole, currentUser, bookings, setIsChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const myCustomerBookingsCount = bookings.filter(
    b => b.customerId === currentUser.id && b.status !== 'delivered' && b.status !== 'cancelled'
  ).length;

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <>
      {/* ================= Top Sticky Header ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-8 h-16 sm:h-20">
            
            {/* Zone 1: Logo & Brand Wordmark (Transport-text borttagen) */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl shrink-0 cursor-pointer p-1 active:scale-[0.98] transition-transform duration-100 ease-out motion-reduce:transition-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-center shrink-0">
                <svg 
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-cyan-400" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.2z" />
                  <path d="m21 12-4.5 2.6" />
                  <path d="m21 12-4.5-2.6" />
                  <path d="M3 12h3" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                Hem<span className="text-cyan-600">Bud</span>
              </span>
            </button>

            {/* Zone 2: Desktop Navigation Links (hidden on mobile and tablet portrait) */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-600">
              <button
                onClick={() => handleNavClick('home')}
                className={`py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out hover:text-slate-950 ${
                  currentView === 'home' 
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900' 
                    : 'border-b-2 border-transparent hover:border-slate-300'
                }`}
              >
                Start
              </button>
              <button
                onClick={() => handleNavClick('booking')}
                className={`py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out hover:text-slate-950 ${
                  currentView === 'booking' 
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900' 
                    : 'border-b-2 border-transparent hover:border-slate-300'
                }`}
              >
                Boka transport
              </button>
              <button
                onClick={() => handleNavClick('courier')}
                className={`py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-[0.98] transition-all duration-120 ease-out hover:text-slate-950 ${
                  currentView === 'courier' 
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900' 
                    : 'border-b-2 border-transparent hover:border-slate-300'
                }`}
              >
                <span>Budens sida</span>
                {pendingCount > 0 && (
                  <span className="text-[11px] font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                    {pendingCount} nya
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('customer')}
                className={`py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-[0.98] transition-all duration-120 ease-out hover:text-slate-950 ${
                  currentView === 'customer' 
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900' 
                    : 'border-b-2 border-transparent hover:border-slate-300'
                }`}
              >
                <span>Kundpanel</span>
                {myCustomerBookingsCount > 0 && (
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                    {myCustomerBookingsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className={`py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out hover:text-slate-950 ${
                  currentView === 'admin' 
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900' 
                    : 'border-b-2 border-transparent hover:border-slate-300'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className={`py-1.5 px-1 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out hover:text-slate-950 ${
                  currentView === 'profile' 
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900' 
                    : 'border-b-2 border-transparent hover:border-slate-300'
                }`}
              >
                Min profil
              </button>
              <button
                onClick={() => {
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('faq-sektion')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
                className="py-1.5 px-1 text-slate-500 hover:text-slate-900 transition-colors duration-120 ease-out whitespace-nowrap shrink-0 cursor-pointer text-xs active:scale-[0.98]"
              >
                FAQ
              </button>
            </nav>

            {/* Zone 3: Actions & Mobile Triggers */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Notification Center */}
              <NotificationCenter />

              {/* Kundservice / Support Trigger */}
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all duration-120 ease-out border border-slate-200 cursor-pointer min-h-[40px] active:scale-[0.98] motion-reduce:transition-none"
                title="Kontakta kundservice"
                aria-label="Öppna kundservice"
              >
                <Headphones className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Hjälp</span>
              </button>

              {/* Role Switcher Button */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all duration-120 ease-out border border-slate-200 cursor-pointer min-h-[40px] active:scale-[0.98] motion-reduce:transition-none"
                  title="Växla mellan rollerna Kund, Bud och Admin"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    currentRole === 'customer' ? 'bg-cyan-500' : currentRole === 'courier' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`} />
                  <span className="whitespace-nowrap">
                    {currentRole === 'customer' ? 'Kund' : currentRole === 'courier' ? 'Bud' : 'Admin'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 ease-out ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {roleDropdownOpen && (
                  <div 
                    className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-auto sm:mt-2 sm:w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 origin-top-right transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ animation: 'navbarDropdownIn 150ms cubic-bezier(0.23, 1, 0.32, 1) forwards' }}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Aktiv användare</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    </div>
                    
                    <button
                      onClick={() => handleRoleSelect('customer')}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer min-h-[44px] active:scale-[0.98] transition-all duration-100 ease-out ${
                        currentRole === 'customer' ? 'text-slate-950 font-bold bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-cyan-600" />
                        <span>Kund (Beställare)</span>
                      </div>
                      {currentRole === 'customer' && (
                        <span className="text-[11px] font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded-md">Aktiv</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('courier')}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer min-h-[44px] active:scale-[0.98] transition-all duration-100 ease-out ${
                        currentRole === 'courier' ? 'text-slate-950 font-bold bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Bud (Förare/Åkare)</span>
                      </div>
                      {currentRole === 'courier' && (
                        <span className="text-[11px] font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded-md">Aktiv</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer min-h-[44px] active:scale-[0.98] transition-all duration-100 ease-out ${
                        currentRole === 'admin' ? 'text-slate-950 font-bold bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Administratör</span>
                      </div>
                      {currentRole === 'admin' && (
                        <span className="text-[11px] font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded-md">Aktiv</span>
                      )}
                    </button>

                    <div className="pt-1.5 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          handleNavClick('profile');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer min-h-[44px] active:scale-[0.98] transition-all duration-100 ease-out"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-slate-500" />
                          <span>Min profil & inställningar</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Action Button (Desktop only, avoids cluttering tablet header) */}
              <div className="hidden lg:block">
                {currentRole === 'courier' ? (
                  <button
                    onClick={() => handleNavClick('courier')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl whitespace-nowrap cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out shadow-xs"
                  >
                    <span>Hitta uppdrag</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                ) : currentRole === 'admin' ? (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl whitespace-nowrap cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out shadow-xs"
                  >
                    <span>Översikt</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('booking')}
                    className="inline-flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl whitespace-nowrap cursor-pointer active:scale-[0.98] transition-all duration-120 ease-out shadow-xs"
                  >
                    <span>Boka transport</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>

              {/* Mobile & Tablet Menu Hamburger Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98] transition-all duration-100 ease-out"
                aria-label="Öppna meny"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Full Drawer / Overlay */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-8 space-y-4 shadow-xl origin-top transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ animation: 'drawerSlideIn 150ms cubic-bezier(0.23, 1, 0.32, 1) forwards' }}
          >
            {/* Quick role switcher ribbon inside mobile drawer */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aktiv roll: <strong className="text-slate-900">{currentRole === 'customer' ? 'Kund' : currentRole === 'courier' ? 'Bud' : 'Admin'}</strong>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRoleSelect('customer')}
                  className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl text-center active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                    currentRole === 'customer' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Kund
                </button>
                <button
                  onClick={() => handleRoleSelect('courier')}
                  className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl text-center active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                    currentRole === 'courier' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Bud
                </button>
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl text-center active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                    currentRole === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Navigation links with large touch targets */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                  currentView === 'home' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-slate-700" />
                  <span>Start & Tjänster</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('booking')}
                className={`w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                  currentView === 'booking' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-slate-700" />
                  <span>Boka ny transport</span>
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">
                  Snabbkalkyl
                </span>
              </button>

              <button
                onClick={() => handleNavClick('courier')}
                className={`w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                  currentView === 'courier' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-slate-700" />
                  <span>Budens marknad</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-xs font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">
                    {pendingCount} tillgängliga
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('customer')}
                className={`w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                  currentView === 'customer' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-slate-700" />
                  <span>Mina ordrar & historik</span>
                </div>
                {myCustomerBookingsCount > 0 && (
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {myCustomerBookingsCount} aktiva
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                  currentView === 'profile' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-700" />
                  <span>Min profil & säkerhet</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer ${
                  currentView === 'admin' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-slate-700" />
                  <span>Admin & Prisregler</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('faq-sektion')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                }}
                className="w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer text-slate-700 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-500" />
                  <span>Vanliga frågor (FAQ)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsChatOpen(true);
                }}
                className="w-full text-left px-4 py-3 min-h-[48px] text-sm font-semibold rounded-xl flex items-center justify-between active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-slate-700" />
                  <span>Kundservice & Live-chatt</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= Mobile Bottom Navigation Bar ================= */}
      {/* Instant thumb-reachable navigation on smartphones with Emil Kowalski active tactile response */}
      <nav 
        aria-label="Mobilnavigering"
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] px-1 pt-1.5 pb-2"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          
          {/* 1. Start */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all duration-100 ease-out cursor-pointer active:scale-[0.98] ${
              currentView === 'home' ? 'text-slate-950 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <Home className={`w-5 h-5 mb-1 ${currentView === 'home' ? 'text-slate-950 stroke-[2.3]' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight leading-none">Start</span>
          </button>

          {/* 2. Boka */}
          <button
            onClick={() => handleNavClick('booking')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all duration-100 ease-out cursor-pointer active:scale-[0.98] ${
              currentView === 'booking' ? 'text-slate-950 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative mb-1">
              <PlusCircle className={`w-5 h-5 ${currentView === 'booking' ? 'text-slate-950 stroke-[2.3]' : 'text-slate-400'}`} />
            </div>
            <span className="text-[10px] tracking-tight leading-none">Boka</span>
          </button>

          {/* 3. Bud */}
          <button
            onClick={() => handleNavClick('courier')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all duration-100 ease-out cursor-pointer active:scale-[0.98] relative ${
              currentView === 'courier' ? 'text-slate-950 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative mb-1">
              <Truck className={`w-5 h-5 ${currentView === 'courier' ? 'text-slate-950 stroke-[2.3]' : 'text-slate-400'}`} />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[9px] font-bold text-white bg-slate-900 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none">Bud</span>
          </button>

          {/* 4. Ordrar */}
          <button
            onClick={() => handleNavClick('customer')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all duration-100 ease-out cursor-pointer active:scale-[0.98] relative ${
              currentView === 'customer' ? 'text-slate-950 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative mb-1">
              <ClipboardList className={`w-5 h-5 ${currentView === 'customer' ? 'text-slate-950 stroke-[2.3]' : 'text-slate-400'}`} />
              {myCustomerBookingsCount > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[9px] font-bold text-white bg-slate-900 rounded-full">
                  {myCustomerBookingsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none">Ordrar</span>
          </button>

          {/* 5. Profil */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all duration-100 ease-out cursor-pointer active:scale-[0.98] ${
              currentView === 'profile' ? 'text-slate-950 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 mb-1 ${currentView === 'profile' ? 'text-slate-950 stroke-[2.3]' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight leading-none">Profil</span>
          </button>

        </div>
      </nav>
    </>
  );
};
