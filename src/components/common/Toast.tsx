import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal/Container - pointer-events-none so it doesn't block underlying page interaction */}
      <div 
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
        role="live"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.2 } }}
              layout
              className="pointer-events-auto w-full glass-card p-4 border border-white/5 rounded-xl flex items-start gap-3 shadow-2xl text-left bg-slate-900/90 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Visual Indicator Stripe */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                toast.type === 'success' ? 'bg-[#5EEAD4]' :
                toast.type === 'error' ? 'bg-red-500' :
                'bg-[#4F9DFF]'
              }`} />

              {/* Icon */}
              <div className="shrink-0 mt-0.5 ml-1">
                {toast.type === 'success' && <CheckCircle className="w-4.5 h-4.5 text-[#5EEAD4]" />}
                {toast.type === 'error' && <AlertCircle className="w-4.5 h-4.5 text-red-500" />}
                {toast.type === 'info' && <Info className="w-4.5 h-4.5 text-[#4F9DFF]" />}
              </div>

              {/* Content */}
              <div className="flex-1 pr-4">
                <p className="text-xs sm:text-sm font-semibold text-white leading-snug">{toast.message}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
