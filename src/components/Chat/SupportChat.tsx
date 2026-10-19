import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Send, 
  Headphones, 
  ArrowRight
} from 'lucide-react';

export const SupportChat: React.FC = () => {
  const { chatMessages, sendChatMessage, isChatOpen, setIsChatOpen } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickClick = (question: string) => {
    sendChatMessage(question);
  };

  // If chat is not open, do not render any floating bubbles (avoids covering buttons or bottom navigation)
  if (!isChatOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-zinc-200 shadow-2xl flex flex-col h-[560px] max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        role="dialog"
        aria-label="Kundservice"
      >
        {/* Chat Header */}
        <div className="bg-zinc-900 text-white px-5 py-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shrink-0">
              <Headphones className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Kundservice</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-zinc-400">Direkthjälp för beställare och bud</p>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Stäng kundservice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50/70 text-xs">
          
          <div className="bg-zinc-100 border border-zinc-200 rounded-xl p-2.5 text-[11px] text-zinc-600 text-center">
            Svensk kundsupport · BankID-verifierad säkerhet
          </div>

          {chatMessages.map((msg) => {
            const isSupport = msg.sender === 'support';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isSupport ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-zinc-400">
                  <span className="font-semibold text-zinc-600">{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isSupport
                      ? 'bg-white text-zinc-800 border border-zinc-200 shadow-xs rounded-tl-sm'
                      : 'bg-zinc-900 text-white rounded-tr-sm shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Quick action buttons if provided */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickClick(qa.label)}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <span>{qa.label}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Skriv din fråga här..."
            className="flex-1 px-3.5 py-2.5 text-xs bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            aria-label="Skicka meddelande"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
