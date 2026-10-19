import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Truck, 
  Package, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  User, 
  Home, 
  PlusCircle, 
  ClipboardList,
  HelpCircle
} from 'lucide-react';

import { NotificationCenter } from './Notifications/NotificationCenter';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, currentRole, switchRole, currentUser, bookings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const myCustomerBookingsCount = bookings.filter(
    b => b.customerId === currentUser.id && b.status !== 'delivered' && b.status !== 'cancelled'
  ).length;
  const myCourierActiveCount = bookings.filter(
    b => b.courierId === currentUser.id && (b.status === 'accepted' || b.status === 'in_transit')
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-8 h-16 sm:h-20">
            
            {/* Zone 1: Logo & Brand Wordmark */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg shrink-0 cursor-pointer p-1 active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-700/80 shadow-[0_3px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.2z" />
                  <path d="m21 12-4.5 2.6" />
                  <path d="m21 12-4.5-2.6" />
                  <path d="M3 12h3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  Hem<span className="text-cyan-600">Bud</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  Transport
                </span>
              </div>
            </button>

            {/* Zone 2: Desktop Navigation Links (hidden on mobile) */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button
                onClick={() => handleNavClick('home')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  currentView === 'home' ? 'text-slate-950 font-semibold border-b-2 border-cyan-500' : ''
                }`}
              >
                Start
              </button>
              <button
                onClick={() => handleNavClick('booking')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  currentView === 'booking' ? 'text-slate-950 font-semibold border-b-2 border-cyan-500' : ''
                }`}
              >
                Boka transport
              </button>
              <button
                onClick={() => handleNavClick('courier')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'courier' ? 'text-slate-950 font-semibold border-b-2 border-cyan-500' : ''
                }`}
              >
                <span>Budens sida</span>
                {pendingCount > 0 && (
                  <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                    {pendingCount} nya
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('customer')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'customer' ? 'text-slate-950 font-semibold border-b-2 border-cyan-500' : ''
                }`}
              >
                <span>Kundpanel</span>
                {myCustomerBookingsCount > 0 && (
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {myCustomerBookingsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  currentView === 'admin' ? 'text-slate-950 font-semibold border-b-2 border-cyan-500' : ''
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
                  currentView === 'profile' ? 'text-slate-950 font-semibold border-b-2 border-cyan-500' : ''
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
                className="hover:text-slate-900 text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer text-xs"
              >
                FAQ
              </button>
            </nav>

            {/* Zone 3: Actions & Mobile Triggers */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Notification Center */}
              <NotificationCenter />

              {/* Role Switcher Button */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200/80 cursor-pointer min-h-[40px] active:scale-95"
                  title="Växla mellan rollerna Kund, Bud och Admin"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    currentRole === 'customer' ? 'bg-cyan-500' : currentRole === 'courier' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`} />
                  <span className="whitespace-nowrap">
                    {currentRole === 'customer' ? 'Kund' : currentRole === 'courier' ? 'Bud' : 'Admin'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {roleDropdownOpen && (
                  <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-auto sm:mt-2 sm:w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Aktiv användare</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    </div>
                    
                    <button
                      onClick={() => handleRoleSelect('customer')}
                      className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer min-h-[44px] ${
                        currentRole === 'customer' ? 'text-cyan-700 font-bold bg-cyan-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-cyan-600" />
                        <span>Kund (Beställare)</span>
                      </div>
                      {currentRole === 'customer' && (
                        <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-full">Aktiv</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('courier')}
                      className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer min-h-[44px] ${
                        currentRole === 'courier' ? 'text-cyan-700 font-bold bg-cyan-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Bud (Förare/Åkare)</span>
                      </div>
                      {currentRole === 'courier' && (
                        <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-full">Aktiv</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer min-h-[44px] ${
                        currentRole === 'admin' ? 'text-cyan-700 font-bold bg-cyan-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Administratör</span>
                      </div>
                      {currentRole === 'admin' && (
                        <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-full">Aktiv</span>
                      )}
                    </button>

                    <div className="pt-1.5 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          handleNavClick('profile');
                          setRoleDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between cursor-pointer min-h-[44px]"
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-cyan-600" />
                          <span>Min profil & inställningar</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Action Button (Desktop) */}
              <div className="hidden sm:block">
                {currentRole === 'courier' ? (
                  <button
                    onClick={() => handleNavClick('courier')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white btn-3d-slate rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    <span>Hitta uppdrag</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                ) : currentRole === 'admin' ? (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white btn-3d-slate rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    <span>Översikt</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('booking')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 btn-3d-cyan rounded-xl whitespace-nowrap cursor-pointer"
                  >
                    <span>Boka transport</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Hamburger Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
                aria-label="Öppna meny"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full Drawer / Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-4 pb-8 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Quick role switcher ribbon inside mobile drawer */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aktiv roll: <strong className="text-slate-900">{currentRole === 'customer' ? 'Kund' : currentRole === 'courier' ? 'Bud' : 'Admin'}</strong>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRoleSelect('customer')}
                  className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl text-center active:scale-95 transition-all cursor-pointer ${
                    currentRole === 'customer' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Kund
                </button>
                <button
                  onClick={() => handleRoleSelect('courier')}
                  className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl text-center active:scale-95 transition-all cursor-pointer ${
                    currentRole === 'courier' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Bud
                </button>
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl text-center active:scale-95 transition-all cursor-pointer ${
                    currentRole === 'admin' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Navigation links with large touch targets */}
            <div className="space-y-1.5">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer ${
                  currentView === 'home' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-cyan-600" />
                  <span>Start & Tjänster</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('booking')}
                className={`w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer ${
                  currentView === 'booking' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-cyan-600" />
                  <span>Boka ny transport</span>
                </div>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-100/70 px-2.5 py-1 rounded-full">
                  Snabbkalkyl
                </span>
              </button>

              <button
                onClick={() => handleNavClick('courier')}
                className={`w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer ${
                  currentView === 'courier' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-cyan-600" />
                  <span>Budens marknad</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-xs font-bold text-cyan-700 bg-cyan-100/70 px-2.5 py-1 rounded-full">
                    {pendingCount} tillgängliga
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('customer')}
                className={`w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer ${
                  currentView === 'customer' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-cyan-600" />
                  <span>Mina ordrar & historik</span>
                </div>
                {myCustomerBookingsCount > 0 && (
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                    {myCustomerBookingsCount} aktiva
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer ${
                  currentView === 'profile' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-600" />
                  <span>Min profil & säkerhet</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer ${
                  currentView === 'admin' ? 'bg-cyan-50 text-cyan-900 border border-cyan-200' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-600" />
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
                className="w-full text-left px-4 py-3.5 min-h-[48px] text-base font-semibold rounded-xl flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer text-slate-800 hover:bg-slate-50 border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-cyan-600" />
                  <span>Vanliga frågor (FAQ)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= Mobile Bottom Navigation Bar ================= */}
      {/* Provides instant thumb-reachable navigation on smartphones like native delivery apps */}
      <nav 
        aria-label="Mobilnavigering"
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1 pt-1.5 pb-2"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          
          {/* 1. Start */}
          <button
            onClick={() => handleNavClick('home')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              currentView === 'home' ? 'text-cyan-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <Home className={`w-5 h-5 mb-1 ${currentView === 'home' ? 'text-cyan-600 stroke-[2.5]' : 'text-slate-500'}`} />
            <span className="text-[10px] tracking-tight leading-none">Start</span>
          </button>

          {/* 2. Boka */}
          <button
            onClick={() => handleNavClick('booking')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              currentView === 'booking' ? 'text-cyan-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative mb-1">
              <PlusCircle className={`w-5 h-5 ${currentView === 'booking' ? 'text-cyan-600 stroke-[2.5]' : 'text-slate-500'}`} />
            </div>
            <span className="text-[10px] tracking-tight leading-none">Boka</span>
          </button>

          {/* 3. Bud */}
          <button
            onClick={() => handleNavClick('courier')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 relative ${
              currentView === 'courier' ? 'text-cyan-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative mb-1">
              <Truck className={`w-5 h-5 ${currentView === 'courier' ? 'text-cyan-600 stroke-[2.5]' : 'text-slate-500'}`} />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[15px] h-[15px] px-0.5 text-[9px] font-bold text-white bg-cyan-600 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight leading-none">Bud</span>
          </button>

          {/* 4. Ordrar */}
          <button
            onClick={() => handleNavClick('customer')}
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 relative ${
              currentView === 'customer' ? 'text-cyan-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative mb-1">
              <ClipboardList className={`w-5 h-5 ${currentView === 'customer' ? 'text-cyan-600 stroke-[2.5]' : 'text-slate-500'}`} />
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
            className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-90 ${
              currentView === 'profile' ? 'text-cyan-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 mb-1 ${currentView === 'profile' ? 'text-cyan-600 stroke-[2.5]' : 'text-slate-500'}`} />
            <span className="text-[10px] tracking-tight leading-none">Profil</span>
          </button>

        </div>
      </nav>
    </>
  );
};
