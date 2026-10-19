import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Home/Hero';
import { ServiceCards } from './components/Home/ServiceCards';
import { HowItWorks } from './components/Home/HowItWorks';
import { PriceEstimator } from './components/Home/PriceEstimator';
import { TrustSection } from './components/Home/TrustSection';
import { FaqSection } from './components/Home/FaqSection';
import { BookingWizard } from './components/Booking/BookingWizard';
import { CourierMarketplace } from './components/Courier/CourierMarketplace';
import { CustomerDashboard } from './components/Customer/CustomerDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ProfilePage } from './components/Profile/ProfilePage';
import { SupportChat } from './components/Chat/SupportChat';
import { ShieldAlert, ArrowRight, User } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, currentRole, switchRole, setCurrentView } = useApp();

  // Role Access Control checks as required in item 6:
  // "Använd behörighetskontroller så att varje roll bara kommer åt tillåtna sidor och uppgifter."
  const isViewAllowed = () => {
    if (currentView === 'admin' && currentRole !== 'admin') {
      return false;
    }
    return true;
  };

  const renderCurrentView = () => {
    if (!isViewAllowed()) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Behörighetskontroll</h2>
            <p className="text-sm text-slate-600">
              Den här sektionen kräver administratörsbehörighet. Du är just nu inloggad som{' '}
              <strong className="text-slate-900">{currentRole === 'customer' ? 'Kund' : 'Bud'}</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                switchRole('admin');
                setCurrentView('admin');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Växla till Admin-roll</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Tillbaka till startsidan
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'booking':
        return <BookingWizard />;
      case 'courier':
        return <CourierMarketplace />;
      case 'customer':
        return <CustomerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <ProfilePage />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <PriceEstimator />
            <ServiceCards />
            <HowItWorks />
            <FaqSection />
            <TrustSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden max-w-full pb-24 sm:pb-20 md:pb-0">
      <Navbar />
      <main className="flex-1 overflow-x-hidden max-w-full">{renderCurrentView()}</main>
      <SupportChat />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
