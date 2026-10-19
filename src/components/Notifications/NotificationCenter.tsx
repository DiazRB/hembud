import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import { 
  Bell, 
  X, 
  Check, 
  Mail, 
  ExternalLink, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck 
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    currentUser, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    activeToast, 
    dismissToast,
    setCurrentView 
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEmailNotif, setSelectedEmailNotif] = useState<AppNotification | null>(null);

  // Filter notifications relevant to current user role
  const userNotifications = notifications.filter(
    n => n.recipientRole === currentUser.role || n.userId === currentUser.id
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleOpenNotif = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.bookingId) {
      if (currentUser.role === 'courier') {
        setCurrentView('courier');
      } else {
        setCurrentView('customer', undefined, notif.bookingId);
      }
    }
    setIsOpen(false);
  };

  const handleOpenEmail = (e: React.MouseEvent, notif: AppNotification) => {
    e.stopPropagation();
    markNotificationAsRead(notif.id);
    setSelectedEmailNotif(notif);
  };

  return (
    <>
      {/* ================= Notification Bell Trigger ================= */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          aria-label="Notifikationer"
          title="Notifikationer och e-postmeddelanden"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full border-2 border-white pointer-events-none">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-20 sm:top-auto sm:mt-2 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notiser & E-post
                </h4>
                <p className="text-[11px] text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} olästa händelser` : 'Alla händelser är lästa'}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] font-semibold text-cyan-700 hover:text-cyan-800 cursor-pointer"
                >
                  Markera alla som lästa
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {userNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Inga notifikationer än.
                </div>
              ) : (
                userNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleOpenNotif(notif)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                      !notif.read ? 'bg-cyan-50/40' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {notif.type === 'accepted' ? (
                        <Truck className="w-4 h-4" />
                      ) : notif.type === 'delivered' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>
                          {new Date(notif.timestamp).toLocaleTimeString('sv-SE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {notif.emailPreview && (
                          <button
                            type="button"
                            onClick={(e) => handleOpenEmail(e, notif)}
                            className="inline-flex items-center gap-1 font-semibold text-cyan-700 hover:text-cyan-800"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Visa e-postbekräftelse</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400">
                HemBud notifieringscenter · Realtid
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ================= Toast Notification Popup ================= */}
      {activeToast && (
        <div className="fixed top-24 right-4 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                Ny notis
              </span>
              <h5 className="text-xs font-bold text-white mt-0.5">{activeToast.title}</h5>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">{activeToast.message}</p>

              {activeToast.emailPreview && (
                <button
                  onClick={() => setSelectedEmailNotif(activeToast)}
                  className="mt-2 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>Visa skickat e-postkvitto</span>
                </button>
              )}
            </div>

            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= Simulated HTML Email Preview Modal ================= */}
      {selectedEmailNotif && selectedEmailNotif.emailPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">E-postmeddelande (Simulering)</h3>
                  <p className="text-[11px] text-slate-500">
                    Skickat till {selectedEmailNotif.emailPreview.recipientEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmailNotif(null)}
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Stäng e-postvisare"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Container preview */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-5 sm:space-y-6 text-slate-800">
              
              {/* Brand Banner in Email */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">HB</span>
                  </div>
                  <span className="font-bold text-slate-900 tracking-tight">HemBud Sverige</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedEmailNotif.emailPreview.sentAt}
                </span>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Ämne:
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedEmailNotif.emailPreview.subject}
                </h4>
              </div>

              {/* Greeting & snippet */}
              <div className="text-xs text-slate-600 space-y-2">
                <p>Hej {selectedEmailNotif.emailPreview.recipientName},</p>
                <p>{selectedEmailNotif.emailPreview.snippet}</p>
              </div>

              {/* Items / Receipt block */}
              {selectedEmailNotif.emailPreview.items && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                  {selectedEmailNotif.emailPreview.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                      <span className="text-slate-500">{item.label}:</span>
                      <span className="font-semibold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA button inside email */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setSelectedEmailNotif(null);
                    if (selectedEmailNotif.bookingId) {
                      setCurrentView('customer', undefined, selectedEmailNotif.bookingId);
                    }
                  }}
                  className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Öppna live-spårning</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>

              {/* Email Footer */}
              <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-1">
                <p>HemBud Sverige AB · Org.nr 559123-4567 · Stockholm</p>
                <p>Detta meddelande genereras automatiskt vid statusändringar i transporten.</p>
              </div>

            </div>

            <button
              onClick={() => setSelectedEmailNotif(null)}
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:scale-[0.98] transition-all cursor-pointer"
            >
              Stäng e-postvisare
            </button>

          </div>
        </div>
      )}
    </>
  );
};
